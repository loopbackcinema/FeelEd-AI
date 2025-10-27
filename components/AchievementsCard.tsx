import React from 'react';
import { Tooltip } from './Tooltip';

interface AchievementsCardProps {
    lessonsCreated: number;
    onViewCertificate: (level: string) => void;
}

const achievements = [
    { threshold: 100, title: "Outstanding Student", icon: '🏆' },
    { threshold: 50, title: "Best Student", icon: '🥇' },
    { threshold: 10, title: "Good Student", icon: '🏅' },
];

export const AchievementsCard: React.FC<AchievementsCardProps> = ({ lessonsCreated, onViewCertificate }) => {
    
    const getCurrentAchievement = () => {
        for (const achievement of achievements) {
            if (lessonsCreated >= achievement.threshold) {
                return achievement;
            }
        }
        return null;
    };

    const getNextAchievement = () => {
        for (let i = achievements.length - 1; i >= 0; i--) {
            if (lessonsCreated < achievements[i].threshold) {
                return { 
                    ...achievements[i], 
                    start: i < achievements.length - 1 ? achievements[i+1].threshold : 0 
                };
            }
        }
        return null; // Max level reached
    };

    const currentAchievement = getCurrentAchievement();
    const nextAchievement = getNextAchievement();
    
    let progress = 0;
    if (nextAchievement) {
        const range = nextAchievement.threshold - nextAchievement.start;
        const current = lessonsCreated - nextAchievement.start;
        progress = Math.min(Math.max((current / range) * 100, 0), 100);
    } else if (currentAchievement) {
        progress = 100;
    }


    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 2zM5.404 4.343a.75.75 0 010 1.06l-1.47 1.47a.75.75 0 11-1.06-1.06l1.47-1.47a.75.75 0 011.06 0zm9.192 0a.75.75 0 011.06 0l1.47 1.47a.75.75 0 11-1.06 1.06l-1.47-1.47a.75.75 0 010-1.06zM10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                    </svg>
                    Your Achievements
                </h2>
                <Tooltip text="Earn certificates and unlock achievements by consistently creating lessons." />
            </div>
            
            <div className="text-center mb-4">
                <div className="text-5xl">{currentAchievement?.icon ?? '🌱'}</div>
                <p className="text-lg font-bold text-gray-800 dark:text-white mt-2">{currentAchievement?.title ?? 'Budding Learner'}</p>
                 <p className="text-sm text-gray-500 dark:text-gray-400">Based on creating {lessonsCreated} lessons</p>
            </div>

            {nextAchievement && (
                <div className="mt-4">
                     <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Progress to "{nextAchievement.title}"</span>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{lessonsCreated} / {nextAchievement.threshold}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            )}
            
            {currentAchievement && (
                <div className="mt-6 text-center">
                    <button 
                        onClick={() => onViewCertificate(currentAchievement.title)}
                        className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                    >
                        View Certificate
                    </button>
                </div>
            )}
        </div>
    );
};