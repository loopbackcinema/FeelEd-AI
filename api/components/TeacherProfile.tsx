import React, { useState, useRef } from 'react';
import { ToggleSwitch } from './ToggleSwitch';
import { PromotionsCard } from './PromotionsCard';
import { AIAvatar } from './AIAvatar';
import type { AvatarCustomization, Student } from '../types';
import { mockClassroom } from '../services/mockData';
import { StudentProgressModal } from './StudentProgressModal';
import { useAuth } from '../contexts/AuthContext';
import { GeneralSettings } from './GeneralSettings';
import { Tooltip } from './Tooltip';

interface ProfileProps {
    onBack: () => void;
    onSettingsSave: () => void;
    lessonsCreated: number;
    onRewardClaimed: (message: string) => void;
    avatarCustomization: AvatarCustomization;
    onAvatarChange: (newSettings: Partial<AvatarCustomization>) => void;
}

export const TeacherProfile: React.FC<ProfileProps> = ({ onBack, onSettingsSave, lessonsCreated, onRewardClaimed, avatarCustomization, onAvatarChange }) => {
    const { userRole } = useAuth();
    const [notifications, setNotifications] = useState({
        lessonComplete: true,
        subscription: true,
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

    const handleViewProgress = (student: Student) => {
        setSelectedStudent(student);
        setIsProgressModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsProgressModalOpen(false);
        setSelectedStudent(null);
    };

    const handleToggle = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64String = e.target?.result as string;
                onAvatarChange({ style: 'photo', imageUrl: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        onAvatarChange({ style: 'robot', imageUrl: undefined });
        setShowRemoveConfirm(true);
        setTimeout(() => setShowRemoveConfirm(false), 2000); // Show confirmation for 2 seconds
    };

    return (
        <>
            <div className="container mx-auto p-4 md:p-8 animate-fade-in">
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Teacher Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">Manage your classrooms, lessons, and student progress.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Student Progress Tracker - NEW */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg md:col-span-2">
                             <div className="flex items-center justify-between mb-4">
                                 <h2 className="text-xl font-semibold">Student Progress Tracker</h2>
                                 <Tooltip text="View quiz results and lesson completion data for students in your classroom." />
                             </div>
                             <div className="space-y-3">
                                {mockClassroom.students.map(student => {
                                    const studentAttempts = mockClassroom.quizAttempts.filter(a => a.studentId === student.id);
                                    const totalAttempts = studentAttempts.length;
                                    const correctAttempts = studentAttempts.filter(a => a.isCorrect).length;
                                    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
                                    
                                     const getAccuracyColor = (acc: number) => {
                                        if (acc >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
                                        if (acc >= 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
                                        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
                                    };

                                    return (
                                        <div key={student.id} className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-white">{student.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{totalAttempts} lessons completed</p>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                {totalAttempts > 0 ? (
                                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getAccuracyColor(accuracy)}`}>
                                                        {accuracy}% Accuracy
                                                    </span>
                                                ) : (
                                                     <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                                                        No Data
                                                    </span>
                                                )}
                                                <button 
                                                    onClick={() => handleViewProgress(student)}
                                                    className="px-3 py-1 text-xs font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
                                                    aria-label={`View progress details for ${student.name}`}
                                                >
                                                    Details
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                             </div>
                        </div>
                        {/* My Classrooms */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-3">My Classrooms</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">You are managing <strong>3</strong> classrooms.</p>
                            <button className="mt-4 text-sm text-teal-600 dark:text-teal-400 font-semibold hover:underline">Manage Classrooms</button>
                        </div>
                        {/* Lesson Library */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-3">Lesson Library</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">You have created <strong>{lessonsCreated}</strong> lessons.</p>
                            <button className="mt-4 text-sm text-teal-600 dark:text-teal-400 font-semibold hover:underline">Go to Library</button>
                        </div>
                        {/* Account Settings */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-3">Account Settings</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your profile information.</p>
                            <button className="mt-4 text-sm text-teal-600 dark:text-teal-400 font-semibold hover:underline">Edit Profile</button>
                        </div>
                        {/* Subscription Details */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-3">Subscription Details</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Current Plan: <strong>Teacher Plan</strong> (₹199 / month)</p>
                            <button className="mt-4 text-sm text-teal-600 dark:text-teal-400 font-semibold hover:underline">Manage Subscription</button>
                        </div>
                        {/* Notification Settings */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg md:col-span-2">
                            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                            <div className="space-y-4">
                               <ToggleSwitch 
                                    label="Lesson Generation Complete"
                                    enabled={notifications.lessonComplete}
                                    onChange={() => handleToggle('lessonComplete')}
                               />
                               <ToggleSwitch 
                                    label="Subscription Reminders"
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

                        {/* New Avatar Card */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg md:col-span-2">
                            <h2 className="text-xl font-semibold mb-4">Profile Avatar</h2>
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="relative w-28 h-28 flex-shrink-0">
                                    <AIAvatar 
                                        className="w-full h-full"
                                        isSpeaking={false} 
                                        {...avatarCustomization}
                                    />
                                </div>
                                <div className="text-center sm:text-left">
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Personalize your lessons by uploading a custom photo. This avatar will be shown when you share lessons with your students.
                                    </p>
                                    <div className="relative flex items-center justify-center sm:justify-start space-x-3">
                                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                        <button 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700"
                                        >
                                            Upload Photo
                                        </button>
                                        {avatarCustomization.style === 'photo' && (
                                            <button 
                                                onClick={handleRemovePhoto}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                                            >
                                                Remove Photo
                                            </button>
                                        )}
                                        {showRemoveConfirm && (
                                            <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 px-3 py-1.5 text-xs font-semibold text-white bg-gray-900/80 dark:bg-black/80 rounded-md animate-fade-in whitespace-nowrap shadow-lg">
                                                Photo Removed
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
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
            <StudentProgressModal 
                isOpen={isProgressModalOpen}
                onClose={handleCloseModal}
                student={selectedStudent}
                attempts={mockClassroom.quizAttempts.filter(a => a.studentId === selectedStudent?.id)}
            />
        </>
    );
};