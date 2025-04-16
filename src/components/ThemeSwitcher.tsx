
import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Moon, Sun, Palette, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { hexToHsl, hslToHex } from '@/utils/colorUtils';

interface ThemeSwitcherProps {
  isDarkMode: boolean;
  onDarkModeChange: (isDark: boolean) => void;
}

// Expanded pre-defined color themes with gradients
const PRESET_THEMES = [
  { 
    name: 'Blue', 
    value: 'blue', 
    primary: { h: 221, s: 83, l: 53 },
    gradient: {
      start: { h: 217, s: 91, l: 60 },
      end: { h: 224, s: 76, l: 48 }
    }
  },
  { 
    name: 'Purple', 
    value: 'purple', 
    primary: { h: 250, s: 83, l: 53 },
    gradient: {
      start: { h: 245, s: 85, l: 65 },
      end: { h: 255, s: 80, l: 45 }
    }
  },
  { 
    name: 'Teal', 
    value: 'teal', 
    primary: { h: 171, s: 83, l: 45 },
    gradient: {
      start: { h: 166, s: 85, l: 55 },
      end: { h: 176, s: 80, l: 40 }
    }
  },
  { 
    name: 'Pink', 
    value: 'pink', 
    primary: { h: 330, s: 80, l: 60 },
    gradient: {
      start: { h: 325, s: 85, l: 70 },
      end: { h: 335, s: 75, l: 50 }
    }
  },
  { 
    name: 'Amber', 
    value: 'amber', 
    primary: { h: 43, s: 96, l: 58 },
    gradient: {
      start: { h: 38, s: 95, l: 65 },
      end: { h: 48, s: 97, l: 51 }
    }
  },
  { 
    name: 'Green', 
    value: 'green', 
    primary: { h: 142, s: 72, l: 50 },
    gradient: {
      start: { h: 137, s: 75, l: 60 },
      end: { h: 147, s: 68, l: 42 }
    }
  },
  { 
    name: 'Crimson', 
    value: 'crimson', 
    primary: { h: 348, s: 83, l: 47 },
    gradient: {
      start: { h: 343, s: 85, l: 57 },
      end: { h: 353, s: 80, l: 40 }
    }
  },
  { 
    name: 'Indigo', 
    value: 'indigo', 
    primary: { h: 263, s: 70, l: 50 },
    gradient: {
      start: { h: 258, s: 75, l: 60 },
      end: { h: 268, s: 65, l: 40 }
    }
  },
  { 
    name: 'Emerald', 
    value: 'emerald', 
    primary: { h: 152, s: 69, l: 40 },
    gradient: {
      start: { h: 147, s: 72, l: 50 },
      end: { h: 157, s: 65, l: 35 }
    }
  },
  { 
    name: 'Violet', 
    value: 'violet', 
    primary: { h: 270, s: 76, l: 60 },
    gradient: {
      start: { h: 265, s: 80, l: 70 },
      end: { h: 275, s: 72, l: 50 }
    }
  },
  { 
    name: 'Coral', 
    value: 'coral', 
    primary: { h: 16, s: 85, l: 64 },
    gradient: {
      start: { h: 11, s: 90, l: 70 },
      end: { h: 21, s: 80, l: 58 }
    }
  },
  { 
    name: 'Cyan', 
    value: 'cyan', 
    primary: { h: 187, s: 72, l: 47 },
    gradient: {
      start: { h: 182, s: 75, l: 57 },
      end: { h: 192, s: 68, l: 40 }
    }
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
    const gradient = themeObj.gradient;
    
    // Apply text and icon colors
    document.documentElement.style.setProperty('--theme-text', `${primary.h} ${primary.s}% ${primary.l}%`);
    document.documentElement.style.setProperty('--theme-icon', `${primary.h} ${primary.s}% ${primary.l}%`);
    
    // Set primary color for buttons and accents
    document.documentElement.style.setProperty('--theme-color', `${primary.h} ${primary.s}% ${primary.l}%`);
    document.documentElement.style.setProperty('--theme-color-darker', `${primary.h} ${primary.s}% ${Math.max(primary.l - 10, 5)}%`);
    document.documentElement.style.setProperty('--theme-color-lighter', `${primary.h} ${primary.s}% ${Math.min(primary.l + 10, 95)}%`);
    
    // Set gradient colors
    document.documentElement.style.setProperty('--theme-gradient-start', `${gradient.start.h} ${gradient.start.s}% ${gradient.start.l}%`);
    document.documentElement.style.setProperty('--theme-gradient-end', `${gradient.end.h} ${gradient.end.s}% ${gradient.end.l}%`);
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
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[hsl(var(--theme-gradient-start))] to-[hsl(var(--theme-gradient-end))]"></span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 shadow-xl animate-in zoom-in-90">
          <div className="space-y-1">
            <div className="flex justify-between items-center p-4 border-b">
              <h4 className="text-sm font-medium">Choose a theme color</h4>
            </div>
            <div className="p-2 grid grid-cols-3 gap-2">
              {PRESET_THEMES.map((theme) => {
                // Get theme colors for preview
                const themeColor = hslToHex(theme.primary.h, theme.primary.s, theme.primary.l);
                const startColor = hslToHex(theme.gradient.start.h, theme.gradient.start.s, theme.gradient.start.l);
                const endColor = hslToHex(theme.gradient.end.h, theme.gradient.end.s, theme.gradient.end.l);
                
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
                    <div className="w-full h-12 rounded-md mb-2 overflow-hidden">
                      <div className="w-full h-full relative" style={{ 
                        background: `linear-gradient(135deg, ${startColor}, ${endColor})`,
                        boxShadow: currentTheme === theme.value ? `0 0 12px ${themeColor}40` : 'none'
                      }}>
                        {/* Add a shine effect */}
                        <div className="absolute inset-0 opacity-30" 
                          style={{ 
                            backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)'
                          }} 
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-medium">{theme.name}</span>
                      {currentTheme === theme.value && <Check className="h-4 w-4" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ThemeSwitcher;
