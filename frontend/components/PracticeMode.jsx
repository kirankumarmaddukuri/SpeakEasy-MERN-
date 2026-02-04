import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { languages } from '../data/languages';
import { lessons, lessonContent } from '../data/lessons';
import { progressAPI } from '../services/api';

export function PracticeMode({ onExit }) {
    const { user, addLearningHistory } = useApp();
    const { isDark } = useTheme();

    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [phase, setPhase] = useState('select');
    const [exercises, setExercises] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);

    // Get completed lessons for practice
    const getCompletedLessons = (langId) => {
        const progress = user?.progress[langId];
        if (!progress) return [];

        const langLessons = lessons[langId] || [];
        return langLessons.filter(lesson => progress.lessonsCompleted.includes(lesson.id));
    };

    const handleStartPractice = (langId, type, lessonId) => {
        setSelectedLanguage(langId);

        const langLessons = lessons[langId] || [];
        const progress = user?.progress[langId];

        if (!progress) return;

        let practiceExercises = [];

        if (type === 'all') {
            // Get exercises from all completed lessons
            langLessons.forEach(lesson => {
                if (progress.lessonsCompleted.includes(lesson.id)) {
                    practiceExercises = [...practiceExercises, ...lesson.exercises];
                }
            });
        } else if (lessonId) {
            // Get exercises from specific lesson
            const lesson = langLessons.find(l => l.id === lessonId);
            if (lesson) {
                practiceExercises = [...lesson.exercises];
            }
        }

        // Shuffle and limit to 10 exercises
        const shuffled = practiceExercises.sort(() => Math.random() - 0.5);
        setExercises(shuffled.slice(0, 10));
        setPhase('practice');
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setIsAnswerChecked(false);
        setCorrectCount(0);
    };

    const currentExercise = exercises[currentIndex];
    const progress = exercises.length > 0 ? ((currentIndex + 1) / exercises.length) * 100 : 0;

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
            setCorrectCount(prev => prev + 1);
        }
    };


    const handleContinue = async () => {
        if (currentIndex < exercises.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswerChecked(false);
            setIsCorrect(false);
        } else {
            const score = Math.round((correctCount / exercises.length) * 100);
            addLearningHistory(0, score);

            // Save practice session to backend
            try {
                await progressAPI.savePracticeSession(
                    selectedLanguage,
                    exercises.length,
                    correctCount
                );
                console.log('Practice session saved to database!');
            } catch (error) {
                console.error('Failed to save practice session:', error);
            }

            setPhase('results');
        }
    };


    // Language selection screen
    if (phase === 'select') {
        const languagesWithProgress = languages.filter(lang => {
            const progress = user?.progress[lang.id];
            return progress && progress.lessonsCompleted.length > 0;
        });

        return (
            <div className={`min-h-screen py-8 px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={onExit}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                        >
                            <svg className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <div>
                            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Practice Mode</h1>
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Review completed lessons</p>
                        </div>
                    </div>

                    {/* Info */}
                    <div className={`${isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-2xl p-6 mb-8`}>
                        <div className="flex items-start gap-4">
                            <span className="text-4xl">🔄</span>
                            <div>
                                <h3 className={`font-semibold mb-2 ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>Practice Makes Perfect</h3>
                                <ul className={`space-y-1 text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                                    <li>• Review exercises from lessons you've completed</li>
                                    <li>• Practice all lessons or focus on specific ones</li>
                                    <li>• Reinforce what you've learned without pressure</li>
                                    <li>• Earn points for each practice session!</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {languagesWithProgress.length > 0 ? (
                        <div className="space-y-8">
                            {languagesWithProgress.map(lang => {
                                const completedLessons = getCompletedLessons(lang.id);
                                const langContent = lessonContent[lang.id];

                                return (
                                    <div key={lang.id} className={`rounded-2xl border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="text-4xl">{lang.flag}</span>
                                            <div className="flex-1">
                                                <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{lang.name}</h3>
                                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {completedLessons.length} lessons available for practice
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleStartPractice(lang.id, 'all')}
                                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all"
                                            >
                                                Practice All
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {completedLessons.map(lesson => {
                                                const content = langContent?.[lesson.id];
                                                return (
                                                    <button
                                                        key={lesson.id}
                                                        onClick={() => handleStartPractice(lang.id, 'lesson', lesson.id)}
                                                        className={`p-4 rounded-xl text-left transition-all hover:shadow-md ${isDark
                                                            ? 'bg-gray-700 hover:bg-gray-600'
                                                            : 'bg-gray-50 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                                ✓
                                                            </div>
                                                            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                                Lesson {lesson.id}
                                                            </span>
                                                        </div>
                                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            {content?.title || lesson.title}
                                                        </p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border p-12 text-center`}>
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-4xl">📚</span>
                            </div>
                            <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                No Lessons to Practice
                            </h3>
                            <p className={`mb-6 max-w-md mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Complete some lessons first, then come back here to practice and reinforce what you've learned!
                            </p>
                            <button
                                onClick={onExit}
                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
                            >
                                Start Learning
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Results screen
    if (phase === 'results') {
        const score = Math.round((correctCount / exercises.length) * 100);
        const langInfo = languages.find(l => l.id === selectedLanguage);

        return (
            <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border p-8 max-w-md w-full text-center`}>
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl">🎯</span>
                    </div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Practice Complete!
                    </h2>
                    <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Great job reviewing your {langInfo?.name} skills!
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
                            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{score}%</p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Accuracy</p>
                        </div>
                        <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
                            <p className="text-3xl font-bold text-green-500">{correctCount}/{exercises.length}</p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Correct</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                setPhase('practice');
                                setCurrentIndex(0);
                                setSelectedAnswer(null);
                                setIsAnswerChecked(false);
                                setCorrectCount(0);
                                setExercises(exercises.sort(() => Math.random() - 0.5));
                            }}
                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
                        >
                            Practice Again
                        </button>
                        <button
                            onClick={() => setPhase('select')}
                            className={`w-full py-3 border-2 rounded-xl font-semibold transition-all ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Choose Different Lesson
                        </button>
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

    // Practice phase
    if (!currentExercise) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading...</p>
            </div>
        );
    }

    const langInfo = languages.find(l => l.id === selectedLanguage);

    return (
        <div className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4`}>
                <div className="max-w-3xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => setPhase('select')}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                        <svg className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-xl">{langInfo?.flag}</span>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Practice</span>
                    </div>
                    <div className="flex-1">
                        <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div
                                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {currentIndex + 1}/{exercises.length}
                    </span>
                </div>
            </div>

            {/* Exercise Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    <div className="mb-6">
                        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                            {currentExercise.type === 'multiple-choice' && '🎯 Multiple Choice'}
                            {currentExercise.type === 'translation' && '🔄 Translation'}
                            {currentExercise.type === 'fill-blank' && '✍️ Fill in the Blank'}
                        </span>
                    </div>

                    <h2 className={`text-2xl md:text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {currentExercise.question}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentExercise.options?.map((option, index) => {
                            const isSelected = selectedAnswer === option;
                            const isCorrectAnswer = option === currentExercise.correctAnswer;

                            let buttonStyle = isDark
                                ? 'bg-gray-800 border-2 border-gray-700 hover:border-blue-500'
                                : 'bg-white border-2 border-gray-200 hover:border-blue-300';

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
                                    ? 'bg-blue-900/30 border-2 border-blue-500'
                                    : 'bg-blue-50 border-2 border-blue-500';
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
                                            ? 'bg-blue-500 text-white'
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
                                {isCorrect ? 'Correct!' : `Correct: ${currentExercise.correctAnswer}`}
                            </span>
                        </div>
                    )}
                    <div className="ml-auto">
                        {!isAnswerChecked ? (
                            <button
                                onClick={handleCheckAnswer}
                                disabled={!selectedAnswer}
                                className={`px-8 py-3 rounded-xl font-semibold transition-all ${selectedAnswer
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md'
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
                                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md"
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
