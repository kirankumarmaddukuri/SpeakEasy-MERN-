import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

export function AuthPage({ onNavigate, type }) {
    const { login, register } = useApp();
    const { isDark } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (type === 'register') {
                if (!name.trim()) {
                    setError('Please enter your name');
                    setLoading(false);
                    return;
                }
                const success = await register(name.trim(), email.trim(), password.trim());
                if (success) {
                    onNavigate('languages');
                } else {
                    setError('An account with this email already exists');
                }
            } else {
                const success = await login(email.trim(), password.trim());
                if (success) {
                    onNavigate('dashboard');
                } else {
                    setError('Invalid email or password. Try registering first!');
                }
            }
        } catch {
            setError('An error occurred. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${isDark ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-green-50 to-white'
            }`}>
            <div className="w-full max-w-md">
                <div className={`rounded-2xl shadow-xl p-8 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                    }`}>
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-3xl">📚</span>
                        </div>
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {type === 'login' ? 'Welcome Back!' : 'Create Your Account'}
                        </h1>
                        <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {type === 'login'
                                ? 'Log in to continue your learning journey'
                                : 'Start your language learning adventure'}
                        </p>
                    </div>

                    {error && (
                        <div className={`mb-6 p-4 rounded-xl text-sm ${isDark ? 'bg-red-900/50 border border-red-700 text-red-300' : 'bg-red-50 border border-red-200 text-red-600'
                            }`}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {type === 'register' && (
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${isDark
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                                        } border`}
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${isDark
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                                    } border`}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${isDark
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                                    } border`}
                                placeholder="Enter your password"
                                required
                                minLength={6}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Please wait...' : type === 'login' ? 'Log In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                            {type === 'login' ? "Don't have an account?" : 'Already have an account?'}
                            <button
                                onClick={() => onNavigate(type === 'login' ? 'register' : 'login')}
                                className="ml-2 text-green-500 font-medium hover:text-green-400"
                            >
                                {type === 'login' ? 'Sign Up' : 'Log In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
