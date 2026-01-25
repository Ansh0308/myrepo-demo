import React from 'react';
import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="glass-card-strong sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🎯</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Habit Tracker
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-300">Build better habits</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg glass-card hover:scale-110 transition-transform"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-6 h-6 text-yellow-400" />
              ) : (
                <Moon className="w-6 h-6 text-indigo-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
