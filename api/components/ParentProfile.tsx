

import React, { useState } from 'react';
import { ToggleSwitch } from './ToggleSwitch';
import { PromotionsCard } from './PromotionsCard';
import { useAuth } from '../contexts/AuthContext';
import { GeneralSettings } from './GeneralSettings';

interface ProfileProps {
    onBack: () => void;
    onSettingsSave: () => void;
    lessonsCreated: number;
    onRewardClaimed: (message: string) => void;
}

export const ParentProfile: React.FC<ProfileProps> = ({ onBack, onSettingsSave, lessonsCreated, onRewardClaimed }) => {
    const { userRole } = useAuth();
    const [notifications, setNotifications] = useState({
        activitySummary: true,
        progressReports: true,
        subscription: false,
    });

    const handleToggle = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="container mx-auto p-4 md:p-8 animate-fade-in">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Parent Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Monitor your child's learning and progress with FeelEd AI.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Child's Activity */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3">Child's Activity</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Your child completed <strong>2</strong> lessons this week.</p>
                        <button className="mt-4 text-sm text-teal-600 dark:text-teal-400 font-semibold hover:underline">View Activity Log</button>
                    </div>
                    {/* Progress Reports */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3">Progress Reports</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Weekly report is ready to view.</p>
                        <button className="mt-4 text-sm text-teal-600 dark:text-teal-400 font-semibold hover:underline">View Reports</button>
                    </div>
                    {/* Subscription Details */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3">Subscription Details</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Current Plan: <strong>Parent Plan</strong> (₹299 / month)</p>
                        <button className="mt-4 text-sm text-teal-600 dark:text-teal-400 font-semibold hover:underline">Manage Subscription</button>
                    </div>
                    {/* Account Settings */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3">Account Settings</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Update your family's information.</p>
                        <button className="mt-4 text-sm text-teal-600 dark:text-teal-400 font-semibold hover:underline">Edit Profile</button>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                        <div className="space-y-4">
                           <ToggleSwitch 
                                label="Child's Activity Summary"
                                enabled={notifications.activitySummary}
                                onChange={() => handleToggle('activitySummary')}
                           />
                           <ToggleSwitch 
                                label="Weekly Progress Reports"
                                enabled={notifications.progressReports}
                                onChange={() => handleToggle('progressReports')}
                           />
                           <ToggleSwitch 
                                label="Subscription Renewals"
                                enabled={notifications.subscription}
                                onChange={() => handleToggle('subscription')}
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
    );
};