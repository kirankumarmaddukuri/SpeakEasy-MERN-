import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, progressAPI, challengeAPI, userAPI } from '../services/api';
import { languages } from '../data/languages';

const AppContext = createContext(undefined);

const STORAGE_KEY = 'lingualearn_user';
const TOKEN_KEY = 'token';

const AVATARS = ['👤', '🧑‍🎓', '👨‍💻', '👩‍🏫', '🦊', '🐼', '🦁', '🐸', '🦉', '🐧', '🦋', '🌟'];

export { AVATARS };

// Helper to convert backend user format to frontend UserProfile format
function hydrateUserFromBackend(apiUser, progressData) {
    // Convert backend languages array to frontend progress object
    // Use the data from User model which is the source of truth for progress
    const progress = {};
    if (apiUser.languages && Array.isArray(apiUser.languages)) {
        apiUser.languages.forEach((lang) => {
            if (lang.code) {
                progress[lang.code] = {
                    lessonsCompleted: lang.completedLessons || [],
                    totalScore: lang.totalScore || 0,
                };
            }
        });
    }

    // Use backend totals directly - don't recalculate from progress data
    const totalPoints = apiUser.totalPoints || 0;
    const achievements = apiUser.achievements || [];

    // Use currentLanguage from backend if set, otherwise set a default for new users
    let currentLanguage = apiUser.currentLanguage;
    if (!currentLanguage && apiUser.languages && apiUser.languages.length > 0) {
        // For users without a currentLanguage set, default to the first language
        currentLanguage = apiUser.languages[0].code;
    }

    // Convert backend dailyChallenges to frontend format
    const dailyChallenges = [];
    if (apiUser.dailyChallenges && Array.isArray(apiUser.dailyChallenges)) {
        apiUser.dailyChallenges.forEach((challenge) => {
            if (challenge.completed && challenge.date) {
                dailyChallenges.push({
                    date: challenge.date,
                    completed: true,
                    score: challenge.score || 0,
                    languageId: apiUser.currentLanguage || 'spanish', // fallback
                });
            }
        });
    }

    // Convert backend flashcardProgress array to frontend object format
    const flashcardProgress = {};
    if (apiUser.flashcardProgress && Array.isArray(apiUser.flashcardProgress)) {
        apiUser.flashcardProgress.forEach((fp) => {
            if (fp.language) {
                const langProgress = {};
                // Reconstruct card progress from knownCards and learningCards
                (fp.knownCards || []).forEach((cardId) => {
                    langProgress[cardId] = {
                        lastReviewed: new Date().toISOString(),
                        correctCount: 3, // Known cards have at least 3 correct
                        wrongCount: 0,
                        nextReview: new Date().toISOString(),
                    };
                });
                (fp.learningCards || []).forEach((cardId) => {
                    if (!langProgress[cardId]) {
                        langProgress[cardId] = {
                            lastReviewed: new Date().toISOString(),
                            correctCount: 0,
                            wrongCount: 0,
                            nextReview: new Date().toISOString(),
                        };
                    }
                });
                flashcardProgress[fp.language] = langProgress;
            }
        });
    }

    // Convert backend completedStories to frontend array
    const storiesCompleted = [];
    if (apiUser.completedStories && Array.isArray(apiUser.completedStories)) {
        apiUser.completedStories.forEach((story) => {
            if (story.storyId) {
                storiesCompleted.push(story.storyId);
            }
        });
    }

    // Build learning history from progress data
    const learningHistory = [];
    if (progressData && Array.isArray(progressData)) {
        const historyMap = {};
        progressData.forEach((record) => {
            const date = new Date(record.date).toISOString().split('T')[0];
            if (!historyMap[date]) {
                historyMap[date] = { lessonsCompleted: 0, points: 0 };
            }
            if (record.passed) {
                historyMap[date].lessonsCompleted += 1;
            }
            historyMap[date].points += record.score;
        });
        Object.entries(historyMap).forEach(([date, data]) => {
            learningHistory.push({ date, ...data });
        });
        learningHistory.sort((a, b) => a.date.localeCompare(b.date));
    }

    return {
        id: apiUser._id || apiUser.id || Date.now().toString(),
        name: apiUser.name,
        email: apiUser.email,
        currentLanguage: currentLanguage ?? null,
        progress,
        avatar: apiUser.avatar ?? AVATARS[0],
        joinedAt: apiUser.createdAt ? new Date(apiUser.createdAt).toISOString() : new Date().toISOString(),
        totalTimeSpent: 0,
        totalPoints: totalPoints,
        achievements: achievements,
        dailyChallenges,
        flashcardProgress,
        storiesCompleted,
        onboardingCompleted: !!apiUser.onboardingCompleted,
        learningHistory,
    };
}

