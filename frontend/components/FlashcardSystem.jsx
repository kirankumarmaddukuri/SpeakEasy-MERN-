import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { languages } from '../data/languages';
import { lessonContent } from '../data/lessons';

export function FlashcardSystem({ onExit }) {
    const { user, updateFlashcardProgress } = useApp();
    const { isDark } = useTheme();

    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [phase, setPhase] = useState('study');
    const [studiedCount, setStudiedCount] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [noCards, setNoCards] = useState(false);

    const currentLanguage = user?.currentLanguage;
    const langInfo = languages.find(l => l.id === currentLanguage);

    // Generate flashcards from lesson content for current language
    useEffect(() => {
        if (currentLanguage) {
            const langContent = lessonContent[currentLanguage];
            if (langContent) {
                const flashcards = [];
                Object.values(langContent).forEach((lesson) => {
                    lesson.vocabulary.forEach((vocab, idx) => {
                        flashcards.push({
                            id: `${currentLanguage}-${lesson.title}-${idx}`,
                            front: vocab.word,
                            back: vocab.translation,
                            example: vocab.example,
                        });
                    });
                });
                // Shuffle cards
                const shuffled = flashcards.sort(() => Math.random() - 0.5);
                setCards(shuffled.slice(0, 10)); // Limit to 10 cards per session
                setNoCards(flashcards.length === 0);
            } else {
                setNoCards(true);
            }
        } else {
            setNoCards(true);
        }
    }, [currentLanguage]);

    const currentCard = cards[currentIndex];
    const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleResponse = (correct) => {
        if (currentCard && currentLanguage) {
            updateFlashcardProgress(currentLanguage, currentCard.id, correct);
            setStudiedCount(prev => prev + 1);
            if (correct) {
                setCorrectCount(prev => prev + 1);
            }
        }

        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
        } else {
            setPhase('complete');
        }
    };

    const handleRestart = () => {
        setPhase('study');
        setCurrentIndex(0);
        setIsFlipped(false);
        setStudiedCount(0);
        setCorrectCount(0);
        // Reshuffle cards
        setCards(cards.sort(() => Math.random() - 0.5));
    };

    // No language selected or no cards available
    if (!currentLanguage || noCards) {
        return (
            <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border p-8 max-w-md w-full text-center`}>
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl">🃏</span>
                    </div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {!currentLanguage ? 'No Language Selected' : 'No Flashcards Available'}
                    </h2>
                    <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {!currentLanguage
                            ? 'Please select a language first to practice flashcards.'
                            : `No vocabulary content is available for ${langInfo?.name} yet. Try a different language or complete some lessons first.`
                        }
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

    // Complete screen
    if (phase === 'complete') {
        const percentage = studiedCount > 0 ? Math.round((correctCount / studiedCount) * 100) : 0;

        return (
            <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border p-8 max-w-md w-full text-center`}>
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl">🎓</span>
                    </div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Study Session Complete!
                    </h2>
                    <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Great job practicing your {langInfo?.name} vocabulary!
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
                            <p className="text-3xl font-bold text-green-500">{correctCount}</p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Knew it</p>
                        </div>
                        <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
                            <p className="text-3xl font-bold text-orange-500">{studiedCount - correctCount}</p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Learning</p>
                        </div>
                    </div>

                    <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4 mb-6`}>
                        <p className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{percentage}%</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Retention Rate</p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleRestart}
                            className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all"
                        >
                            Study Again
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

    // Study phase
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
                    <div className="flex items-center gap-2">
                        <span className="text-xl">{langInfo?.flag}</span>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{langInfo?.name} Flashcards</span>
                    </div>
                    <div className="flex-1">
                        <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div
                                className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {currentIndex + 1}/{cards.length}
                    </span>
                </div>
            </div>

            {/* Flashcard */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-lg">
                    <button
                        onClick={handleFlip}
                        className={`w-full aspect-[3/2] rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${isFlipped
                                ? 'bg-gradient-to-br from-green-400 to-emerald-600'
                                : isDark
                                    ? 'bg-gradient-to-br from-purple-600 to-indigo-700'
                                    : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                            }`}
                    >
                        <div className="h-full flex flex-col items-center justify-center p-8 text-white">
                            <p className="text-sm uppercase tracking-wide opacity-75 mb-4">
                                {isFlipped ? 'Translation' : 'Tap to reveal'}
                            </p>
                            <p className="text-3xl md:text-4xl font-bold text-center">
                                {isFlipped ? currentCard?.back : currentCard?.front}
                            </p>
                            {isFlipped && currentCard?.example && (
                                <p className="mt-4 text-lg opacity-75 italic text-center">
                                    "{currentCard.example}"
                                </p>
                            )}
                        </div>
                    </button>

                    {/* Response Buttons */}
                    {isFlipped && (
                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={() => handleResponse(false)}
                                className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all shadow-md ${isDark
                                        ? 'bg-red-900/50 text-red-300 hover:bg-red-900/70 border border-red-700'
                                        : 'bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200'
                                    }`}
                            >
                                <span className="block text-2xl mb-1">🤔</span>
                                Still Learning
                            </button>
                            <button
                                onClick={() => handleResponse(true)}
                                className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all shadow-md ${isDark
                                        ? 'bg-green-900/50 text-green-300 hover:bg-green-900/70 border border-green-700'
                                        : 'bg-green-50 text-green-600 hover:bg-green-100 border-2 border-green-200'
                                    }`}
                            >
                                <span className="block text-2xl mb-1">✅</span>
                                Knew It!
                            </button>
                        </div>
                    )}

                    {!isFlipped && (
                        <p className={`text-center mt-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Click the card to flip it
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
