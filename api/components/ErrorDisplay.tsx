import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  onDismiss: () => void;
  showRetryButton?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry, onDismiss, showRetryButton = true }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/50 p-6 rounded-xl shadow-lg border border-red-300 dark:border-red-700 my-4 animate-fade-in" role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-4 flex-grow">
          <h3 className="text-lg font-bold text-red-800 dark:text-red-200">Lesson Generation Failed</h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
            <p>{message}</p>
          </div>
          <div className="mt-4">
            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
              {showRetryButton && onRetry && (
                <button
                  onClick={onRetry}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={onDismiss}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
