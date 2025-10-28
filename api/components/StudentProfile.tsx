



import React, { useState } from 'react';
import { ToggleSwitch } from './ToggleSwitch';
import { PromotionsCard } from './PromotionsCard';
import { AchievementsCard } from './AchievementsCard';
import { CertificateModal } from './CertificateModal';
import { useAuth } from '../contexts/AuthContext';
import { GeneralSettings } from './GeneralSettings';

interface ProfileProps {
    onBack: () => void;
    onSettingsSave: () => void;
    lessonsCreated: number;
    onRewardClaimed: (message: string) => void;
}

export const StudentProfile: React.FC<ProfileProps> = ({ onBack, onSettingsSave, lessonsCreated, onRewardClaimed }) => {
    const { user, userRole } = useAuth();
    const [notifications, setNotifications] = useState({
        lessonReady: true,
    });
    const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
    const [achievementLevel, setAchievementLevel] = useState('');

    const handleViewCertificate = (level: string) => {
        setAchievementLevel(level);
        setIsCertificateModalOpen(true);
    };


    return (
        <>
            <div className="container mx-auto p-4 md:p-8 animate-fade-in">
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Student Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">Welcome! Here's a summary of your learning journey.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* My Lessons */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-3">My Lessons</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">You have completed <strong>{lessonsCreated}</strong> lessons.</p>
                            <button className="mt-4 text-sm text-teal-600 dark:text-teal-400 font-semibold hover:underline">View All Lessons</button>
                        </div>
                        {/* My Progress */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-3">My Progress</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Average quiz score: <strong>92%</strong></p>
                            <button className="mt-4 text-sm text-teal-600 dark:text-teal-400 font-semibold hover:underline">View Detailed Report</button>
                        </div>
                        {/* Account Settings */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-3">Account Settings</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Update your profile information and password.</p>
                            <button className="mt-4 text-sm text-teal-600 dark:text-teal-400 font-semibold hover:underline">Edit Profile</button>
                        </div>
                         {/* Subscription Details */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-3">Subscription Details</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Current Plan: <strong>Student Plan</strong> (₹99 / month)</p>
                            <button className="mt-4 text-sm text-teal-600 dark:text-teal-400 font-semibold hover:underline">Manage Subscription</button>
                        </div>
                         {/* Notification Settings */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg md:col-span-2">
                            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                            <div className="space-y-4">
                               <ToggleSwitch 
                                    label="New Lesson Ready"
                                    enabled={notifications.lessonReady}
                                    onChange={() => setNotifications(prev => ({ ...prev, lessonReady: !prev.lessonReady }))}
                               />
                            </div>
                             <div className="mt-6 text-right">
                                 <button
                                    onClick={onSettingsSave}
                                    className="px-5 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>

                        {/* General Settings */}
                        <div className="md:col-span-2">
                            <GeneralSettings />
                        </div>

                        {/* Achievements */}
                        <div className="md:col-span-2">
                            <AchievementsCard
                                lessonsCreated={lessonsCreated}
                                onViewCertificate={handleViewCertificate}
                            />
                        </div>

                        {/* Promotions */}
                        <div className="md:col-span-2">
                             <PromotionsCard
                                userRole={userRole}
                                lessonsCreated={lessonsCreated}
                                onRewardClaimed={onRewardClaimed}
                            />
                        </div>
                    </div>

                    <div className="text-center mt-10">
                        <button
                            onClick={onBack}
                            className="px-6 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700"
                        >
                            Back to App
                        </button>
                    </div>
                </div>
            </div>
             <CertificateModal 
                isOpen={isCertificateModalOpen}
                onClose={() => setIsCertificateModalOpen(false)}
                level={achievementLevel}
                studentName={user?.displayName || 'Valued Student'}
                lessonsCreated={lessonsCreated}
            />
        </>
    );
};