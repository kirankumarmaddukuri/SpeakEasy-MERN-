import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { lessons, lessonContent } from '../data/lessons';

export function LessonPage({ languageId, lessonId, onComplete, onExit }) {
    const { completeLesson } = useApp();
    const { isDark } = useTheme();
    const [phase, setPhase] = useState('learn');
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);

    const languageLessons = lessons[languageId] || [];
    const lesson = languageLessons.find((l) => l.id === lessonId);
    const content = lessonContent[languageId]?.[lessonId];

    useEffect(() => {
        // Reset state when lesson changes
        setPhase('learn');
        setCurrentExerciseIndex(0);
        setSelectedAnswer(null);
        setIsAnswerChecked(false);
        setIsCorrect(false);
        setCorrectCount(0);
    }, [lessonId, languageId]);

    if (!lesson) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="text-center">
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Lesson not found</p>
                    <button onClick={onExit} className="mt-4 text-green-600 hover:underline">
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    const currentExercise = lesson.exercises[currentExerciseIndex];
    const progress = ((currentExerciseIndex + 1) / lesson.exercises.length) * 100;

    const handleSelectAnswer = (answer) => {
        if (!isAnswerChecked) {
            setSelectedAnswer(answer);
        }
    };

    const handleCheckAnswer = () => {
        if (!selectedAnswer) return;

        const correct = selectedAnswer === currentExercise.correctAnswer;
        setIsCorrect(correct);
        setIsAnswerChecked(true);

        if (correct) {
            setCorrectCount((prev) => prev + 1);
        }
    };

    const handleContinue = () => {
        if (currentExerciseIndex < lesson.exercises.length - 1) {
            setCurrentExerciseIndex((prev) => prev + 1);
            setSelectedAnswer(null);
            setIsAnswerChecked(false);
            setIsCorrect(false);
        } else {
            // Lesson complete
            const score = Math.round((correctCount / lesson.exercises.length) * 100);
            if (score >= lesson.requiredScore) {
                completeLesson(
                    languageId,
                    lessonId,
                    score,
                    lesson.exercises.length,
                    correctCount
                );
            }
            setPhase('results');
        }
    };

    const handleStartQuiz = () => {
        setPhase('quiz');
    };

    const handleRetry = () => {
        setPhase('learn');
        setCurrentExerciseIndex(0);
        setSelectedAnswer(null);
        setIsAnswerChecked(false);
        setIsCorrect(false);
        setCorrectCount(0);
    };

    // Learning Phase
    if (phase === 'learn') {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                {/* Header */}
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4 sticky top-0 z-10`}>
                    <div className="max-w-4xl mx-auto flex items-center gap-4">
                        <button
                            onClick={onExit}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                            <svg className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="flex-1">
                            <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {lesson.title}: {content?.title || 'Learning Content'}
                            </h1>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full dark:bg-blue-900 dark:text-blue-300">
                            📖 Learn
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {content ? (
                        <div className="space-y-8">
                            {/* Introduction */}
                            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm border p-6`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">📚</span>
                                    </div>
                                    <div>
                                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {content.title}
                                        </h2>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Lesson {lessonId}
                                        </p>
                                    </div>
                                </div>
                                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                                    {content.introduction}
                                </p>
                            </div>

                            {/* Vocabulary Table */}
                            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm border p-6`}>
                                <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    <span className="text-2xl">📝</span> Vocabulary
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className={`${isDark ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                                                <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Word/Phrase
                                                </th>
                                                <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Translation
                                                </th>
                                                <th className={`text-left py-3 px-4 font-semibold hidden md:table-cell ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Example
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {content.vocabulary.map((item, index) => (
                                                <tr
                                                    key={index}
                                                    className={`${isDark ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'} border-b transition-colors`}
                                                >
                                                    <td className="py-3 px-4">
                                                        <span className={`font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                                                            {item.word}
                                                        </span>
                                                    </td>
                                                    <td className={`py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {item.translation}
                                                    </td>
                                                    <td className={`py-3 px-4 hidden md:table-cell ${isDark ? 'text-gray-400' : 'text-gray-500'} italic`}>
                                                        {item.example || '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Tips */}
                            {content.tips && content.tips.length > 0 && (
                                <div className={`${isDark ? 'bg-amber-900/30 border-amber-700' : 'bg-amber-50 border-amber-200'} rounded-2xl border p-6`}>
                                    <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                                        <span className="text-2xl">💡</span> Pro Tips
                                    </h3>
                                    <ul className="space-y-3">
                                        {content.tips.map((tip, index) => (
                                            <li key={index} className={`flex items-start gap-3 ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>
                                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${isDark ? 'bg-amber-800 text-amber-200' : 'bg-amber-200 text-amber-800'}`}>
                                                    {index + 1}
                                                </span>
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Grammar Note */}
                            {content.grammar && (
                                <div className={`${isDark ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 border-purple-200'} rounded-2xl border p-6`}>
                                    <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>
                                        <span className="text-2xl">📖</span> Grammar Note
                                    </h3>
                                    <p className={`${isDark ? 'text-purple-200' : 'text-purple-900'} font-mono text-sm`}>
                                        {content.grammar}
                                    </p>
                                </div>
                            )}

                            {/* Start Quiz Button */}
                            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm border p-6 text-center`}>
                                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">🎯</span>
                                </div>
                                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Ready to Test Your Knowledge?
                                </h3>
                                <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    You've learned the vocabulary. Now let's see how well you remember it!
                                </p>
                                <button
                                    onClick={handleStartQuiz}
                                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Start Quiz →
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Fallback if no content
                        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm border p-8 text-center`}>
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">📚</span>
                            </div>
                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {lesson.title}
                            </h3>
                            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {lesson.description}
                            </p>
                            <button
                                onClick={handleStartQuiz}
                                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                            >
                                Start Quiz →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Results Phase
    if (phase === 'results') {
        const score = Math.round((correctCount / lesson.exercises.length) * 100);
        const passed = score >= lesson.requiredScore;

        return (
            <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border p-8 max-w-md w-full text-center`}>
                    <div
                        className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${passed ? 'bg-green-100 dark:bg-green-900/50' : 'bg-orange-100 dark:bg-orange-900/50'
                            }`}
                    >
                        <span className="text-5xl">{passed ? '🎉' : '💪'}</span>
                    </div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {passed ? 'Lesson Complete!' : 'Keep Practicing!'}
                    </h2>
                    <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {passed
                            ? 'Great job! You can now move on to the next lesson.'
                            : `You need ${lesson.requiredScore}% to pass. Try again!`}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
                            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{score}%</p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Score</p>
                        </div>
                        <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
                            <p className="text-3xl font-bold text-green-600">{correctCount}/{lesson.exercises.length}</p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Correct</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {passed ? (
                            <button
                                onClick={onComplete}
                                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
                            >
                                Continue to Dashboard
                            </button>
                        ) : (
                            <button
                                onClick={handleRetry}
                                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
                            >
                                Try Again
                            </button>
                        )}
                        <button
                            onClick={onExit}
                            className={`w-full py-3 font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz Phase
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
                                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {currentExerciseIndex + 1}/{lesson.exercises.length}
                    </span>
                </div>
            </div>

            {/* Exercise Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    {/* Question Type Badge */}
                    <div className="mb-6">
                        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                            {currentExercise.type === 'multiple-choice' && '🎯 Multiple Choice'}
                            {currentExercise.type === 'translation' && '🔄 Translation'}
                            {currentExercise.type === 'fill-blank' && '✍️ Fill in the Blank'}
                        </span>
                    </div>

                    {/* Question */}
                    <h2 className={`text-2xl md:text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {currentExercise.question}
                    </h2>

                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentExercise.options?.map((option, index) => {
                            const isSelected = selectedAnswer === option;
                            const isCorrectAnswer = option === currentExercise.correctAnswer;

                            let buttonStyle = isDark
                                ? 'bg-gray-800 border-2 border-gray-700 hover:border-green-500'
                                : 'bg-white border-2 border-gray-200 hover:border-green-300';

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
                                    ? 'bg-green-900/30 border-2 border-green-500'
                                    : 'bg-green-50 border-2 border-green-500';
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleSelectAnswer(option)}
                                    disabled={isAnswerChecked}
                                    className={`p-4 rounded-xl text-left font-medium transition-all ${buttonStyle} ${!isAnswerChecked ? 'hover:shadow-md' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isSelected && !isAnswerChecked
                                                    ? 'bg-green-500 text-white'
                                                    : isAnswerChecked && isCorrectAnswer
                                                        ? 'bg-green-500 text-white'
                                                        : isAnswerChecked && isSelected && !isCorrect
                                                            ? 'bg-red-500 text-white'
                                                            : isDark
                                                                ? 'bg-gray-700 text-gray-400'
                                                                : 'bg-gray-100 text-gray-500'
                                                }`}
                                        >
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
                        <div
                            className={`flex items-center gap-2 ${isCorrect ? 'text-green-500' : 'text-red-500'
                                }`}
                        >
                            <span className="text-2xl">{isCorrect ? '✓' : '✗'}</span>
                            <span className="font-semibold">
                                {isCorrect ? 'Correct!' : `Correct answer: ${currentExercise.correctAnswer}`}
                            </span>
                        </div>
                    )}
                    <div className="ml-auto">
                        {!isAnswerChecked ? (
                            <button
                                onClick={handleCheckAnswer}
                                disabled={!selectedAnswer}
                                className={`px-8 py-3 rounded-xl font-semibold transition-all ${selectedAnswer
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md'
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
                                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md"
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
