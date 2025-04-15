
import React, { useState, useEffect, useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Moon, Sun, Palette, Check, Settings, ArrowLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { hslToHex, hexToHsl } from '@/utils/colorUtils';

interface ThemeSwitcherProps {
  isDarkMode: boolean;
  onDarkModeChange: (isDark: boolean) => void;
}

// Pre-defined color themes
const PRESET_THEMES = [
  { 
    name: 'Blue', 
    value: 'blue', 
    primary: { h: 221, s: 83, l: 53 },
    accent: { h: 213, s: 94, l: 95 }
  },
  { 
    name: 'Purple', 
    value: 'purple', 
    primary: { h: 250, s: 83, l: 53 },
    accent: { h: 253, s: 94, l: 95 }
  },
  { 
    name: 'Teal', 
    value: 'teal', 
    primary: { h: 171, s: 83, l: 45 },
    accent: { h: 173, s: 94, l: 95 }
  },
  { 
    name: 'Pink', 
    value: 'pink', 
    primary: { h: 330, s: 80, l: 60 },
    accent: { h: 327, s: 87, l: 95 }
  },
  { 
    name: 'Amber', 
    value: 'amber', 
    primary: { h: 43, s: 96, l: 58 },
    accent: { h: 48, s: 96, l: 95 }
  },
  { 
    name: 'Green', 
    value: 'green', 
    primary: { h: 142, s: 72, l: 50 },
    accent: { h: 141, s: 84, l: 95 }
  }
];

interface HSL {
  h: number;
  s: number;
  l: number;
}

const ColorWheel = ({ 
  color, 
  onChange 
}: { 
  color: HSL; 
  onChange: (hsl: HSL) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [marker, setMarker] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 5;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw color wheel
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 2) * Math.PI / 180;
      const endAngle = (angle + 2) * Math.PI / 180;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      // Set color based on HSL (hue from angle, saturation 100%, lightness 50%)
      ctx.fillStyle = `hsl(${angle}, 100%, 50%)`;
      ctx.fill();
    }
    
    // Draw inner white circle for lightness gradient
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fill();
    
    // Calculate marker position from HSL
    const hueRadians = color.h * Math.PI / 180;
    const saturationRadius = radius * (color.s / 100);
    const x = centerX + Math.cos(hueRadians) * saturationRadius;
    const y = centerY - Math.sin(hueRadians) * saturationRadius;
    
    setMarker({ x, y });
    
    // Draw marker
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
    ctx.fill();
  }, [color]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMouseMove(e);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging && e.type !== 'mousedown') return;
    
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const rect = canvas.getBoundingClientRect();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 5;
    
    // Get mouse position relative to canvas
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate distance from center
    const dx = x - centerX;
    const dy = centerY - y; // Y is inverted
    
    // Calculate angle (hue)
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    if (angle < 0) angle += 360;
    
    // Calculate distance (saturation)
    const distance = Math.sqrt(dx * dx + dy * dy);
    const saturation = Math.min(100, Math.max(0, Math.round(distance / radius * 100)));
    
    // Update color
    onChange({ h: Math.round(angle), s: saturation, l: color.l });
  };
  
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-square rounded-full overflow-hidden"
    >
      <canvas 
        ref={canvasRef}
        width={200}
        height={200}
        className="w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      />
    </div>
  );
};

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ isDarkMode, onDarkModeChange }) => {
  const [currentTheme, setCurrentTheme] = useState('blue');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [primaryColor, setPrimaryColor] = useState<HSL>({ h: 221, s: 83, l: 53 });
  const [accentColor, setAccentColor] = useState<HSL>({ h: 213, s: 94, l: 95 });
  const [iconColor, setIconColor] = useState<HSL>({ h: 221, s: 83, l: 53 });
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('colorTheme') || 'blue';
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Load custom colors from localStorage if they exist
    const customColors = localStorage.getItem('customColors');
    if (customColors) {
      const colors = JSON.parse(customColors);
      setPrimaryColor(colors.primary);
      setAccentColor(colors.accent);
      setIconColor(colors.icon);
    } else {
      // Set default colors based on the current theme
      const theme = PRESET_THEMES.find(t => t.value === savedTheme) || PRESET_THEMES[0];
      setPrimaryColor(theme.primary);
      setAccentColor(theme.accent);
      setIconColor(theme.primary);
    }
    
    // Apply theme colors
    applyThemeColors();
  }, []);
  
  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem('colorTheme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    // Reset custom colors when switching to a preset theme
    const themeObj = PRESET_THEMES.find(t => t.value === theme) || PRESET_THEMES[0];
    setPrimaryColor(themeObj.primary);
    setAccentColor(themeObj.accent);
    setIconColor(themeObj.primary);
    
    localStorage.removeItem('customColors');
    
    // Apply theme colors
    applyThemeColors();
  };
  
  const applyCustomColors = () => {
    // Save custom colors to localStorage
    localStorage.setItem('customColors', JSON.stringify({
      primary: primaryColor,
      accent: accentColor,
      icon: iconColor
    }));
    
    // Apply CSS variables
    const root = document.documentElement;
    
    // Primary color
    root.style.setProperty('--theme-color', `${primaryColor.h} ${primaryColor.s}% ${primaryColor.l}%`);
    root.style.setProperty('--theme-color-darker', `${primaryColor.h} ${primaryColor.s}% ${primaryColor.l - 10}%`);
    
    // Accent color
    root.style.setProperty('--theme-color-lighter', `${accentColor.h} ${accentColor.s}% ${accentColor.l}%`);
    
    // Icon and text color
    root.style.setProperty('--theme-text', `${iconColor.h} ${iconColor.s}% ${iconColor.l}%`);
    root.style.setProperty('--theme-icon', `${iconColor.h} ${iconColor.s}% ${iconColor.l}%`);
    
    // Apply to primary CSS variables too
    root.style.setProperty('--primary', `${primaryColor.h} ${primaryColor.s}% ${primaryColor.l}%`);
    root.style.setProperty('--accent', `${accentColor.h} ${accentColor.s}% ${accentColor.l}%`);
    
    // Set custom as theme
    document.documentElement.setAttribute('data-theme', 'custom');
    localStorage.setItem('colorTheme', 'custom');
    setCurrentTheme('custom');
  };
  
  const applyThemeColors = () => {
    const theme = currentTheme;
    if (theme === 'custom') {
      applyCustomColors();
      return;
    }
    
    const themeObj = PRESET_THEMES.find(t => t.value === theme) || PRESET_THEMES[0];
    const primary = themeObj.primary;
    const accent = themeObj.accent;
    
    // Apply CSS variables
    document.documentElement.style.setProperty('--theme-color', `${primary.h} ${primary.s}% ${primary.l}%`);
    document.documentElement.style.setProperty('--theme-color-darker', `${primary.h} ${primary.s}% ${primary.l - 10}%`);
    document.documentElement.style.setProperty('--theme-color-lighter', `${accent.h} ${accent.s}% ${accent.l}%`);
    document.documentElement.style.setProperty('--theme-text', `${primary.h} ${primary.s}% ${primary.l}%`);
    document.documentElement.style.setProperty('--theme-icon', `${primary.h} ${primary.s}% ${primary.l}%`);
    
    // Reset custom theme values
    document.documentElement.style.setProperty('--primary', `${primary.h} ${primary.s}% ${primary.l}%`);
    document.documentElement.style.setProperty('--accent', `${accent.h} ${accent.s}% ${accent.l}%`);
  };
  
  const handlePrimaryColorChange = (hsl: HSL) => {
    setPrimaryColor(hsl);
    setIconColor(hsl); // Update icon color to match primary for consistency
  };
  
  const handleLightnessChange = (value: number[], type: 'primary' | 'accent' | 'icon') => {
    const newValue = value[0];
    if (type === 'primary') {
      setPrimaryColor(prev => ({ ...prev, l: newValue }));
    } else if (type === 'accent') {
      setAccentColor(prev => ({ ...prev, l: newValue }));
    } else if (type === 'icon') {
      setIconColor(prev => ({ ...prev, l: newValue }));
    }
  };
  
  const selectedTheme = PRESET_THEMES.find(theme => theme.value === currentTheme) || PRESET_THEMES[0];
  
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
          {showAdvanced ? (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setShowAdvanced(false)}
                  className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to themes
                </button>
                <h3 className="text-sm font-medium">Custom Theme</h3>
              </div>
              
              <Tabs defaultValue="primary">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="primary" className="flex-1">Primary</TabsTrigger>
                  <TabsTrigger value="accent" className="flex-1">Accent</TabsTrigger>
                  <TabsTrigger value="icons" className="flex-1">Icons</TabsTrigger>
                </TabsList>
                
                <TabsContent value="primary" className="space-y-4">
                  <div className="space-y-2">
                    <ColorWheel color={primaryColor} onChange={handlePrimaryColorChange} />
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Lightness</label>
                      <Slider 
                        value={[primaryColor.l]} 
                        min={20} 
                        max={80} 
                        step={1} 
                        onValueChange={(v) => handleLightnessChange(v, 'primary')} 
                      />
                    </div>
                    <div className="h-12 rounded-md" style={{ 
                      background: `linear-gradient(to right, hsl(${primaryColor.h}, ${primaryColor.s}%, ${primaryColor.l - 15}%), hsl(${primaryColor.h}, ${primaryColor.s}%, ${primaryColor.l}%))` 
                    }}></div>
                  </div>
                </TabsContent>
                
                <TabsContent value="accent" className="space-y-4">
                  <div className="space-y-2">
                    <ColorWheel color={accentColor} onChange={setAccentColor} />
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Lightness</label>
                      <Slider 
                        value={[accentColor.l]} 
                        min={20} 
                        max={95} 
                        step={1} 
                        onValueChange={(v) => handleLightnessChange(v, 'accent')} 
                      />
                    </div>
                    <div className="h-12 rounded-md" style={{ 
                      background: `hsl(${accentColor.h}, ${accentColor.s}%, ${accentColor.l}%)` 
                    }}></div>
                  </div>
                </TabsContent>
                
                <TabsContent value="icons" className="space-y-4">
                  <div className="space-y-2">
                    <ColorWheel color={iconColor} onChange={setIconColor} />
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Lightness</label>
                      <Slider 
                        value={[iconColor.l]} 
                        min={20} 
                        max={80} 
                        step={1} 
                        onValueChange={(v) => handleLightnessChange(v, 'icon')} 
                      />
                    </div>
                    <div className="flex justify-center h-12 items-center">
                      <Palette className="h-8 w-8" style={{ 
                        color: `hsl(${iconColor.h}, ${iconColor.s}%, ${iconColor.l}%)`
                      }} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <button
                onClick={applyCustomColors}
                className="reflectify-button w-full flex items-center justify-center"
              >
                Apply Custom Theme
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex justify-between items-center p-4 border-b">
                <h4 className="text-sm font-medium">Choose a theme</h4>
                <button
                  onClick={() => setShowAdvanced(true)}
                  className="flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Custom
                </button>
              </div>
              <div className="p-2 grid grid-cols-2 gap-2">
                {PRESET_THEMES.map((theme) => (
                  <button
                    key={theme.value}
                    className={`flex flex-col items-center rounded-md p-3 transition-colors ${
                      currentTheme === theme.value 
                        ? `bg-${theme.value}-50 dark:bg-${theme.value}-900/20 text-[hsl(${theme.primary.h},${theme.primary.s}%,${theme.primary.l}%)]` 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => handleThemeChange(theme.value)}
                  >
                    <div className="w-full h-12 rounded-md mb-2" style={{ 
                      background: `linear-gradient(to right, hsl(${theme.primary.h}, ${theme.primary.s}%, ${theme.primary.l}%), hsl(${theme.primary.h}, ${theme.primary.s}%, ${theme.primary.l - 15}%))` 
                    }}></div>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm">{theme.name}</span>
                      {currentTheme === theme.value && <Check className="h-4 w-4" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ThemeSwitcher;
