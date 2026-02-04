import { useApp, AVATARS } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { languages } from '../data/languages';
import { lessons } from '../data/lessons';
import { useState } from 'react';

export function ProfilePage({ onNavigate }) {
    const { user, updateAvatar } = useApp();
    const { isDark } = useTheme();
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);

    if (!user) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Please log in to view your profile.</p>
            </div>
        );
    }

    // Calculate stats
    const totalLessonsCompleted = Object.values(user.progress).reduce(
        (sum, p) => sum + p.lessonsCompleted.length, 0
    );
    // Use totalPoints from backend (source of truth)
    const totalPoints = user.totalPoints || 0;
    const languagesStarted = Object.keys(user.progress).length;
    // const dailyChallengesCompleted = user.dailyChallenges.filter(c => c.completed).length;
    // const storiesRead = user.storiesCompleted.length;

    // Calculate streak
    const getStreak = () => {
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

    // Progress chart data (last 7 days)
    const getLast7DaysData = () => {
        const data = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

            const historyEntry = user.learningHistory.find(h => h.date === dateStr);
            data.push({
                day: dayName,
                date: dateStr,
                points: historyEntry?.points || 0,
                lessons: historyEntry?.lessonsCompleted || 0,
            });
        }
        return data;
    };

    const chartData = getLast7DaysData();
    const maxPoints = Math.max(...chartData.map(d => d.points), 100);

    // Use achievements from backend (source of truth)
    const achievements = user.achievements || [];

    return (
        <div className={`min-h-screen py-8 px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-4xl mx-auto">
                {/* Header Card */}
                <div className={`rounded-2xl shadow-sm border p-6 mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <button
                                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                                className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-5xl hover:scale-105 transition-transform shadow-lg"
                            >
                                {user.avatar}
                            </button>
                            <button
                                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                                className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-md ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'}`}
                            >
                                ✏️
                            </button>

                            {/* Avatar Picker */}
                            {showAvatarPicker && (
                                <div className={`absolute top-full left-0 mt-2 p-4 rounded-xl shadow-xl border z-50 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                    <p className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Choose Avatar</p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {AVATARS.map((avatar) => (
                                            <button
                                                key={avatar}
                                                onClick={() => {
                                                    updateAvatar(avatar);
                                                    setShowAvatarPicker(false);
                                                }}
                                                className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-all hover:scale-110 ${user.avatar === avatar
                                                        ? 'bg-green-500 ring-2 ring-green-400'
                                                        : isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {avatar}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.name}</h1>
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                            <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                Member since {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </p>

                            {user.currentLanguage && (
                                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/50 rounded-full">
                                    <span>{languages.find(l => l.id === user.currentLanguage)?.flag}</span>
                                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                        Learning {languages.find(l => l.id === user.currentLanguage)?.name}
                                    </span>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border`}>
                        <div className="text-3xl mb-2">📚</div>
                        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{totalLessonsCompleted}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Lessons</p>
                    </div>
                    <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border`}>
                        <div className="text-3xl mb-2">⭐</div>
                        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{totalPoints}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Points</p>
                    </div>
                    <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border`}>
                        <div className="text-3xl mb-2">🔥</div>
                        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{streak}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Day Streak</p>
                    </div>
                    <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border`}>
                        <div className="text-3xl mb-2">🌍</div>
                        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{languagesStarted}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Languages</p>
                    </div>
                </div>

                {/* Progress Chart */}
                <div className={`rounded-2xl shadow-sm border p-6 mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                    <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <span>📊</span> Weekly Progress
                    </h2>

                    <div className="h-48 flex items-end justify-between gap-2">
                        {chartData.map((day, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex flex-col items-center justify-end h-36">
                                    <div
                                        className="w-full max-w-[40px] bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg transition-all hover:from-green-600 hover:to-emerald-500"
                                        style={{ height: `${Math.max((day.points / maxPoints) * 100, day.points > 0 ? 10 : 0)}%` }}
                                        title={`${day.points} points`}
                                    />
                                </div>
                                <div className="text-center">
                                    <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{day.day}</p>
                                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{day.points}pts</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Achievements */}
                <div className={`rounded-2xl shadow-sm border p-6 mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                    <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <span>🏆</span> Achievements ({achievements.length})
                    </h2>

                    {achievements.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {achievements.map((achievement) => (
                                <div
                                    key={achievement.id}
                                    className={`p-4 rounded-xl text-center transition-all hover:scale-105 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}
                                >
                                    <div className="text-4xl mb-2">{achievement.icon}</div>
                                    <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{achievement.name}</p>
                                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{achievement.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-4xl mb-3">🎯</p>
                            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Complete lessons to unlock achievements!</p>
                        </div>
                    )}
                </div>

                {/* Language Progress */}
                <div className={`rounded-2xl shadow-sm border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                    <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <span>🌐</span> Language Progress
                    </h2>

                    <div className="space-y-4">
                        {Object.entries(user.progress).map(([langId, progress]) => {
                            const language = languages.find(l => l.id === langId);
                            const langLessons = lessons[langId] || [];
                            const percentage = langLessons.length > 0
                                ? Math.round((progress.lessonsCompleted.length / langLessons.length) * 100)
                                : 0;

                            return (
                                <div key={langId} className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{language?.flag}</span>
                                            <div>
                                                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{language?.name}</p>
                                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {progress.lessonsCompleted.length}/{langLessons.length} lessons • {progress.totalScore} points
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{percentage}%</span>
                                    </div>
                                    <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                        <div
                                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        {Object.keys(user.progress).length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-4xl mb-3">🌍</p>
                                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Start learning a language to track your progress!</p>
                                <button
                                    onClick={() => onNavigate('languages')}
                                    className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                                >
                                    Choose Language
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
