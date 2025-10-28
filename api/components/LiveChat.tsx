import React from 'react';

interface LiveChatProps {
  onClose: () => void;
}

export const LiveChat: React.FC<LiveChatProps> = ({ onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-80 h-[60vh] sm:h-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-gray-800 dark:text-white">FeelEd AI Assistant</h3>
        <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      
      {/* Body */}
      <div className="flex-grow p-4 flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-teal-100 dark:bg-teal-900/50 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500 dark:text-teal-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
        </div>
        <h4 className="font-semibold text-lg text-gray-800 dark:text-white">Live Chat Coming Soon!</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            We are working on a secure, stateful backend to power real-time conversations. 
            This feature is temporarily disabled to ensure your API key remains 100% protected.
        </p>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
        <button
          disabled={true}
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
