
import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Moon, Sun, Palette, Check } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

interface ThemeSwitcherProps {
  isDarkMode: boolean;
  onDarkModeChange: (isDark: boolean) => void;
}

const THEMES = [
  { 
    name: 'Blue', 
    value: 'blue', 
    primaryLight: 'from-blue-500 to-indigo-500', 
    primaryDark: 'from-blue-400 to-indigo-400',
    accent: 'text-blue-600 dark:text-blue-400',
    iconColor: 'text-blue-500 dark:text-blue-400'
  },
  { 
    name: 'Purple', 
    value: 'purple', 
    primaryLight: 'from-purple-500 to-pink-500', 
    primaryDark: 'from-purple-400 to-pink-400',
    accent: 'text-purple-600 dark:text-purple-400',
    iconColor: 'text-purple-500 dark:text-purple-400'
  },
  { 
    name: 'Teal', 
    value: 'teal', 
    primaryLight: 'from-teal-500 to-emerald-500', 
    primaryDark: 'from-teal-400 to-emerald-400',
    accent: 'text-teal-600 dark:text-teal-400',
    iconColor: 'text-teal-500 dark:text-teal-400'
  }
];

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ isDarkMode, onDarkModeChange }) => {
  const [currentTheme, setCurrentTheme] = useState('blue');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('colorTheme') || 'blue';
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);
  
  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem('colorTheme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  };
  
  const selectedTheme = THEMES.find(theme => theme.value === currentTheme) || THEMES[0];
  
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-2 mr-2">
        <Sun className="h-4 w-4 text-amber-500 dark:text-amber-300" />
        <Toggle 
          pressed={isDarkMode} 
          onPressedChange={onDarkModeChange}
          aria-label="Toggle dark mode"
        />
        <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <button 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Change color theme"
          >
            <Palette className={`h-5 w-5 ${selectedTheme.iconColor}`} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          <div className="space-y-1">
            <h4 className="text-sm font-medium mb-2 px-2">Choose a theme</h4>
            {THEMES.map((theme) => (
              <button
                key={theme.value}
                className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                  currentTheme === theme.value 
                    ? `bg-${theme.value}-50 dark:bg-${theme.value}-900/20 ${theme.accent}` 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => handleThemeChange(theme.value)}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 bg-gradient-to-r ${theme.primaryLight} dark:${theme.primaryDark}`} />
                  {theme.name}
                </div>
                {currentTheme === theme.value && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ThemeSwitcher;
