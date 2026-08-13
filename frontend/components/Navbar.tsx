'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  theme?: 'dark' | 'light';
  setTheme?: (theme: 'dark' | 'light') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab = 'analyzer',
  setActiveTab,
  theme = 'dark',
  setTheme
}) => {
  const tabs = [
    { id: 'analyzer', label: 'Analyzer' },
    { id: 'dataset', label: 'Dataset' },
    { id: 'evaluation', label: 'Evaluation' },
    { id: 'methodology', label: 'Methodology' },
    { id: 'limitations', label: 'Limitations' },
  ];

  const toggleTheme = () => {
    if (setTheme) {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <header className={`border-b sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 ${theme === 'dark' ? 'border-slate-800 bg-slate-900/80 text-slate-100' : 'border-slate-200 bg-white/80 text-slate-900'
      }`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            VeritasAI
          </span>
        </motion.div>

        {/* Navigation Tabs with Framer Motion Animation */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab?.(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? 'text-white'
                  : theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavbarTab"
                    className="absolute inset-0 bg-indigo-600 rounded-lg shadow-md shadow-indigo-600/30"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}

          {/* Theme Toggle Button */}
          {setTheme && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`ml-4 p-2 rounded-xl border transition-colors ${theme === 'dark'
                ? 'border-slate-700 bg-slate-800/60 text-amber-400 hover:bg-slate-700'
                : 'border-slate-200 bg-slate-100 text-indigo-600 hover:bg-slate-200'
                }`}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;