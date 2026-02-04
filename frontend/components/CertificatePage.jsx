import { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { languages } from '../data/languages';
import { lessons } from '../data/lessons';

export function CertificatePage({ onExit }) {
    const { user } = useApp();
    const { isDark } = useTheme();
    const certificateRef = useRef(null);

    // Get completed courses
    const completedCourses = Object.entries(user?.progress || {}).filter(([langId, progress]) => {
        const langLessons = lessons[langId] || [];
        return langLessons.length > 0 && progress.lessonsCompleted.length === langLessons.length;
    });

    const handleDownload = async (langId) => {
        const language = languages.find(l => l.id === langId);
        const progress = user?.progress[langId];

        if (!language || !progress) return;

        // Create a canvas element
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 850;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        // Background
        const gradient = ctx.createLinearGradient(0, 0, 1200, 850);
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(1, '#059669');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1200, 850);

        // White inner card
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(50, 50, 1100, 750, 20);
        ctx.fill();

        // Border
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(70, 70, 1060, 710, 15);
        ctx.stroke();

        // Certificate text
        ctx.fillStyle = '#10b981';
        ctx.font = 'italic 24px Georgia';
        ctx.textAlign = 'center';
        ctx.fillText('Certificate of Achievement', 600, 150);

        // Title
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 48px Georgia';
        ctx.fillText('LANGUAGE PROFICIENCY', 600, 220);

        // Decorative line
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(300, 260);
        ctx.lineTo(900, 260);
        ctx.stroke();

        // Presented to
        ctx.fillStyle = '#6b7280';
        ctx.font = '20px Georgia';
        ctx.fillText('This is to certify that', 600, 320);

        // Name
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 42px Georgia';
        ctx.fillText(user?.name || 'Student', 600, 380);

        // Decorative line under name
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(400, 400);
        ctx.lineTo(800, 400);
        ctx.stroke();

        // Achievement text
        ctx.fillStyle = '#6b7280';
        ctx.font = '20px Georgia';
        ctx.fillText('has successfully completed the', 600, 460);

        // Course name
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 36px Georgia';
        ctx.fillText(`${language.name} Language Course`, 600, 520);

        // Stats
        ctx.fillStyle = '#6b7280';
        ctx.font = '18px Georgia';
        ctx.fillText(`Lessons Completed: ${progress.lessonsCompleted.length} | Total Points: ${progress.totalScore}`, 600, 580);

        // Date
        ctx.fillStyle = '#1f2937';
        ctx.font = '18px Georgia';
        const date = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        ctx.fillText(`Issued on ${date}`, 600, 640);

        // Signature
        ctx.fillStyle = '#10b981';
        ctx.font = 'italic 24px Georgia';
        ctx.fillText('LinguaLearn', 600, 720);
        ctx.font = '14px Georgia';
        ctx.fillStyle = '#6b7280';
        ctx.fillText('Language Learning Platform', 600, 745);

        // Flag emoji (as text - browsers handle it)
        ctx.font = '80px Arial';
        ctx.fillText(language.flag, 150, 450);
        ctx.fillText(language.flag, 1050, 450);

        // Download
        const link = document.createElement('a');
        link.download = `LinguaLearn_${language.name}_Certificate.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

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
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Certificates</h1>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Download your achievement certificates</p>
                    </div>
                </div>

                {/* Info */}
                <div className={`${isDark ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border rounded-2xl p-6 mb-8`}>
                    <div className="flex items-start gap-4">
                        <span className="text-4xl">🏆</span>
                        <div>
                            <h3 className={`font-semibold mb-2 ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>Earn Certificates</h3>
                            <p className={`text-sm ${isDark ? 'text-yellow-200' : 'text-yellow-700'}`}>
                                Complete all lessons in a language course to unlock your certificate. Each certificate is personalized with your name and achievements!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Completed Courses */}
                {completedCourses.length > 0 ? (
                    <div className="space-y-6">
                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Your Certificates ({completedCourses.length})
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {completedCourses.map(([langId, progress]) => {
                                const language = languages.find(l => l.id === langId);
                                if (!language) return null;

                                return (
                                    <div
                                        key={langId}
                                        ref={certificateRef}
                                        className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
                                    >
                                        {/* Certificate Preview */}
                                        <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-6 text-white">
                                            <div className="flex justify-between items-start">
                                                <span className={`fi fi-${language.code} text-5xl rounded shadow-sm`} />
                                                <span className="text-5xl">🏆</span>
                                            </div>
                                            <div className="mt-4">
                                                <p className="text-green-100 text-sm">Certificate of Completion</p>
                                                <h3 className="text-2xl font-bold">{language.name}</h3>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div>
                                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Lessons</p>
                                                    <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        {progress.lessonsCompleted.length} Completed
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Points</p>
                                                    <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        {progress.totalScore}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleDownload(langId)}
                                                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                Download Certificate
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border p-12 text-center`}>
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">📜</span>
                        </div>
                        <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            No Certificates Yet
                        </h3>
                        <p className={`mb-6 max-w-md mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Complete all lessons in a language course to earn your certificate. Keep learning!
                        </p>
                        <button
                            onClick={onExit}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
                        >
                            Continue Learning
                        </button>
                    </div>
                )}

                {/* In Progress Courses */}
                {(() => {
                    const inProgressCourses = Object.entries(user?.progress || {}).filter(([langId, progress]) => {
                        const langLessons = lessons[langId] || [];
                        return langLessons.length > 0 &&
                            progress.lessonsCompleted.length > 0 &&
                            progress.lessonsCompleted.length < langLessons.length;
                    });

                    if (inProgressCourses.length === 0) return null;

                    return (
                        <div className="mt-12">
                            <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                In Progress
                            </h2>

                            <div className="space-y-4">
                                {inProgressCourses.map(([langId, progress]) => {
                                    const language = languages.find(l => l.id === langId);
                                    const langLessons = lessons[langId] || [];
                                    const percentage = Math.round((progress.lessonsCompleted.length / langLessons.length) * 100);

                                    if (!language) return null;

                                    return (
                                        <div
                                            key={langId}
                                            className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className={`fi fi-${language.code} text-3xl rounded shadow-sm`} />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                            {language.name}
                                                        </h3>
                                                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            {progress.lessonsCompleted.length}/{langLessons.length} lessons
                                                        </span>
                                                    </div>
                                                    <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                                        <div
                                                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}
