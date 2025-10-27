

import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface ApiKeySelectorProps {
  onKeySelected: () => void;
  onKeyCleared: () => void;
}

const API_KEY_STORAGE_KEY = 'feeled_api_key_selected';

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected, onKeyCleared }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isKeyStored, setIsKeyStored] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);


    useEffect(() => {
        const stored = localStorage.getItem(API_KEY_STORAGE_KEY) === 'true';
        setIsKeyStored(stored);
    }, []);

    const validateAndProceed = async () => {
        setIsProcessing(true);
        setValidationError(null);
        try {
            // The window.aistudio dialog is expected to have updated process.env.API_KEY
            if (!process.env.API_KEY) {
                // This can happen if the user closes the dialog without selecting a key.
                // We'll just stop processing without showing an error.
                setIsProcessing(false);
                return;
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            // Make a simple, low-cost API call to validate the key's authenticity and permissions.
            await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: 'validate' });

            // If the call succeeds, the key is valid.
            onKeySelected();

        } catch (error) {
            console.error("API Key validation failed:", error);
            setValidationError("The selected API key is invalid or lacks permissions. Please choose a different key.");
            onKeyCleared(); // Clear the bad key from storage
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSelectKey = async () => {
        setIsProcessing(true);
        setValidationError(null);
        try {
            if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
                await window.aistudio.openSelectKey();
                // After the user interacts with the dialog, attempt to validate the key.
                await validateAndProceed();
            } else {
                alert("API selection utility is not available.");
                setIsProcessing(false);
            }
        } catch (e) {
            console.error("Error during the API key selection process:", e);
            setIsProcessing(false);
        }
    };

     const handleClearKey = () => {
        setValidationError(null);
        onKeyCleared();
        setIsKeyStored(false);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
            <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-6 0H7a2 2 0 01-2-2V9a2 2 0 012-2h2m2 10V5m0 14a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">API Key Required</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                {isKeyStored && !validationError
                    ? "Your stored API key could not be found or is invalid. Please select a new key to continue."
                    : "This application uses Gemini models for lesson generation. Please select an API key to proceed."
                }
            </p>
            {validationError && (
                 <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-6 text-sm border border-red-200 dark:border-red-700/50 animate-fade-in" role="alert">
                    <p>{validationError}</p>
                </div>
            )}
            <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-4 sm:space-y-0">
                <button
                    onClick={handleSelectKey}
                    disabled={isProcessing}
                    className="w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isProcessing ? "Validating Key..." : (isKeyStored ? "Select New API Key" : "Select API Key")}
                </button>
                 {isKeyStored && (
                     <button
                        onClick={handleClearKey}
                        className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                    >
                        Clear Stored Key
                    </button>
                )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                For more information on billing, please visit the{' '}
                <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:underline"
                >
                    official documentation
                </a>.
            </p>
        </div>
    );
};