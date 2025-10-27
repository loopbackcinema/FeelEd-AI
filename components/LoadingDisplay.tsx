

import React from 'react';

interface LoadingDisplayProps {
  message: string;
}

export const LoadingDisplay: React.FC<LoadingDisplayProps> = ({ message }) => {
  const phase = message.startsWith('Phase 1/2') ? 1 : message.startsWith('Phase 2/2') ? 2 : 0;
  const progress = phase === 1 ? 25 : (phase === 2 ? 75 : 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="relative w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Crafting Your Lesson</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 h-6">{message}</p>
            <div className="flex justify-center items-center space-x-2 mb-6">
                <div className="w-4 h-4 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-4 h-4 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-4 h-4 bg-teal-400 rounded-full animate-bounce"></div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                    className="bg-gradient-to-r from-teal-400 to-blue-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                This may take a moment. Great things are worth the wait!
            </p>
        </div>
    </div>
  );
};