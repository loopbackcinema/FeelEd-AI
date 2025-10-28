
import React from 'react';

interface AboutPageProps {
    onBack: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
    return (
        <div className="container mx-auto p-4 md:p-8 animate-fade-in">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-8 md:p-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white">About FeelEd AI</h1>
                    <p className="mt-4 text-lg text-teal-100">Revolutionizing Learning Through Emotion</p>
                </div>
                <div className="p-8 md:p-10 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Our Mission</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            At FeelEd AI, our mission is to transform education by making it more engaging, accessible, and memorable. We believe that emotional connection is the key to unlocking a student's full learning potential. By harnessing the power of generative AI, we create personalized, story-driven audio lessons that captivate students' hearts and minds, fostering a genuine love for learning that lasts a lifetime.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">How It Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                                <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 font-bold text-xl">1</div>
                                <h3 className="font-semibold text-lg">Create</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Educators input any concept, grade, and desired emotional tone.</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                                <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold text-xl">2</div>
                                <h3 className="font-semibold text-lg">Engage</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Our AI generates a unique, story-based audio lesson with optional visuals.</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                                <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 font-bold text-xl">3</div>
                                <h3 className="font-semibold text-lg">Learn</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Students experience a multi-sensory lesson that improves retention.</p>
                            </div>
                        </div>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">The Technology</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            FeelEd is powered by Google's state-of-the-art Gemini models. This allows us to generate high-quality, coherent, and emotionally resonant content in multiple languages. From crafting intricate stories and generating human-like speech to creating supportive visuals, we leverage cutting-edge AI to build a truly next-generation learning platform.
                        </p>
                    </section>

                    <div className="text-center pt-4">
                        <button
                            onClick={onBack}
                            className="px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all"
                        >
                            Back to the App
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
