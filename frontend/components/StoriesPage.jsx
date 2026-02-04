import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { languages } from '../data/languages';

const allStories = [
    // Spanish Stories
    {
        id: 'spanish-cafe',
        title: 'At the Café',
        language: 'spanish',
        languageFlag: '🇪🇸',
        difficulty: 'Beginner',
        readTime: '2 min',
        content: [
            { text: 'María entra en un café.', translation: 'María enters a café.' },
            { text: '"Buenos días," dice María.', translation: '"Good morning," says María.' },
            { text: '"Buenos días. ¿Qué desea?" pregunta el camarero.', translation: '"Good morning. What would you like?" asks the waiter.' },
            { text: '"Un café con leche, por favor," responde María.', translation: '"A coffee with milk, please," María responds.' },
            { text: '"¿Algo más?"', translation: '"Anything else?"' },
            { text: '"Sí, un croissant también."', translation: '"Yes, a croissant too."' },
            { text: '"Son tres euros."', translation: '"That\'s three euros."' },
            { text: '"Aquí tiene. Gracias."', translation: '"Here you go. Thank you."' },
            { text: '"De nada. ¡Que aproveche!"', translation: '"You\'re welcome. Enjoy!"' },
        ],
        questions: [
            {
                question: 'Where does María go?',
                options: ['A restaurant', 'A café', 'A store', 'A park'],
                correctAnswer: 'A café',
            },
            {
                question: 'What does María order to drink?',
                options: ['Tea', 'Water', 'Coffee with milk', 'Orange juice'],
                correctAnswer: 'Coffee with milk',
            },
            {
                question: 'How much does María pay?',
                options: ['Two euros', 'Three euros', 'Five euros', 'One euro'],
                correctAnswer: 'Three euros',
            },
        ],
    },
    {
        id: 'spanish-park',
        title: 'In the Park',
        language: 'spanish',
        languageFlag: '🇪🇸',
        difficulty: 'Beginner',
        readTime: '2 min',
        content: [
            { text: 'Pedro va al parque con su perro.', translation: 'Pedro goes to the park with his dog.' },
            { text: 'El perro se llama Max.', translation: 'The dog is called Max.' },
            { text: '"¡Hola, Pedro!" dice su amiga Ana.', translation: '"Hello, Pedro!" says his friend Ana.' },
            { text: '"¡Hola, Ana! ¿Qué tal?"', translation: '"Hello, Ana! How are you?"' },
            { text: '"Muy bien, gracias. ¡Max es muy grande!"', translation: '"Very well, thank you. Max is very big!"' },
            { text: '"Sí, tiene dos años."', translation: '"Yes, he is two years old."' },
            { text: 'Max corre y juega en el parque.', translation: 'Max runs and plays in the park.' },
            { text: '"¡Es muy feliz aquí!"', translation: '"He is very happy here!"' },
        ],
        questions: [
            {
                question: 'What is the dog\'s name?',
                options: ['Pedro', 'Ana', 'Max', 'Carlos'],
                correctAnswer: 'Max',
            },
            {
                question: 'Who does Pedro meet in the park?',
                options: ['His mother', 'His friend Ana', 'His brother', 'A stranger'],
                correctAnswer: 'His friend Ana',
            },
            {
                question: 'How old is Max?',
                options: ['One year', 'Two years', 'Three years', 'Four years'],
                correctAnswer: 'Two years',
            },
        ],
    },
    // French Stories
    {
        id: 'french-market',
        title: 'Au Marché',
        language: 'french',
        languageFlag: '🇫🇷',
        difficulty: 'Beginner',
        readTime: '2 min',
        content: [
            { text: 'Pierre va au marché le samedi matin.', translation: 'Pierre goes to the market on Saturday morning.' },
            { text: '"Bonjour, monsieur. Je voudrais des pommes."', translation: '"Hello, sir. I would like some apples."' },
            { text: '"Combien en voulez-vous?"', translation: '"How many would you like?"' },
            { text: '"Six pommes, s\'il vous plaît."', translation: '"Six apples, please."' },
            { text: '"Voilà. C\'est deux euros."', translation: '"Here you go. That\'s two euros."' },
            { text: '"Merci beaucoup!"', translation: '"Thank you very much!"' },
            { text: '"Au revoir et bonne journée!"', translation: '"Goodbye and have a nice day!"' },
        ],
        questions: [
            {
                question: 'When does Pierre go to the market?',
                options: ['Sunday morning', 'Saturday morning', 'Friday evening', 'Monday afternoon'],
                correctAnswer: 'Saturday morning',
            },
            {
                question: 'What does Pierre want to buy?',
                options: ['Oranges', 'Bananas', 'Apples', 'Grapes'],
                correctAnswer: 'Apples',
            },
            {
                question: 'How much do the apples cost?',
                options: ['One euro', 'Two euros', 'Three euros', 'Four euros'],
                correctAnswer: 'Two euros',
            },
        ],
    },
    {
        id: 'french-boulangerie',
        title: 'À la Boulangerie',
        language: 'french',
        languageFlag: '🇫🇷',
        difficulty: 'Beginner',
        readTime: '2 min',
        content: [
            { text: 'Sophie entre dans la boulangerie.', translation: 'Sophie enters the bakery.' },
            { text: '"Bonjour, madame!"', translation: '"Hello, madam!"' },
            { text: '"Bonjour. Qu\'est-ce que vous désirez?"', translation: '"Hello. What would you like?"' },
            { text: '"Une baguette et deux croissants, s\'il vous plaît."', translation: '"A baguette and two croissants, please."' },
            { text: '"C\'est tout?"', translation: '"Is that all?"' },
            { text: '"Oui, c\'est tout. Combien ça fait?"', translation: '"Yes, that\'s all. How much is it?"' },
            { text: '"Ça fait trois euros cinquante."', translation: '"That\'s three euros fifty."' },
            { text: '"Voilà. Merci et au revoir!"', translation: '"Here you go. Thank you and goodbye!"' },
        ],
        questions: [
            {
                question: 'Where does Sophie go?',
                options: ['A café', 'A bakery', 'A market', 'A restaurant'],
                correctAnswer: 'A bakery',
            },
            {
                question: 'How many croissants does Sophie buy?',
                options: ['One', 'Two', 'Three', 'Four'],
                correctAnswer: 'Two',
            },
            {
                question: 'What is the total price?',
                options: ['Two euros', 'Three euros', 'Three euros fifty', 'Four euros'],
                correctAnswer: 'Three euros fifty',
            },
        ],
    },
    // German Stories
    {
        id: 'german-train',
        title: 'Am Bahnhof',
        language: 'german',
        languageFlag: '🇩🇪',
        difficulty: 'Beginner',
        readTime: '2 min',
        content: [
            { text: 'Anna ist am Bahnhof.', translation: 'Anna is at the train station.' },
            { text: '"Guten Tag. Eine Fahrkarte nach Berlin, bitte."', translation: '"Good day. A ticket to Berlin, please."' },
            { text: '"Hin und zurück?"', translation: '"Round trip?"' },
            { text: '"Ja, bitte."', translation: '"Yes, please."' },
            { text: '"Das macht fünfzig Euro."', translation: '"That\'s fifty euros."' },
            { text: '"Wann fährt der Zug ab?"', translation: '"When does the train depart?"' },
            { text: '"Um zehn Uhr, Gleis drei."', translation: '"At ten o\'clock, platform three."' },
            { text: '"Danke schön!"', translation: '"Thank you very much!"' },
        ],
        questions: [
            {
                question: 'Where is Anna?',
                options: ['At the airport', 'At the train station', 'At the bus stop', 'At a hotel'],
                correctAnswer: 'At the train station',
            },
            {
                question: 'Where does Anna want to go?',
                options: ['Munich', 'Hamburg', 'Berlin', 'Frankfurt'],
                correctAnswer: 'Berlin',
            },
            {
                question: 'What platform is the train on?',
                options: ['Platform one', 'Platform two', 'Platform three', 'Platform four'],
                correctAnswer: 'Platform three',
            },
        ],
    },
    // Japanese Stories
    {
        id: 'japanese-restaurant',
        title: 'At the Restaurant',
        language: 'japanese',
        languageFlag: '🇯🇵',
        difficulty: 'Beginner',
        readTime: '2 min',
        content: [
            { text: 'Yuki goes to a restaurant.', translation: 'ゆきはレストランに行きます。' },
            { text: '"Irasshaimase!" says the staff.', translation: '"いらっしゃいませ！" とスタッフが言います。' },
            { text: '"Table for one, please."', translation: '"一人です、お願いします。"' },
            { text: '"What would you like to order?"', translation: '"ご注文は何にしますか？"' },
            { text: '"Ramen, please."', translation: '"ラーメンをお願いします。"' },
            { text: '"That will be 800 yen."', translation: '"800円になります。"' },
            { text: '"Thank you for the meal!"', translation: '"ごちそうさまでした！"' },
        ],
        questions: [
            {
                question: 'Where does Yuki go?',
                options: ['A café', 'A restaurant', 'A store', 'A park'],
                correctAnswer: 'A restaurant',
            },
            {
                question: 'How many people is the table for?',
                options: ['One', 'Two', 'Three', 'Four'],
                correctAnswer: 'One',
            },
            {
                question: 'What does Yuki order?',
                options: ['Sushi', 'Ramen', 'Tempura', 'Rice'],
                correctAnswer: 'Ramen',
            },
        ],
    },
    // Italian Stories
    {
        id: 'italian-gelato',
        title: 'La Gelateria',
        language: 'italian',
        languageFlag: '🇮🇹',
        difficulty: 'Beginner',
        readTime: '2 min',
        content: [
            { text: 'Marco va alla gelateria.', translation: 'Marco goes to the ice cream shop.' },
            { text: '"Buongiorno! Che gusti avete?"', translation: '"Good morning! What flavors do you have?"' },
            { text: '"Abbiamo cioccolato, fragola, e pistacchio."', translation: '"We have chocolate, strawberry, and pistachio."' },
            { text: '"Vorrei due gusti, per favore."', translation: '"I would like two flavors, please."' },
            { text: '"Quali gusti?"', translation: '"Which flavors?"' },
            { text: '"Cioccolato e pistacchio."', translation: '"Chocolate and pistachio."' },
            { text: '"Ecco il suo gelato. Sono tre euro."', translation: '"Here is your ice cream. That\'s three euros."' },
            { text: '"Grazie mille!"', translation: '"Thanks a lot!"' },
        ],
        questions: [
            {
                question: 'Where does Marco go?',
                options: ['A café', 'A restaurant', 'An ice cream shop', 'A bakery'],
                correctAnswer: 'An ice cream shop',
            },
            {
                question: 'How many flavors does Marco order?',
                options: ['One', 'Two', 'Three', 'Four'],
                correctAnswer: 'Two',
            },
            {
                question: 'Which flavors does Marco choose?',
                options: ['Vanilla and strawberry', 'Chocolate and pistachio', 'Lemon and mint', 'Coffee and hazelnut'],
                correctAnswer: 'Chocolate and pistachio',
            },
        ],
    },
    // Portuguese Stories
    {
        id: 'portuguese-praia',
        title: 'Na Praia',
        language: 'portuguese',
        languageFlag: '🇧🇷',
        difficulty: 'Beginner',
        readTime: '2 min',
        content: [
            { text: 'Ana vai à praia com sua família.', translation: 'Ana goes to the beach with her family.' },
            { text: '"Que dia lindo!"', translation: '"What a beautiful day!"' },
            { text: '"Sim, o sol está brilhando!"', translation: '"Yes, the sun is shining!"' },
            { text: 'Ana nada no mar.', translation: 'Ana swims in the sea.' },
            { text: '"A água está muito boa!"', translation: '"The water is very nice!"' },
            { text: 'Seu irmão constrói um castelo de areia.', translation: 'Her brother builds a sand castle.' },
            { text: '"Vamos comer sorvete?"', translation: '"Shall we eat ice cream?"' },
            { text: '"Sim! Eu quero morango!"', translation: '"Yes! I want strawberry!"' },
        ],
        questions: [
            {
                question: 'Where does Ana go?',
                options: ['To the park', 'To the beach', 'To the pool', 'To the lake'],
                correctAnswer: 'To the beach',
            },
            {
                question: 'What does Ana do?',
                options: ['Builds a castle', 'Swims in the sea', 'Plays soccer', 'Reads a book'],
                correctAnswer: 'Swims in the sea',
            },
            {
                question: 'What flavor of ice cream does Ana want?',
                options: ['Chocolate', 'Vanilla', 'Strawberry', 'Lemon'],
                correctAnswer: 'Strawberry',
            },
        ],
    },
];

