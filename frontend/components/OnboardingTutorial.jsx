import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const steps = [
    {
        title: 'Welcome to SpeakEasy! 🎉',
        description: 'Your personal language learning companion. Let\'s take a quick tour to help you get started!',
        image: '🌍',
        color: 'from-green-400 to-emerald-600',
    },
    {
        title: 'Choose Your Language 🌐',
        description: 'Pick from our selection of languages. You can learn multiple languages and switch between them anytime!',
        image: '🇪🇸🇫🇷🇩🇪🇯🇵',
        color: 'from-blue-400 to-indigo-600',
    },
    {
        title: 'Learn First, Then Quiz 📚',
        description: 'Each lesson starts with vocabulary and tips. Once you\'re ready, test your knowledge with a quiz!',
        image: '🎯',
        color: 'from-purple-400 to-pink-600',
    },
    {
        title: 'Practice with Flashcards 🃏',
        description: 'Use our flashcard system with spaced repetition to memorize vocabulary effectively. Cards you struggle with will appear more often.',
        image: '🧠',
        color: 'from-orange-400 to-red-600',
    },
    {
        title: 'Read Stories 📖',
        description: 'Practice reading with short, engaging stories. Tap any sentence to see its translation!',
        image: '📚',
        color: 'from-teal-400 to-cyan-600',
    },
    {
        title: 'Daily Challenges 🎮',
        description: 'Complete daily challenges for bonus points! Test yourself with timed questions from all languages.',
        image: '⏱️',
        color: 'from-yellow-400 to-orange-600',
    },
    {
        title: 'Track Your Progress 📊',
        description: 'View your stats, achievements, and progress charts in your profile. Earn certificates when you complete courses!',
        image: '🏆',
        color: 'from-pink-400 to-rose-600',
    },
    {
        title: 'You\'re All Set! 🚀',
        description: 'Start your language learning journey now. Remember: consistency is key! Even 5 minutes a day makes a difference.',
        image: '✨',
        color: 'from-green-400 to-emerald-600',
    },
];

export function OnboardingTutorial({ onComplete }) {
    const { completeOnboarding } = useApp();
    const { isDark } = useTheme();
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            await completeOnboarding();
            onComplete();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSkip = async () => {
        await completeOnboarding();
        onComplete();
    };

    const step = steps[currentStep];
    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                {/* Progress bar */}
                <div className={`h-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                        className={`h-full bg-gradient-to-r ${step.color} transition-all duration-300`}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Image/Icon section */}
                <div className={`bg-gradient-to-br ${step.color} p-12 text-center`}>
                    <div className="text-7xl animate-bounce">
                        {step.image}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <h2 className={`text-2xl font-bold mb-4 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {step.title}
                    </h2>
                    <p className={`text-center mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {step.description}
                    </p>

                    {/* Step indicators */}
                    <div className="flex justify-center gap-2 mb-8">
                        {steps.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentStep(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentStep
                                        ? `w-6 bg-gradient-to-r ${step.color}`
                                        : isDark ? 'bg-gray-600' : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        {currentStep > 0 ? (
                            <button
                                onClick={handlePrev}
                                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${isDark
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Back
                            </button>
                        ) : (
                            <button
                                onClick={handleSkip}
                                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${isDark
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Skip
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className={`flex-1 py-3 bg-gradient-to-r ${step.color} text-white rounded-xl font-semibold hover:opacity-90 transition-all`}
                        >
                            {currentStep === steps.length - 1 ? "Let's Go!" : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
