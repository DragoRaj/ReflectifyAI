
import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Moon, Sun, Palette, Check, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { hexToHsl, hslToHex } from '@/utils/colorUtils';

interface ThemeSwitcherProps {
  isDarkMode: boolean;
  onDarkModeChange: (isDark: boolean) => void;
}

// Expanded pre-defined color themes
const PRESET_THEMES = [
  { 
    name: 'Blue', 
    value: 'blue', 
    primary: { h: 221, s: 83, l: 53 },
  },
  { 
    name: 'Purple', 
    value: 'purple', 
    primary: { h: 250, s: 83, l: 53 },
  },
  { 
    name: 'Teal', 
    value: 'teal', 
    primary: { h: 171, s: 83, l: 45 },
  },
  { 
    name: 'Pink', 
    value: 'pink', 
    primary: { h: 330, s: 80, l: 60 },
  },
  { 
    name: 'Amber', 
    value: 'amber', 
    primary: { h: 43, s: 96, l: 58 },
  },
  { 
    name: 'Green', 
    value: 'green', 
    primary: { h: 142, s: 72, l: 50 },
  },
  // New color themes
  { 
    name: 'Crimson', 
    value: 'crimson', 
    primary: { h: 348, s: 83, l: 47 },
  },
  { 
    name: 'Indigo', 
    value: 'indigo', 
    primary: { h: 263, s: 70, l: 50 },
  },
  { 
    name: 'Emerald', 
    value: 'emerald', 
    primary: { h: 152, s: 69, l: 40 },
  },
  { 
    name: 'Violet', 
    value: 'violet', 
    primary: { h: 270, s: 76, l: 60 },
  },
  { 
    name: 'Coral', 
    value: 'coral', 
    primary: { h: 16, s: 85, l: 64 },
  },
  { 
    name: 'Cyan', 
    value: 'cyan', 
    primary: { h: 187, s: 72, l: 47 },
  }
];

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ isDarkMode, onDarkModeChange }) => {
  const [currentTheme, setCurrentTheme] = useState('blue');
  
  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('colorTheme') || 'blue';
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Apply theme colors
    applyThemeColors(savedTheme);
  }, []);
  
  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem('colorTheme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply theme colors
    applyThemeColors(theme);
  };
  
  const applyThemeColors = (theme: string) => {
    const themeObj = PRESET_THEMES.find(t => t.value === theme) || PRESET_THEMES[0];
    const primary = themeObj.primary;
    
    // Apply only text and icon colors, not background
    document.documentElement.style.setProperty('--theme-text', `${primary.h} ${primary.s}% ${primary.l}%`);
    document.documentElement.style.setProperty('--theme-icon', `${primary.h} ${primary.s}% ${primary.l}%`);
    
    // Set primary color for buttons and accents
    document.documentElement.style.setProperty('--theme-color', `${primary.h} ${primary.s}% ${primary.l}%`);
    document.documentElement.style.setProperty('--theme-color-darker', `${primary.h} ${primary.s}% ${Math.max(primary.l - 10, 5)}%`);
  };
  
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Sun className="h-5 w-5 text-amber-500 dark:text-amber-400 transition-transform" 
          style={{ opacity: isDarkMode ? 0.5 : 1, transform: isDarkMode ? 'scale(0.9)' : 'scale(1)' }}
        />
        <Switch 
          checked={isDarkMode} 
          onCheckedChange={onDarkModeChange}
          className="theme-switch data-[state=checked]:bg-slate-700 data-[state=unchecked]:bg-amber-400"
        />
        <Moon className="h-5 w-5 text-slate-800 dark:text-slate-200 transition-transform" 
          style={{ opacity: isDarkMode ? 1 : 0.5, transform: isDarkMode ? 'scale(1)' : 'scale(0.9)' }}
        />
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <button 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            aria-label="Change color theme"
          >
            <Palette className={`h-5 w-5 text-[hsl(var(--theme-icon))]`} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[hsl(var(--theme-color))] to-[hsl(var(--theme-color-darker))]"></span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 shadow-xl animate-in zoom-in-90">
          <div className="space-y-1">
            <div className="flex justify-between items-center p-4 border-b">
              <h4 className="text-sm font-medium">Choose a theme color</h4>
            </div>
            <div className="p-2 grid grid-cols-3 gap-2">
              {PRESET_THEMES.map((theme) => {
                // Generate consistent color preview
                const themeColor = hslToHex(theme.primary.h, theme.primary.s, theme.primary.l);
                const darkerColor = hslToHex(theme.primary.h, theme.primary.s, Math.max(theme.primary.l - 15, 5));
                
                return (
                  <button
                    key={theme.value}
                    className={`flex flex-col items-center rounded-md p-2.5 transition-colors ${
                      currentTheme === theme.value 
                        ? 'bg-gray-100 dark:bg-gray-800 text-[hsl(var(--theme-color))]' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => handleThemeChange(theme.value)}
                  >
                    <div className="w-full h-10 rounded-md mb-2" style={{ 
                      background: `linear-gradient(to right, ${themeColor}, ${darkerColor})` 
                    }}></div>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-medium">{theme.name}</span>
                      {currentTheme === theme.value && <Check className="h-4 w-4" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="p-2 text-xs text-muted-foreground border-t">
              <p>Theme colors only affect text and icons. Background colors are controlled by light/dark mode.</p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ThemeSwitcher;
