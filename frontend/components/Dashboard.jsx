import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { languages } from '../data/languages';
import { lessons } from '../data/lessons';

export function Dashboard({ onNavigate, onStartLesson }) {
    const { user, getProgress, getDailyChallenge } = useApp();
    const { isDark } = useTheme();

    const currentLanguage = user?.currentLanguage
        ? languages.find((l) => l.id === user.currentLanguage)
        : null;

    const languageLessons = currentLanguage ? lessons[currentLanguage.id] || [] : [];
    const progress = currentLanguage ? getProgress(currentLanguage.id) : null;

    const completedLessons = progress?.lessonsCompleted || [];
    const totalScore = progress?.totalScore || 0;

    const dailyChallenge = getDailyChallenge();
    const isDailyChallengeCompleted = dailyChallenge?.completed || false;

    // Calculate streak
    const getStreak = () => {
        if (!user?.learningHistory) return 0;
        const sortedHistory = [...user.learningHistory].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < sortedHistory.length; i++) {
            const historyDate = new Date(sortedHistory[i].date);
            historyDate.setHours(0, 0, 0, 0);

            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);

            if (historyDate.getTime() === expectedDate.getTime()) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    };

    const streak = getStreak();

    if (!currentLanguage) {
        return (
            <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="text-center max-w-md">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <span className="text-4xl">🌍</span>
                    </div>
                    <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>No Language Selected</h2>
                    <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Choose a language to start your learning journey!
                    </p>
                    <button
                        onClick={() => onNavigate('languages')}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md"
                    >
                        Choose a Language
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen py-8 px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className={`rounded-2xl shadow-sm border p-6 mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <span className={`fi fi-${currentLanguage.code} text-5xl rounded shadow-sm`} />
                            <div>
                                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Learning {currentLanguage.name}
                                </h1>
                                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>{currentLanguage.description}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => onNavigate('languages')}
                            className="px-4 py-2 text-green-500 hover:bg-green-500/10 rounded-lg font-medium transition-colors"
                        >
                            Change Language
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-green-900' : 'bg-green-100'}`}>
                                <span className="text-xl">📖</span>
                            </div>
                            <div>
                                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{completedLessons.length}</p>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Lessons</p>
                            </div>
                        </div>
                    </div>
                    <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                                <span className="text-xl">⭐</span>
                            </div>
                            <div>
                                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{totalScore}</p>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Points</p>
                            </div>
                        </div>
                    </div>
                    <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-orange-900' : 'bg-orange-100'}`}>
                                <span className="text-xl">🔥</span>
                            </div>
                            <div>
                                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{streak}</p>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Streak</p>
                            </div>
                        </div>
                    </div>
                    <div className={`rounded-xl shadow-sm border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
                                <span className="text-xl">📊</span>
                            </div>
                            <div>
                                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {languageLessons.length > 0 ? Math.round((completedLessons.length / languageLessons.length) * 100) : 0}%
                                </p>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Progress</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <button
                        onClick={() => onNavigate('daily-challenge')}
                        className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${isDailyChallengeCompleted
                            ? isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
                            : isDark ? 'bg-orange-900/20 border-orange-700 hover:border-orange-500' : 'bg-orange-50 border-orange-200 hover:border-orange-400'
                            }`}
                    >
                        <span className="text-3xl block mb-2">{isDailyChallengeCompleted ? '✅' : '🎯'}</span>
                        <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Daily Challenge</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {isDailyChallengeCompleted ? 'Completed!' : 'Ready!'}
                        </p>
                    </button>

                    <button
                        onClick={() => onNavigate('flashcards')}
                        className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${isDark ? 'bg-purple-900/20 border-purple-700 hover:border-purple-500' : 'bg-purple-50 border-purple-200 hover:border-purple-400'
                            }`}
                    >
                        <span className="text-3xl block mb-2">🃏</span>
                        <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Flashcards</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Study vocab</p>
                    </button>

                    <button
                        onClick={() => onNavigate('stories')}
                        className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${isDark ? 'bg-indigo-900/20 border-indigo-700 hover:border-indigo-500' : 'bg-indigo-50 border-indigo-200 hover:border-indigo-400'
                            }`}
                    >
                        <span className="text-3xl block mb-2">📖</span>
                        <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Stories</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Read & learn</p>
                    </button>

                    <button
                        onClick={() => onNavigate('practice')}
                        className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${isDark ? 'bg-blue-900/20 border-blue-700 hover:border-blue-500' : 'bg-blue-50 border-blue-200 hover:border-blue-400'
                            }`}
                    >
                        <span className="text-3xl block mb-2">🔄</span>
                        <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Practice</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Review lessons</p>
                    </button>
                </div>

                {/* More Features */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <button
                        onClick={() => onNavigate('profile')}
                        className={`p-4 rounded-xl border transition-all hover:shadow-md ${isDark ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-100 hover:border-gray-200'
                            }`}
                    >
                        <span className="text-2xl block mb-1">👤</span>
                        <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Profile</p>
                    </button>

                    <button
                        onClick={() => onNavigate('certificates')}
                        className={`p-4 rounded-xl border transition-all hover:shadow-md ${isDark ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-100 hover:border-gray-200'
                            }`}
                    >
                        <span className="text-2xl block mb-1">🏆</span>
                        <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Certificates</p>
                    </button>

                    <button
                        onClick={() => onNavigate('languages')}
                        className={`p-4 rounded-xl border transition-all hover:shadow-md ${isDark ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-100 hover:border-gray-200'
                            }`}
                    >
                        <span className="text-2xl block mb-1">🌍</span>
                        <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Languages</p>
                    </button>
                </div>

                {/* Lessons */}
                <div className={`rounded-2xl shadow-sm border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                    <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Lessons</h2>
                    <div className="space-y-4">
                        {languageLessons.map((lesson, index) => {
                            const isCompleted = completedLessons.includes(lesson.id);
                            const isLocked = index > 0 && !completedLessons.includes(languageLessons[index - 1].id);

                            return (
                                <div
                                    key={lesson.id}
                                    className={`relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${isLocked
                                        ? isDark
                                            ? 'bg-gray-700/50 border-gray-600 opacity-60'
                                            : 'bg-gray-50 border-gray-200 opacity-60'
                                        : isCompleted
                                            ? isDark
                                                ? 'bg-green-900/30 border-green-700 hover:border-green-600'
                                                : 'bg-green-50 border-green-200 hover:border-green-300'
                                            : isDark
                                                ? 'bg-gray-700 border-gray-600 hover:border-green-500 hover:shadow-md cursor-pointer'
                                                : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md cursor-pointer'
                                        }`}
                                    onClick={() => !isLocked && onStartLesson(currentLanguage.id, lesson.id)}
                                >
                                    <div
                                        className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl ${isCompleted
                                            ? 'bg-green-500 text-white'
                                            : isLocked
                                                ? isDark ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-400'
                                                : 'bg-gradient-to-br from-green-400 to-emerald-600 text-white'
                                            }`}
                                    >
                                        {isCompleted ? '✓' : isLocked ? '🔒' : index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{lesson.title}</h3>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{lesson.description}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {lesson.exercises.length} exercises
                                            </span>
                                            {isCompleted && (
                                                <span className="text-xs text-green-500 font-medium">Completed</span>
                                            )}
                                        </div>
                                    </div>
                                    {!isLocked && !isCompleted && (
                                        <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all">
                                            Start
                                        </button>
                                    )}
                                    {isCompleted && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onStartLesson(currentLanguage.id, lesson.id);
                                            }}
                                            className={`px-4 py-2 border-2 border-green-500 text-green-500 rounded-lg font-medium transition-all ${isDark ? 'hover:bg-green-500/20' : 'hover:bg-green-50'
                                                }`}
                                        >
                                            Redo
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