export function StoriesPage({ onExit }) {
    const { user, completeStory } = useApp();
    const { isDark } = useTheme();

    const [selectedStory, setSelectedStory] = useState(null);
    const [phase, setPhase] = useState('list');
    const [showTranslation, setShowTranslation] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);

    const currentLanguage = user?.currentLanguage;
    const langInfo = languages.find(l => l.id === currentLanguage);

    // Filter stories for current language
    const stories = currentLanguage
        ? allStories.filter(story => story.language === currentLanguage)
        : [];

    const handleSelectStory = (story) => {
        setSelectedStory(story);
        setPhase('read');
        setShowTranslation(null);
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setIsAnswerChecked(false);
        setCorrectCount(0);
    };

    const handleStartQuiz = () => {
        setPhase('quiz');
    };

    const handleCheckAnswer = () => {
        if (!selectedAnswer || !selectedStory) return;

        const isCorrect = selectedAnswer === selectedStory.questions[currentQuestion].correctAnswer;
        setIsAnswerChecked(true);
        if (isCorrect) {
            setCorrectCount(prev => prev + 1);
        }
    };

    const handleContinue = () => {
        if (!selectedStory) return;

        if (currentQuestion < selectedStory.questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswerChecked(false);
        } else {
            completeStory(selectedStory.id);
            setPhase('complete');
        }
    };

    // No language selected
    if (!currentLanguage) {
        return (
            <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border p-8 max-w-md w-full text-center`}>
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl">📖</span>
                    </div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        No Language Selected
                    </h2>
                    <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Please select a language first to read stories.
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

    // Story list for current language
    if (phase === 'list') {
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
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{langInfo?.flag}</span>
                            <div>
                                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{langInfo?.name} Stories</h1>
                                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Practice reading with short stories</p>
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className={`${isDark ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 border-purple-200'} border rounded-2xl p-6 mb-8`}>
                        <div className="flex items-start gap-4">
                            <span className="text-4xl">📖</span>
                            <div>
                                <h3 className={`font-semibold mb-2 ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>How Stories Work</h3>
                                <ul className={`space-y-1 text-sm ${isDark ? 'text-purple-200' : 'text-purple-700'}`}>
                                    <li>• Read short stories in {langInfo?.name}</li>
                                    <li>• Tap sentences to see translations</li>
                                    <li>• Answer comprehension questions at the end</li>
                                    <li>• Build reading skills while learning vocabulary</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Stories Grid */}
                    {stories.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {stories.map((story) => {
                                const isCompleted = user?.storiesCompleted.includes(story.id);

                                return (
                                    <button
                                        key={story.id}
                                        onClick={() => handleSelectStory(story)}
                                        className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-lg ${isDark
                                                ? 'bg-gray-800 border-gray-700 hover:border-purple-500'
                                                : 'bg-white border-gray-100 hover:border-purple-400'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <span className="text-4xl">{story.languageFlag}</span>
                                            {isCompleted && (
                                                <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                                                    ✓ Completed
                                                </span>
                                            )}
                                        </div>
                                        <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {story.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full ${story.difficulty === 'Beginner'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                                                    : story.difficulty === 'Intermediate'
                                                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                                                }`}>
                                                {story.difficulty}
                                            </span>
                                            <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                                                📚 {story.readTime}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border p-12 text-center`}>
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-4xl">📚</span>
                            </div>
                            <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                No Stories Available
                            </h3>
                            <p className={`mb-6 max-w-md mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                There are no stories available for {langInfo?.name} yet. Check back later or try a different language!
                            </p>
                            <button
                                onClick={onExit}
                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Reading phase
    if (phase === 'read' && selectedStory) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                {/* Header */}
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4 sticky top-0 z-10`}>
                    <div className="max-w-3xl mx-auto flex items-center gap-4">
                        <button
                            onClick={() => setPhase('list')}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                            <svg className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <div className="flex-1">
                            <h1 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedStory.title}</h1>
                            <div className="flex items-center gap-2 text-sm">
                                <span>{selectedStory.languageFlag}</span>
                                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{langInfo?.name}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Story Content */}
                <div className="max-w-3xl mx-auto px-4 py-8">
                    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border p-6 mb-8`}>
                        <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            💡 Tap any sentence to see its translation
                        </p>

                        <div className="space-y-4">
                            {selectedStory.content.map((line, index) => (
                                <div key={index}>
                                    <button
                                        onClick={() => setShowTranslation(showTranslation === index ? null : index)}
                                        className={`text-left w-full p-3 rounded-lg transition-all ${showTranslation === index
                                                ? isDark ? 'bg-purple-900/30' : 'bg-purple-50'
                                                : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {line.text}
                                        </p>
                                        {showTranslation === index && (
                                            <p className={`text-sm mt-2 italic ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                                                {line.translation}
                                            </p>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Continue Button */}
                    <div className="text-center">
                        <button
                            onClick={handleStartQuiz}
                            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg"
                        >
                            Take Comprehension Quiz →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz phase
    if (phase === 'quiz' && selectedStory) {
        const question = selectedStory.questions[currentQuestion];
        const isCorrect = selectedAnswer === question.correctAnswer;

        return (
            <div className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                {/* Header */}
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4`}>
                    <div className="max-w-3xl mx-auto flex items-center gap-4">
                        <button
                            onClick={() => setPhase('read')}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                            <svg className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <div className="flex-1">
                            <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <div
                                    className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 transition-all duration-300"
                                    style={{ width: `${((currentQuestion + 1) / selectedStory.questions.length) * 100}%` }}
                                />
                            </div>
                        </div>
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {currentQuestion + 1}/{selectedStory.questions.length}
                        </span>
                    </div>
                </div>

                {/* Question */}
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="max-w-2xl w-full">
                        <h2 className={`text-2xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {question.question}
                        </h2>

                        <div className="space-y-3">
                            {question.options.map((option, index) => {
                                const isSelected = selectedAnswer === option;
                                const isCorrectAnswer = option === question.correctAnswer;

                                let buttonStyle = isDark
                                    ? 'bg-gray-800 border-2 border-gray-700 hover:border-purple-500'
                                    : 'bg-white border-2 border-gray-200 hover:border-purple-300';

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
                                        ? 'bg-purple-900/30 border-2 border-purple-500'
                                        : 'bg-purple-50 border-2 border-purple-500';
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() => !isAnswerChecked && setSelectedAnswer(option)}
                                        disabled={isAnswerChecked}
                                        className={`w-full p-4 rounded-xl text-left font-medium transition-all ${buttonStyle}`}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t p-4`}>
                    <div className="max-w-3xl mx-auto flex items-center justify-end">
                        {!isAnswerChecked ? (
                            <button
                                onClick={handleCheckAnswer}
                                disabled={!selectedAnswer}
                                className={`px-8 py-3 rounded-xl font-semibold transition-all ${selectedAnswer
                                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700'
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
                                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all"
                            >
                                Continue
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Complete phase
    if (phase === 'complete' && selectedStory) {
        const percentage = Math.round((correctCount / selectedStory.questions.length) * 100);

        return (
            <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl border p-8 max-w-md w-full text-center`}>
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl">📚</span>
                    </div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Story Complete!
                    </h2>
                    <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        You finished "{selectedStory.title}"
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
                            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{percentage}%</p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Comprehension</p>
                        </div>
                        <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
                            <p className="text-3xl font-bold text-green-500">{correctCount}/{selectedStory.questions.length}</p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Correct</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => setPhase('list')}
                            className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all"
                        >
                            Read More Stories
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

    return null;
}
