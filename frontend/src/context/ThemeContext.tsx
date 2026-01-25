import React, { createContext, useContext, useState, useEffect } from 'react';
import { preferencesApi } from '../api';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const prefs = await preferencesApi.get();
        setDarkMode(prefs.darkMode);
        if (prefs.darkMode) {
          document.documentElement.classList.add('dark');
        }
      } catch (error) {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
        if (savedDarkMode) {
          document.documentElement.classList.add('dark');
        }
      }
    };
    loadPreferences();
  }, []);

  const toggleDarkMode = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('darkMode', String(newDarkMode));
    
    try {
      await preferencesApi.update({ darkMode: newDarkMode });
    } catch (error) {
      console.error('Failed to save dark mode preference:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
