import React from 'react';
import type { UserRole } from '../types';
import { Tooltip } from './Tooltip';

interface PromotionsCardProps {
    userRole: UserRole;
    lessonsCreated: number;
    onRewardClaimed: (message: string) => void;
}

const GOAL = 10;

export const PromotionsCard: React.FC<PromotionsCardProps> = ({ userRole, lessonsCreated, onRewardClaimed }) => {
    
    const handleShare = () => {
        const message = encodeURIComponent("Check out FeelEd AI! It creates amazing emotional learning lessons using AI. I'm using it to get free premium access! #FeelEdAI #EdTech");
        window.open(`https://wa.me/?text=${message}`, '_blank');
        onRewardClaimed("Thanks for sharing! Your 3-month free trial has been applied.");
    };

    const progress = Math.min((lessonsCreated / GOAL) * 100, 100);

    return (
        <div className="bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 dark:from-teal-900/50 dark:via-blue-900/50 dark:to-purple-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-1.17a3 3 0 01-5.66 0H8a2 2 0 110-4h1.17A3 3 0 015 5zm3 8a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        <path d="M10 18a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>
                    Unlock Premium for Free!
                </h2>
                <Tooltip text="Complete simple tasks like sharing on social media or creating lessons to earn free premium access." />
            </div>
            <div className="space-y-6">
                {/* WhatsApp Promotion */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Share & Get 3 Months Free</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Share with 5 WhatsApp groups to get a free 3-month <span className="font-medium">{userRole} Plan</span>.</p>
                        </div>
                        <button 
                            onClick={handleShare}
                            className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0 flex items-center justify-center space-x-2 w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-[#25D366] rounded-lg hover:bg-[#1DAE5A] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366] dark:focus:ring-offset-gray-800"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.655 4.398 1.919 6.166l-.36 1.325 1.35-1.288z"/>
                            </svg>
                            <span>Share Now</span>
                        </button>
                    </div>
                </div>

                {/* Lesson Creation Promotion */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200">Create & Get 1 Month Free</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create <strong>{GOAL}</strong> lessons to unlock a 1-month free trial.</p>
                    <div className="mt-3">
                         <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Your Progress</span>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{lessonsCreated} / {GOAL} Lessons</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                            <div className="bg-gradient-to-r from-teal-400 to-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                        {progress === 100 && (
                             <p className="text-center text-sm font-semibold text-green-600 dark:text-green-400 mt-2">
                                🎉 Goal Achieved! Your 1-month trial is active.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}