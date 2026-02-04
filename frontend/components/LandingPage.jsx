import { useTheme } from '../context/ThemeContext';
import { languages } from '../data/languages';

export function LandingPage({ onNavigate }) {
    const { isDark } = useTheme();

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-green-50 to-white'}`}>
            {/* Hero Section */}
            <section className="pt-20 pb-32 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Learn a new language
                        <span className="block bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                            the fun way
                        </span>
                    </h1>
                    <p className={`text-xl mb-10 max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Master any language with bite-sized lessons, interactive exercises, and personalized learning paths. Join millions of learners worldwide!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => onNavigate('register')}
                            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Get Started Free
                        </button>
                        <button
                            onClick={() => onNavigate('login')}
                            className={`px-8 py-4 rounded-xl font-semibold text-lg border-2 transition-all ${isDark
                                ? 'bg-gray-800 text-gray-200 border-gray-600 hover:border-green-500 hover:text-green-400'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:text-green-600'
                                }`}
                        >
                            I Already Have an Account
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={`py-20 px-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="max-w-6xl mx-auto">
                    <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Why Choose SpeakEasy?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className={`text-center p-8 rounded-2xl border ${isDark
                            ? 'bg-gradient-to-b from-gray-700 to-gray-800 border-gray-600'
                            : 'bg-gradient-to-b from-green-50 to-white border-green-100'
                            }`}>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-green-900' : 'bg-green-100'}`}>
                                <span className="text-3xl">🎯</span>
                            </div>
                            <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Bite-Sized Lessons</h3>
                            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                Learn in just 5 minutes a day with quick, focused lessons that fit your schedule.
                            </p>
                        </div>
                        <div className={`text-center p-8 rounded-2xl border ${isDark
                            ? 'bg-gradient-to-b from-gray-700 to-gray-800 border-gray-600'
                            : 'bg-gradient-to-b from-blue-50 to-white border-blue-100'
                            }`}>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                                <span className="text-3xl">🎮</span>
                            </div>
                            <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Interactive Exercises</h3>
                            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                Practice with fun quizzes, translations, and fill-in-the-blank challenges.
                            </p>
                        </div>
                        <div className={`text-center p-8 rounded-2xl border ${isDark
                            ? 'bg-gradient-to-b from-gray-700 to-gray-800 border-gray-600'
                            : 'bg-gradient-to-b from-purple-50 to-white border-purple-100'
                            }`}>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
                                <span className="text-3xl">📈</span>
                            </div>
                            <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Track Progress</h3>
                            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                Monitor your learning journey with detailed progress tracking and achievements.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Languages Section */}
            <section className={`py-20 px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="max-w-6xl mx-auto">
                    <h2 className={`text-3xl md:text-4xl font-bold text-center mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Choose Your Language
                    </h2>
                    <p className={`text-center mb-12 max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        We offer courses in multiple languages. Start learning today!
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {languages.map((lang) => (
                            <div
                                key={lang.id}
                                className={`rounded-xl p-6 text-center border cursor-pointer group transition-all hover:shadow-lg flex flex-col items-center justify-center ${isDark
                                    ? 'bg-gray-800 border-gray-700 hover:border-green-500'
                                    : 'bg-white border-gray-100 hover:border-green-300'
                                    }`}
                                onClick={() => onNavigate('register')}
                            >
                                <span className={`fi fi-${lang.code} text-5xl mb-3 group-hover:scale-110 transition-transform`} />
                                <span className={`font-medium group-hover:text-green-500 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {lang.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-green-500 to-emerald-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Start Your Language Journey Today
                    </h2>
                    <p className="text-green-100 text-lg mb-8">
                        Join our community of language learners and unlock new opportunities.
                    </p>
                    <button
                        onClick={() => onNavigate('register')}
                        className="px-8 py-4 bg-white text-green-600 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all shadow-lg"
                    >
                        Create Free Account
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className={`py-12 px-4 ${isDark ? 'bg-gray-950 text-gray-500' : 'bg-gray-900 text-gray-400'}`}>
                <div className="max-w-6xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">📚</span>
                        </div>
                        <span className="text-lg font-bold text-white"> SpeakEasy</span>
                    </div>
                    <p className="text-sm">© 2026 SpeakEasy. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
