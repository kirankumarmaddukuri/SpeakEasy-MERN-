import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { languages } from '../data/languages';
import { lessons } from '../data/lessons';

export function LanguageSelect({ onNavigate }) {
    const { user, selectLanguage, getProgress } = useApp();
    const { isDark } = useTheme();

    const handleSelectLanguage = (languageId) => {
        selectLanguage(languageId);
        onNavigate('dashboard');
    };

    return (
        <div className={`min-h-screen py-12 px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Choose Your Language
                    </h1>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Select a language to start learning or continue your progress
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {languages.map((language) => {
                        const languageLessons = lessons[language.id] || [];
                        const progress = getProgress(language.id);
                        const completedCount = progress?.lessonsCompleted.length || 0;
                        const isCurrentLanguage = user?.currentLanguage === language.id;

                        return (
                            <div
                                key={language.id}
                                onClick={() => handleSelectLanguage(language.id)}
                                className={`rounded-2xl p-6 border-2 cursor-pointer transition-all hover:shadow-lg ${isCurrentLanguage
                                    ? 'border-green-500 ring-2 ring-green-500/30'
                                    : isDark
                                        ? 'bg-gray-800 border-gray-700 hover:border-green-500'
                                        : 'bg-white border-gray-100 hover:border-green-300'
                                    } ${isCurrentLanguage ? (isDark ? 'bg-green-900/20' : 'bg-green-50') : ''}`}
                            >
                                <div className="text-center mb-4">
                                    <span className={`fi fi-${language.code} text-6xl mb-4 block mx-auto`} />
                                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{language.name}</h3>
                                    {isCurrentLanguage && (
                                        <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${isDark ? 'bg-green-800 text-green-300' : 'bg-green-100 text-green-700'
                                            }`}>
                                            Currently Learning
                                        </span>
                                    )}
                                </div>
                                <p className={`text-sm text-center mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {language.description}
                                </p>

                                {/* Progress bar */}
                                {languageLessons.length > 0 && (
                                    <div className="mt-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Progress</span>
                                            <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {completedCount}/{languageLessons.length} lessons
                                            </span>
                                        </div>
                                        <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                            <div
                                                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all"
                                                style={{
                                                    width: `${(completedCount / languageLessons.length) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <button
                                    className={`w-full mt-6 py-3 rounded-xl font-semibold transition-all ${isCurrentLanguage
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : isDark
                                            ? 'bg-gray-700 text-gray-300 hover:bg-green-500 hover:text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-green-500 hover:text-white'
                                        }`}
                                >
                                    {completedCount > 0 ? 'Continue' : 'Start Learning'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
