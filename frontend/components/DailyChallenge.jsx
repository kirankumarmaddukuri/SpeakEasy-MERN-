import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { languages } from '../data/languages';
import { challengeAPI } from '../services/api';

export function DailyChallenge({ onExit }) {
    const { completeDailyChallenge, getDailyChallenge, user } = useApp();
    const { isDark } = useTheme();

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const expectedCorrectRef = useRef(0);
    const [phase, setPhase] = useState('intro');
    const [timeLeft, setTimeLeft] = useState(30);
    const [timerActive, setTimerActive] = useState(false);

    const existingChallenge = getDailyChallenge();

    // Fetch daily challenge from backend
    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                setLoading(true);
                const response = await challengeAPI.getDailyChallenge();

                // Backend returns { success, data: { challenge, completed, previousScore } }
                const backendQuestions = response.data.challenge.questions;

                // Convert backend format to frontend format
                // Backend: { options: [...], correctAnswer: index }
                // Frontend: { options: [...], correctAnswer: actual_option_value }
                const frontendQuestions = backendQuestions.map(q => ({
                    question: q.question,
                    options: q.options,
                    correctAnswer: q.options[q.correctAnswer], // Convert index to actual value
                    language: q.language
                }));

                setQuestions(frontendQuestions);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch daily challenge:', err);
                setError('Failed to load daily challenge');
                setLoading(false);
            }
        };

        fetchChallenge();
    }, []);

    useEffect(() => {
        if (timerActive && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !isAnswerChecked) {
            handleCheckAnswer();
        }
    }, [timeLeft, timerActive, isAnswerChecked]);

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    const handleStart = () => {
        setPhase('quiz');
        setTimerActive(true);
        // reset counters when starting
        expectedCorrectRef.current = 0;
        setCorrectCount(0);
    };

    const handleSelectAnswer = (answer) => {
        if (!isAnswerChecked) {
            setSelectedAnswer(answer);
        }
    };

    const handleCheckAnswer = () => {
        setTimerActive(false);
        const correct = selectedAnswer === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        setIsAnswerChecked(true);
        if (correct) {
            // update deterministic ref first, then sync state
            expectedCorrectRef.current = (expectedCorrectRef.current || 0) + 1;
            setCorrectCount(expectedCorrectRef.current);
        }
    };

    const handleContinue = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedAnswer(null);
            setIsAnswerChecked(false);
            setIsCorrect(false);
            setTimeLeft(30);
            setTimerActive(true);
        } else {
            // Use the deterministic expectedCorrectRef to compute final score
            const finalCorrect = expectedCorrectRef.current || correctCount || 0;
            const score = Math.round((finalCorrect / questions.length) * 100);
            const bonusPoints = score >= 80 ? 50 : score >= 60 ? 25 : 10;
            completeDailyChallenge(user?.currentLanguage || 'spanish', score, bonusPoints);
            setPhase('results');
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border p-8 max-w-md w-full text-center`}>
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading today's challenge...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border p-8 max-w-md w-full text-center`}>
                    <div className="w-24 h-24 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl">❌</span>
                    </div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Oops!
                    </h2>
                    <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {error}
                    </p>
                    <button
                        onClick={onExit}
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Already completed today
    if (existingChallenge?.completed && phase === 'intro') {
        return (
            <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border p-8 max-w-md w-full text-center`}>
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl">✅</span>
                    </div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Challenge Completed!
                    </h2>
                    <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        You already completed today's daily challenge.
                    </p>
                    <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4 mb-6`}>
                        <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{existingChallenge.score}%</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Today's Score</p>
                    </div>
                    <p className={`text-sm mb-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Come back tomorrow for a new challenge! 🌟
                    </p>
                    <button
                        onClick={onExit}
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Intro screen
    if (phase === 'intro') {
        return (
            <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border p-8 max-w-md w-full text-center`}>
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <span className="text-5xl">🎯</span>
                    </div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Daily Challenge
                    </h2>
                    <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Test your language skills with today's special challenge!
                    </p>

                    <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4 mb-6 space-y-3`}>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">⏱️</span>
                            <div className="text-left">
                                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>30 seconds per question</p>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Answer quickly for bonus points!</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📝</span>
                            <div className="text-left">
                                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>5 questions</p>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Mixed from all languages</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🏆</span>
                            <div className="text-left">
                                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Bonus rewards</p>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Earn extra points for completing!</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleStart}
                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
                    >
                        Start Challenge 🚀
                    </button>
                    <button
                        onClick={onExit}
                        className={`w-full mt-3 py-3 font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        );
    }

    // Results screen
    if (phase === 'results') {
        const score = Math.round((correctCount / questions.length) * 100);
        const bonusPoints = score >= 80 ? 50 : score >= 60 ? 25 : 10;

        return (
            <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border p-8 max-w-md w-full text-center`}>
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl">🎉</span>
                    </div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Challenge Complete!
                    </h2>
                    <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Great job completing today's challenge!
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
                            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{score}%</p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Score</p>
                        </div>
                        <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
                            <p className="text-3xl font-bold text-green-500">{correctCount}/{questions.length}</p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Correct</p>
                        </div>
                    </div>

                    <div className={`${isDark ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border rounded-xl p-4 mb-6`}>
                        <p className={`font-semibold ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
                            🎁 Bonus Points Earned: +{bonusPoints}
                        </p>
                    </div>

                    <button
                        onClick={onExit}
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Quiz phase
    const languageInfo = languages.find(l => l.id === currentQuestion.language);

    return (
        <div className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4`}>
                <div className="max-w-3xl mx-auto flex items-center gap-4">
                    <button
                        onClick={onExit}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                        <svg className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="flex-1">
                        <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div
                                className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${timeLeft <= 10 ? 'bg-red-500 text-white animate-pulse' : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                        <span>⏱️</span>
                        <span className="font-bold">{timeLeft}s</span>
                    </div>
                </div>
            </div>

            {/* Question */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">{languageInfo?.flag}</span>
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                            {languageInfo?.name}
                        </span>
                    </div>

                    <h2 className={`text-2xl md:text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {currentQuestion.question}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = selectedAnswer === option;
                            const isCorrectAnswer = option === currentQuestion.correctAnswer;

                            let buttonStyle = isDark
                                ? 'bg-gray-800 border-2 border-gray-700 hover:border-orange-500'
                                : 'bg-white border-2 border-gray-200 hover:border-orange-300';

                            if (isAnswerChecked) {
                                if (isCorrectAnswer) {
                                    buttonStyle = isDark
                                        ? 'bg-green-900/50 border-2 border-green-500 text-green-300'
                                        : 'bg-green-100 border-2 border-green-500 text-green-800';
                                } else if (isSelected && !isCorrect) {
                                    buttonStyle = isDark
                                        ? 'bg-red-900/50 border-2 border-red-500 text-red-300'
                                        : 'bg-red-100 border-2 border-red-500 text-red-800';
                                } else {
                                    buttonStyle = isDark
                                        ? 'bg-gray-800 border-2 border-gray-700 opacity-50'
                                        : 'bg-gray-50 border-2 border-gray-200 opacity-50';
                                }
                            } else if (isSelected) {
                                buttonStyle = isDark
                                    ? 'bg-orange-900/30 border-2 border-orange-500'
                                    : 'bg-orange-50 border-2 border-orange-500';
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleSelectAnswer(option)}
                                    disabled={isAnswerChecked}
                                    className={`p-4 rounded-xl text-left font-medium transition-all ${buttonStyle} ${!isAnswerChecked ? 'hover:shadow-md' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isSelected && !isAnswerChecked
                                            ? 'bg-orange-500 text-white'
                                            : isAnswerChecked && isCorrectAnswer
                                                ? 'bg-green-500 text-white'
                                                : isAnswerChecked && isSelected && !isCorrect
                                                    ? 'bg-red-500 text-white'
                                                    : isDark
                                                        ? 'bg-gray-700 text-gray-400'
                                                        : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {String.fromCharCode(65 + index)}
                                        </div>
                                        <span className={isDark && !isAnswerChecked ? 'text-gray-200' : ''}>{option}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t p-4`}>
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    {isAnswerChecked && (
                        <div className={`flex items-center gap-2 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                            <span className="text-2xl">{isCorrect ? '✓' : '✗'}</span>
                            <span className="font-semibold">
                                {isCorrect ? 'Correct!' : `Correct: ${currentQuestion.correctAnswer}`}
                            </span>
                        </div>
                    )}
                    <div className="ml-auto">
                        {!isAnswerChecked ? (
                            <button
                                onClick={handleCheckAnswer}
                                disabled={!selectedAnswer}
                                className={`px-8 py-3 rounded-xl font-semibold transition-all ${selectedAnswer
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-md'
                                    : isDark
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Check Answer
                            </button>
                        ) : (
                            <button
                                onClick={handleContinue}
                                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
                            >
                                Continue
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
