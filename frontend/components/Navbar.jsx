import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

export function Navbar({ onNavigate, currentPage }) {
    const { user, isAuthenticated, logout } = useApp();
    const { isDark, toggleTheme } = useTheme();

    return (
        <nav className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-sm border-b sticky top-0 z-50 transition-colors`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <button
                            onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'landing')}
                            className="flex items-center gap-2"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl">📚</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                SpeakEasy
                            </span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg transition-all ${isDark
                                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                }`}
                            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDark ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>

                        {isAuthenticated ? (
                            <>
                                <button
                                    onClick={() => onNavigate('dashboard')}
                                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${currentPage === 'dashboard'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                            : isDark
                                                ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => onNavigate('languages')}
                                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${currentPage === 'languages'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                            : isDark
                                                ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    Languages
                                </button>
                                <div className={`hidden sm:flex items-center gap-3 pl-4 border-l ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                                    <button
                                        onClick={() => onNavigate('profile')}
                                        className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                        title="View Profile"
                                    >
                                        <span className="text-white text-sm font-medium">
                                            {user?.name.charAt(0).toUpperCase()}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => onNavigate('profile')}
                                        className={`text-sm font-medium hover:text-green-500 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                                    >
                                        {user?.name}
                                    </button>
                                    <button
                                        onClick={logout}
                                        className={`text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'}`}
                                    >
                                        Logout
                                    </button>
                                </div>
                                {/* Mobile logout */}
                                <button
                                    onClick={logout}
                                    className={`sm:hidden p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' : 'text-gray-500 hover:text-red-600 hover:bg-gray-100'}`}
                                    title="Logout"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => onNavigate('login')}
                                    className={`px-3 sm:px-4 py-2 font-medium transition-colors text-sm sm:text-base ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={() => onNavigate('register')}
                                    className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                                >
                                    Get Started
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
