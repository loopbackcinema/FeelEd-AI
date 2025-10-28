

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { Tooltip } from './Tooltip';

interface HeaderProps {
  onToggleChat: () => void;
  onToggleHistory: () => void;
  onUpgrade: () => void;
  onNavigateHome: () => void;
  onNavigateToProfile: () => void;
  onLoginClick: () => void;
  remainingLessons?: number | null;
}

const AppLogo = () => (
  <img 
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAbFBMVEUAd7f///8AdLYAcbQAb7MAcrUAcLMAc7UAbLIAbrMAa7AAeLgAdrfw9fvu9Pvx9vsAeLfs8/n2+v3O4O/d6/TQ4fDE2+y71eqwz+eoxt6mxd3R4/Hj7vXV5fOgyNuaweCexuKFxN+91umVvN3r8/mHw+BqR5yYAAAEe0lEQVR4nO2dbXuiMBSGMwQSqIACKog3qLXW6/9/vAkICJAD4yQm89z7rY+2nCQhEw7DJgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABs8fT29k7p6e3t7W2T/w0xL9f3P9u2/Y2Pj7dt+5sfHx9lWX5kWR7b9g/pA7mP6/u/lGV5V5blL0h/xP0wL9f3Py/L8qssy3+S/gj7Wb7/3v+lLD/o9vZWl/s7/T2e63s/S+l/6e5fD04Y/rS1/P7w8b+Tf9f3/r5nC4Ua+s/z+H2dD0/vHy/sDwn9rS/z/o+pC+Ff6n2df0uFf/X+Tr/72r4i1P0kI/U+d3s7/ZzT5+P3d/p/V9+l6l6/99Dq/X5z6+P3A8u2/Q3+JzT5/E9+S6mKvwM15t8F6v+Amu+J3/+DmvP893DqBwG1L3DqB4G1u4dTPwjY+x+o+Z3+/eX/Wj+k9X0Wb7X2Lw8P/9T/Bfrv+t6PUsZ59e3t7Qn+L9L22/X9b2VZdlyW5Q9If8D9MC/X9z8ny/KxLMt/kv4I+xn+f57//yzLD/Jsvyr9Ae0v0/T+nLK8j+VZXm+0hfZ/g/tb1O1f8jy77Isv6n0Rbb/B9r3p/7/keW/ZFn+SaVfZA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqH6BfS3p/9A8b+cAAAAASUVORK5CYII=" 
    alt="FeelEd AI Logo" 
    className="h-10 w-10"
  />
);


export const Header: React.FC<HeaderProps> = ({ 
  onToggleChat, 
  onToggleHistory, 
  onUpgrade,
  onNavigateHome,
  onNavigateToProfile,
  onLoginClick,
  remainingLessons
}) => {
  const { user, userRole, logout } = useAuth();
  const { theme, setTheme } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        <button onClick={onNavigateHome} className="flex items-center space-x-3" aria-label="Go to homepage">
           <AppLogo />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            FeelEd <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">AI</span>
          </h1>
        </button>
        <div className='flex items-center space-x-2 md:space-x-4'>
            {user ? (
                 <button
                    onClick={onToggleHistory}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    aria-label="Toggle Lesson History"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                     <span className='hidden sm:inline'>History</span>
                 </button>
            ) : <p className="hidden md:block text-sm text-gray-500 dark:text-gray-400">Emotional Generative AI for Education</p>}
             
             <button
                onClick={onToggleChat}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                aria-label="Toggle AI Chat"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.839 8.839 0 01-4.082-.982L2 17l1.437-3.437A7.953 7.953 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.834 11.666a5.987 5.987 0 002.046 2.046L4.063 15.15 4.834 11.666zm10.332-4.832a5.987 5.987 0 00-2.046-2.046L15.937 4.85l-.771 3.434z" clipRule="evenodd" />
                </svg>
                 <span className='hidden sm:inline'>AI Chat</span>
             </button>

            <button
                onClick={toggleTheme}
                className="flex items-center justify-center h-10 w-10 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
            {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
            )}
            </button>

            {user ? (
              <div className="relative" ref={menuRef}>
                <button onClick={() => setIsMenuOpen(prev => !prev)} className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User profile" className="h-full w-full rounded-full" />
                  ) : (
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">{userRole?.[0]}</span>
                  )}
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-semibold truncate">{user.displayName || 'User'}</p>
                      <p className="text-xs text-gray-500">{userRole} Account</p>
                    </div>
                    <button onClick={() => { onNavigateToProfile(); setIsMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">My Profile</button>
                    <button onClick={() => { onUpgrade(); setIsMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Upgrade Plan</button>
                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {typeof remainingLessons === 'number' && (
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 hidden sm:block bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                        {remainingLessons} free lessons left
                    </span>
                )}
                <button
                    onClick={onLoginClick}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    aria-label="Login or Sign up"
                 >
                    <span>Login</span>
                 </button>
              </div>
            )}
        </div>
      </div>
    </header>
  );
};