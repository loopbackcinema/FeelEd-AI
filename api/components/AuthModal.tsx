

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type AuthStep = 'roleSelection' | 'login';
type SelectedRole = Exclude<UserRole, null>;

const RoleCard: React.FC<{
    icon: React.ReactNode;
    title: SelectedRole;
    description: string;
    onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
    <button
        onClick={onClick}
        className="w-full text-left p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-teal-500 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
    >
        <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded-full text-2xl">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
        </div>
    </button>
);


export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { loginWithGoogle, isConfigured } = useAuth();
    const [step, setStep] = useState<AuthStep>('roleSelection');
    const [selectedRole, setSelectedRole] = useState<SelectedRole | null>(null);

    if (!isOpen) return null;

    const handleRoleSelect = (role: SelectedRole) => {
        setSelectedRole(role);
        setStep('login');
    };

    const handleBack = () => {
        setStep('roleSelection');
        setSelectedRole(null);
    };

    const handleLogin = async () => {
        if (selectedRole) {
            await loginWithGoogle(selectedRole);
            onClose(); // Close modal after login attempt
        }
    };
    
    const renderRoleSelection = () => (
        <>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Join FeelEd AI</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">To get started, please tell us who you are.</p>
            </div>
            <div className="mt-8 space-y-4">
                <RoleCard 
                    icon="🎓"
                    title="Student"
                    description="To learn and explore new concepts."
                    onClick={() => handleRoleSelect('Student')}
                />
                <RoleCard 
                    icon="🏫"
                    title="Teacher"
                    description="To create lessons & track student progress."
                    onClick={() => handleRoleSelect('Teacher')}
                />
                 <RoleCard 
                    icon="👨‍👩‍👧"
                    title="Parent"
                    description="To monitor my child's learning journey."
                    onClick={() => handleRoleSelect('Parent')}
                />
            </div>
        </>
    );

    const renderLoginStep = () => (
        <>
            <div className="relative text-center">
                <button onClick={handleBack} className="absolute left-0 top-1 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Your {selectedRole} Account</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Continue with your Google account to get started.</p>
            </div>
            <div className="mt-8">
                 <button
                    onClick={handleLogin}
                    disabled={!isConfigured}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.651-3.358-11.297-7.962l-6.571,4.819C9.656,39.663,16.318,44,24,44z"/>
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,36.566,44,30.836,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                    <span>Sign in with Google</span>
                </button>
                {!isConfigured && (
                     <p className="mt-4 text-xs text-center text-red-600 dark:text-red-400">
                        Authentication is disabled. Please contact the site administrator.
                    </p>
                )}
                <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </>
    );

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 transition-opacity" 
            aria-modal="true" 
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-8 transform transition-all scale-95 opacity-0 animate-fade-in-scale"
                onClick={(e) => e.stopPropagation()}
            >
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                {step === 'roleSelection' ? renderRoleSelection() : renderLoginStep()}
            </div>
        </div>
    );
};