export function AppProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Prefer server session (JWT) if present; fallback to cached user for offline UI.
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            Promise.all([authAPI.me(), progressAPI.getProgress()])
                .then(([meRes, progressRes]) => {
                    // Backend returns { success, data: user }
                    const apiUser = meRes?.data;
                    const progressData = progressRes?.data;
                    if (!apiUser) return;

                    const hydrated = hydrateUserFromBackend(apiUser, progressData);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(hydrated));
                    setUser(hydrated);
                })
                .catch(() => {
                    // Token invalid/expired; clear it and fall back to cached user.
                    localStorage.removeItem(TOKEN_KEY);
                    const savedUser = localStorage.getItem(STORAGE_KEY);
                    if (savedUser) setUser(JSON.parse(savedUser));
                });
            return;
        }

        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    const saveUser = (userData) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
    };

    const login = async (email, password) => {
        try {
            const res = await authAPI.login(email, password);
            localStorage.setItem(TOKEN_KEY, res.token);

            // Fetch full user data from backend
            const meRes = await authAPI.me();
            const progressRes = await progressAPI.getProgress();
            const hydrated = hydrateUserFromBackend(meRes.data, progressRes.data);
            saveUser(hydrated);
            return true;
        } catch {
            return false;
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await authAPI.register(name, email, password);
            localStorage.setItem(TOKEN_KEY, res.token);

            // Fetch full user data from backend
            const meRes = await authAPI.me();
            const progressRes = await progressAPI.getProgress();
            const hydrated = hydrateUserFromBackend(meRes.data, progressRes.data);
            saveUser(hydrated);
            return true;
        } catch {
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
    };

    const selectLanguage = async (languageId) => {
        if (!user) return;

        const languageData = languages.find(lang => lang.id === languageId);
        if (!languageData) return;

        const updatedUser = {
            ...user,
            currentLanguage: languageId,
            progress: {
                ...user.progress,
                [languageId]: user.progress[languageId] || { lessonsCompleted: [], totalScore: 0 },
            },
        };
        saveUser(updatedUser);

        // Persist to backend (map frontend format to backend format)
        try {
            await userAPI.updateCurrentLanguage({
                code: languageData.id,
                name: languageData.name,
                flag: languageData.flag
            });
        } catch (error) {
            // If API call fails, the local state is still updated for better UX
            console.error('Failed to persist language selection:', error);
        }
    };

    const completeLesson = (
        languageId,
        lessonId,
        score,
        totalQuestions,
        correctAnswers
    ) => {
        if (!user) return;

        const currentProgress = user.progress[languageId] || { lessonsCompleted: [], totalScore: 0 };
        const isNewCompletion = !currentProgress.lessonsCompleted.includes(lessonId);

        const updatedProgress = {
            lessonsCompleted: isNewCompletion
                ? [...currentProgress.lessonsCompleted, lessonId]
                : currentProgress.lessonsCompleted,
            totalScore: currentProgress.totalScore + score,
        };

        const today = new Date().toISOString().split('T')[0];
        const existingHistory = user.learningHistory.find(h => h.date === today);
        let updatedHistory = [...user.learningHistory];

        if (existingHistory) {
            updatedHistory = updatedHistory.map(h =>
                h.date === today
                    ? { ...h, lessonsCompleted: h.lessonsCompleted + (isNewCompletion ? 1 : 0), points: h.points + score }
                    : h
            );
        } else {
            updatedHistory.push({ date: today, lessonsCompleted: isNewCompletion ? 1 : 0, points: score });
        }

        const updatedUser = {
            ...user,
            progress: {
                ...user.progress,
                [languageId]: updatedProgress,
            },
            learningHistory: updatedHistory.slice(-30), // Keep last 30 days
        };
        saveUser(updatedUser);

        // Persist to backend (fire-and-forget)
        const passed = score >= 70; // simple threshold; UI already enforces requiredScore
        progressAPI
            .saveLesson({
                language: languageId,
                lessonId,
                score,
                totalQuestions,
                correctAnswers,
                passed,
            })
            .catch(() => {
                // ignore network errors for now; local state already updated
            });
    };

    const getProgress = (languageId) => {
        if (!user) return null;
        return user.progress[languageId] || null;
    };

    const updateAvatar = async (avatar) => {
        if (!user) return;
        const updatedUser = { ...user, avatar };
        saveUser(updatedUser);

        try {
            await userAPI.updateProfile({ avatar });
        } catch (error) {
            console.error('Failed to update avatar on server:', error);
            // Optionally revert local state or show notification 
        }
    };

    const completeDailyChallenge = (languageId, score, bonusPoints) => {
        if (!user) return;

        const today = new Date().toISOString().split('T')[0];
        const updatedChallenges = user.dailyChallenges.filter(c => c.date !== today);
        // include bonusPoints in local record
        updatedChallenges.push({ date: today, completed: true, score, bonusPoints, languageId });

        const updatedUser = {
            ...user,
            dailyChallenges: updatedChallenges.slice(-30),
            totalTimeSpent: user.totalTimeSpent,
            // update totalPoints immediately in UI to reflect bonus only
            totalPoints: (user.totalPoints || 0) + (bonusPoints || 0),
        };

        saveUser(updatedUser);

        // Persist to backend and reconcile with server response if available
        challengeAPI
            .submitDailyChallenge(score, bonusPoints)
            .then((res) => {
                // backend returns updated totals; merge to ensure canonical state
                try {
                    if (res && (res.data?.totalPoints || res.data?.dailyChallenges)) {
                        const serverPoints = res.data.totalPoints;
                        const serverDaily = res.data.dailyChallenges;
                        saveUser({ ...updatedUser, totalPoints: serverPoints, dailyChallenges: serverDaily });
                    }
                } catch (e) {
                    // ignore malformed response
                }
            })
            .catch(() => {
                // ignore network errors for now
            });
    };

    const getDailyChallenge = () => {
        if (!user) return null;
        const today = new Date().toISOString().split('T')[0];
        return user.dailyChallenges.find(c => c.date === today) || null;
    };

    const updateFlashcardProgress = (languageId, cardId, correct) => {
        if (!user) return;

        const langProgress = user.flashcardProgress[languageId] || {};
        const cardProgress = langProgress[cardId] || { lastReviewed: '', correctCount: 0, wrongCount: 0, nextReview: '' };

        const now = new Date();
        const nextReviewDays = correct ? Math.min((cardProgress.correctCount + 1) * 2, 14) : 1;
        const nextReview = new Date(now.getTime() + nextReviewDays * 24 * 60 * 60 * 1000).toISOString();

        const updatedProgress = {
            ...user.flashcardProgress,
            [languageId]: {
                ...langProgress,
                [cardId]: {
                    lastReviewed: now.toISOString(),
                    correctCount: correct ? cardProgress.correctCount + 1 : cardProgress.correctCount,
                    wrongCount: correct ? cardProgress.wrongCount : cardProgress.wrongCount + 1,
                    nextReview,
                },
            },
        };

        const updatedUser = { ...user, flashcardProgress: updatedProgress };
        saveUser(updatedUser);

        // Persist summary to backend: classify cards into known / learning
        const langState = updatedProgress[languageId] || {};
        const knownCards = [];
        const learningCards = [];

        Object.entries(langState).forEach(([id, prog]) => {
            const stats = prog;
            if ((stats.correctCount ?? 0) >= 3) {
                knownCards.push(id);
            } else {
                learningCards.push(id);
            }
        });

        progressAPI
            .saveFlashcardProgress(languageId, knownCards, learningCards)
            .catch(() => {
                // ignore network errors
            });
    };

    const completeStory = (storyId) => {
        if (!user) return;
        if (!user.storiesCompleted.includes(storyId)) {
            const updatedUser = {
                ...user,
                storiesCompleted: [...user.storiesCompleted, storyId],
            };
            saveUser(updatedUser);

            progressAPI
                .saveStoryCompletion(storyId)
                .catch(() => {
                    // ignore network errors
                });
        }
    };

    const completeOnboarding = async () => {
        if (!user) return;
        try {
            await userAPI.completeOnboarding();
            saveUser({ ...user, onboardingCompleted: true });
        } catch (error) {
            // If API call fails, still update local state for better UX
            saveUser({ ...user, onboardingCompleted: true });
        }
    };

    const addLearningHistory = (lessonsCompleted, points) => {
        if (!user) return;
        const today = new Date().toISOString().split('T')[0];
        const existingHistory = user.learningHistory.find(h => h.date === today);
        let updatedHistory = [...user.learningHistory];

        if (existingHistory) {
            updatedHistory = updatedHistory.map(h =>
                h.date === today
                    ? { ...h, lessonsCompleted: h.lessonsCompleted + lessonsCompleted, points: h.points + points }
                    : h
            );
        } else {
            updatedHistory.push({ date: today, lessonsCompleted, points });
        }

        saveUser({ ...user, learningHistory: updatedHistory.slice(-30) });
    };

    return (
        <AppContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                selectLanguage,
                completeLesson,
                getProgress,
                updateAvatar,
                completeDailyChallenge,
                getDailyChallenge,
                updateFlashcardProgress,
                completeStory,
                completeOnboarding,
                addLearningHistory,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
