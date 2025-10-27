import React, { useState } from 'react';
import type { LessonFormData } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { Tooltip } from './Tooltip';

interface LessonFormProps {
  onGenerate: (formData: LessonFormData) => void;
  isLoading: boolean;
}

export const LessonForm: React.FC<LessonFormProps> = ({ onGenerate, isLoading }) => {
  const { language } = useSettings();
  
  const [formData, setFormData] = useState<LessonFormData>({
    concept: 'The water cycle',
    grade: '5',
    language: language,
    tone: 'Curious',
    voice: 'Kore',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Create a New Lesson</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Enter a concept and let our AI craft an emotionally engaging audio lesson for you.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="concept" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Concept, Question, or Problem
                </label>
                <textarea
                    id="concept"
                    name="concept"
                    rows={3}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    value={formData.concept}
                    onChange={handleChange}
                    placeholder="e.g., Photosynthesis, solving x² + 5x + 6 = 0"
                    required
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Grade Level
                    </label>
                    <select
                        id="grade"
                        name="grade"
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                        value={formData.grade}
                        onChange={handleChange}
                        required
                    >
                        <option value="1">1st std</option>
                        <option value="2">2nd std</option>
                        <option value="3">3rd std</option>
                        <option value="4">4th std</option>
                        <option value="5">5th std</option>
                        <option value="6">6th std</option>
                        <option value="7">7th std</option>
                        <option value="8">8th std</option>
                        <option value="9">9th std</option>
                        <option value="10">10th std</option>
                        <option value="11">11th std</option>
                        <option value="12">12th std</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Language
                    </label>
                    <select
                        id="language"
                        name="language"
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                        value={formData.language}
                        onChange={handleChange}
                        required
                    >
                        <option>English</option>
                        <option>Tamil</option>
                        <option>Hindi</option>
                        <option>Vietnamese</option>
                         <option>Spanish</option>
                    </select>
                </div>
                 <div>
                    <div className="flex items-center space-x-1.5 mb-1">
                        <label htmlFor="tone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Emotional Tone
                        </label>
                        <Tooltip text="Influences the story's mood and narrator's delivery to make the lesson more engaging." />
                    </div>
                    <select
                        id="tone"
                        name="tone"
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                        value={formData.tone}
                        onChange={handleChange}
                        required
                    >
                        <option>Fun</option>
                        <option>Curious</option>
                        <option>Empathetic</option>
                        <option>Serious</option>
                        <option>Inspiring</option>
                    </select>
                </div>
                 <div>
                    <div className="flex items-center space-x-1.5 mb-1">
                        <label htmlFor="voice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Voice
                        </label>
                         <Tooltip text="Select from a range of AI voices, each with a unique personality." />
                    </div>
                    <select
                        id="voice"
                        name="voice"
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                        value={formData.voice}
                        onChange={handleChange}
                        required
                    >
                        <option>Kore</option>
                        <option>Puck</option>
                        <option>Charon</option>
                        <option>Fenrir</option>
                        <option>Zephyr</option>
                    </select>
                </div>
            </div>
            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
                >
                    {isLoading ? 'Generating...' : '✨ Generate Audio Lesson'}
                </button>
            </div>
        </form>
    </div>
  );
};