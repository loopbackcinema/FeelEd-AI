import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

const LANGUAGES = [
    "English", "Tamil", "Hindi", "Vietnamese", "Spanish"
];

export const GeneralSettings: React.FC = () => {
    const { language, setLanguage } = useSettings();

    return (
        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">General Settings</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Default Language
                    </label>
                    <select
                        id="language"
                        name="language"
                        className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        This will be the default language for new lesson generation.
                    </p>
                </div>
            </div>
        </div>
    );
};
