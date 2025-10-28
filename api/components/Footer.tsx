
import React from 'react';

interface FooterProps {
  onNavigateToAbout: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToAbout }) => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8">
      <div className="container mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
        <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} FeelEd AI. All Rights Reserved.</p>
        <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-2 sm:space-y-0">
          <button 
            onClick={onNavigateToAbout}
            className="hover:text-gray-800 dark:hover:text-gray-200 hover:underline"
          >
            About Us
          </button>
          <div className="flex items-center flex-wrap justify-center space-x-3">
            <span className="font-medium">Contact:</span>
            <a href="mailto:feeledai@gmail.com" className="hover:text-gray-800 dark:hover:text-gray-200 hover:underline">
              feeledai@gmail.com
            </a>
            <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">|</span>
            <a href="tel:+919092450286" className="hover:text-gray-800 dark:hover:text-gray-200 hover:underline">
              +91 9092450286
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
