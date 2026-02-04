import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPages';
import { Dashboard } from './components/Dashboard';
import { LanguageSelect } from './components/LanguageSelect';
import { LessonPage } from './components/LessonPage';
import { ProfilePage } from './components/ProfilePage';
import { DailyChallenge } from './components/DailyChallenge';
import { FlashcardSystem } from './components/FlashcardSystem';
import { StoriesPage } from './components/StoriesPage';
import { CertificatePage } from './components/CertificatePage';
import { OnboardingTutorial } from './components/OnboardingTutorial';
import { PracticeMode } from './components/PracticeMode';

function AppContent() {
    const { isAuthenticated, user } = useApp();
    const { isDark } = useTheme();
    const [currentPage, setCurrentPage] = useState(isAuthenticated ? 'dashboard' : 'landing');
    const [lessonState, setLessonState] = useState(null);
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Check if we need to show onboarding
    useEffect(() => {
        if (isAuthenticated && user && !user.onboardingCompleted) {
            setShowOnboarding(true);
        }
    }, [isAuthenticated, user]);

    // Update page when auth state changes
    useEffect(() => {
        if (isAuthenticated && currentPage === 'landing') {
            setCurrentPage('dashboard');
        } else if (!isAuthenticated && ['dashboard', 'languages', 'lesson', 'profile', 'daily-challenge', 'flashcards', 'stories', 'certificates', 'practice'].includes(currentPage)) {
            setCurrentPage('landing');
        }
    }, [isAuthenticated]);

    const navigate = (page) => {
        setCurrentPage(page);
        setLessonState(null);
    };

    const startLesson = (languageId, lessonId) => {
        setLessonState({ languageId, lessonId });
        setCurrentPage('lesson');
    };

    const completeLesson = () => {
        setLessonState(null);
        setCurrentPage('dashboard');
    };

    // Redirect to login if not authenticated and trying to access protected pages
    if (!isAuthenticated && ['dashboard', 'languages', 'lesson', 'profile', 'daily-challenge', 'flashcards', 'stories', 'certificates', 'practice'].includes(currentPage)) {
        return (
            <div className={isDark ? 'dark' : ''}>
                <Navbar onNavigate={navigate} currentPage={currentPage} />
                <LandingPage onNavigate={navigate} />
            </div>
        );
    }

    // Full screen pages (no navbar)
    if (currentPage === 'lesson' && lessonState) {
        return (
            <>
                {showOnboarding && <OnboardingTutorial onComplete={() => setShowOnboarding(false)} />}
                <LessonPage
                    languageId={lessonState.languageId}
                    lessonId={lessonState.lessonId}
                    onComplete={completeLesson}
                    onExit={() => navigate('dashboard')}
                />
            </>
        );
    }

    if (currentPage === 'daily-challenge') {
        return (
            <>
                {showOnboarding && <OnboardingTutorial onComplete={() => setShowOnboarding(false)} />}
                <DailyChallenge onExit={() => navigate('dashboard')} />
            </>
        );
    }

    if (currentPage === 'flashcards') {
        return (
            <>
                {showOnboarding && <OnboardingTutorial onComplete={() => setShowOnboarding(false)} />}
                <FlashcardSystem onExit={() => navigate('dashboard')} />
            </>
        );
    }

    if (currentPage === 'stories') {
        return (
            <>
                {showOnboarding && <OnboardingTutorial onComplete={() => setShowOnboarding(false)} />}
                <StoriesPage onExit={() => navigate('dashboard')} />
            </>
        );
    }

    if (currentPage === 'certificates') {
        return (
            <>
                {showOnboarding && <OnboardingTutorial onComplete={() => setShowOnboarding(false)} />}
                <CertificatePage onExit={() => navigate('dashboard')} />
            </>
        );
    }

    if (currentPage === 'practice') {
        return (
            <>
                {showOnboarding && <OnboardingTutorial onComplete={() => setShowOnboarding(false)} />}
                <PracticeMode onExit={() => navigate('dashboard')} />
            </>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors`}>
            {showOnboarding && <OnboardingTutorial onComplete={() => setShowOnboarding(false)} />}
            <Navbar onNavigate={navigate} currentPage={currentPage} />

            {currentPage === 'landing' && <LandingPage onNavigate={navigate} />}
            {currentPage === 'login' && <AuthPage onNavigate={navigate} type="login" />}
            {currentPage === 'register' && <AuthPage onNavigate={navigate} type="register" />}
            {currentPage === 'dashboard' && (
                <Dashboard onNavigate={navigate} onStartLesson={startLesson} />
            )}
            {currentPage === 'languages' && <LanguageSelect onNavigate={navigate} />}
            {currentPage === 'profile' && <ProfilePage onNavigate={navigate} />}
        </div>
    );
}

export function App() {
    return (
        <ThemeProvider>
            <AppProvider>
                <AppContent />
            </AppProvider>
        </ThemeProvider>
    );
}
