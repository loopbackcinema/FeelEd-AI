import React from 'react';
import type { GeneratedContent } from '../types';
import { AIAvatar } from './AIAvatar';

interface SharedLessonDisplayProps {
    content: GeneratedContent;
}

export const SharedLessonDisplay: React.FC<SharedLessonDisplayProps> = ({ content }) => {
    const goToMainApp = () => {
        // Construct the base URL without query parameters
        const baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
        window.location.href = baseUrl;
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200 font-sans">
            <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20">
                <div className="container mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                       <div className="p-2 bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                       </div>
                      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        FeelEd <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">AI</span>
                      </h1>
                    </div>
                    <button 
                        onClick={goToMainApp} 
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                        Create Your Own Lesson
                    </button>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8">
                    
                    {content.avatarCustomization && (
                        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="relative w-20 h-20 flex-shrink-0">
                                <AIAvatar 
                                    className="w-full h-full"
                                    isSpeaking={false}
                                    {...content.avatarCustomization}
                                />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">A lesson prepared for you by:</p>
                                <p className="text-xl font-semibold text-gray-800 dark:text-white">Your Teacher</p>
                            </div>
                        </div>
                    )}

                    <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 mb-2">SHARED LESSON</p>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{content.title}</h2>

                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg mb-6 border border-l-4 border-yellow-400 dark:border-yellow-600">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 dark:text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    <strong>Note:</strong> Audio playback is available only in the main application. This shared view contains the lesson's script and visuals.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        {content.scenes.map(scene => (
                            <div key={scene.sceneNumber} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                                <p className="font-semibold text-sm text-teal-700 dark:text-teal-400 mb-2">SCENE {scene.sceneNumber}</p>
                                <div className="md:flex md:space-x-4">
                                    <div className="flex-grow">
                                        <p className="text-gray-800 dark:text-gray-200">{scene.narration}</p>
                                        {scene.textOverlay && (
                                            <div className="mt-3 bg-black/50 text-white text-sm font-mono py-1 px-3 rounded-md inline-block">
                                                <p>"{scene.textOverlay}"</p>
                                            </div>
                                        )}
                                    </div>
                                    {scene.imageUrl && (
                                        <div className="md:w-48 mt-4 md:mt-0 flex-shrink-0">
                                            <img src={scene.imageUrl} alt={`Visual for Scene ${scene.sceneNumber}`} className="w-full h-auto rounded-lg object-cover shadow-md" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {content.summary && (
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                             <h3 className="text-xl font-semibold mb-3">Summary</h3>
                             <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{content.summary}</p>
                        </div>
                    )}

                    {content.quiz && (
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-semibold mb-3">Quiz</h3>
                            <p className="mb-4 font-medium text-gray-800 dark:text-gray-200">{content.quiz.question}</p>
                            <div className="space-y-3">
                                {content.quiz.options.map((option, index) => (
                                    <div key={index} className="w-full text-left p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                        {option.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                 <div className="text-center mt-8">
                    <button 
                        onClick={goToMainApp} 
                        className="px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                        ✨ Create a Lesson with FeelEd AI
                    </button>
                </div>
            </main>
        </div>
    );
};