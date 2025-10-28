import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Theme } from '../types';

const THEME_STORAGE_KEY = 'feeled_theme';
const LANGUAGE_STORAGE_KEY = 'feeled_language';

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: string;
  setLanguage: (language: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
        if (storedTheme && ['light', 'dark'].includes(storedTheme)) {
            return storedTheme;
        }
        // Set default based on system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (error) {
        console.warn('Could not access localStorage to get theme. Defaulting to light.', error);
        return 'light';
    }
  });
  
  const [language, setLanguage] = useState<string>(() => {
    try {
        return localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'English';
    } catch (error) {
        console.warn('Could not access localStorage to get language. Defaulting to English.', error);
        return 'English';
    }
  });

  useEffect(() => {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
    } catch (error) {
        console.warn('Could not save theme to localStorage.', error);
    }
  }, [theme]);

  useEffect(() => {
    try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
        console.warn('Could not save language to localStorage.', error);
    }
  }, [language]);

  const value = { theme, setTheme, language, setLanguage };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
