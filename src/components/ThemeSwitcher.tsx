
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
    
    // Apply CSS variables for the theme colors
    applyThemeColors(savedTheme);
  }, []);
  
  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem('colorTheme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply CSS variables for the theme colors
    applyThemeColors(theme);
  };
  
  const applyThemeColors = (themeValue: string) => {
    const theme = THEMES.find(t => t.value === themeValue) || THEMES[0];
    
    // Set CSS variables that will be used throughout the app
    document.documentElement.style.setProperty('--theme-primary-light', getGradientColor(theme.primaryLight));
    document.documentElement.style.setProperty('--theme-primary-dark', getGradientColor(theme.primaryDark));
    document.documentElement.style.setProperty('--theme-accent', getTextColor(theme.accent));
    document.documentElement.style.setProperty('--theme-icon', getTextColor(theme.iconColor));
    document.documentElement.style.setProperty('--theme-value', theme.value);
  };
  
  // Helper function to extract color from gradient class
  const getGradientColor = (gradientClass: string): string => {
    if (gradientClass.includes('blue')) return '#3b82f6';
    if (gradientClass.includes('purple')) return '#a855f7';
    if (gradientClass.includes('teal')) return '#14b8a6';
    if (gradientClass.includes('indigo')) return '#6366f1';
    if (gradientClass.includes('pink')) return '#ec4899';
    if (gradientClass.includes('emerald')) return '#10b981';
    return '#3b82f6'; // Default blue
  };
  
  // Helper function to extract color from text class
  const getTextColor = (textClass: string): string => {
    if (textClass.includes('blue')) return isDarkMode ? '#93c5fd' : '#2563eb';
    if (textClass.includes('purple')) return isDarkMode ? '#d8b4fe' : '#9333ea';
    if (textClass.includes('teal')) return isDarkMode ? '#5eead4' : '#0d9488';
    return isDarkMode ? '#93c5fd' : '#2563eb'; // Default blue
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
