
import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number;
  title?: string;
  subtitle?: string;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  duration = 4000,
  title = "Reflectify",
  subtitle
}) => {
  const [visible, setVisible] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);
  const [isExperienced, setIsExperienced] = useState(false);
  
  useEffect(() => {
    // Check user experience level
    checkUserExperience();
    
    // Dev override for quicker testing
    const devDuration = localStorage.getItem('devSplashDuration');
    const actualDuration = devDuration ? parseInt(devDuration) : duration;
    
    const animationTimer = setTimeout(() => {
      setAnimateOut(true);
    }, actualDuration - 800);
    
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, actualDuration);
    
    return () => {
      clearTimeout(animationTimer);
      clearTimeout(timer);
    };
  }, [duration, onComplete]);
  
  const checkUserExperience = () => {
    // Check app usage data from localStorage
    const appStartDate = localStorage.getItem('appStartDate');
    const totalUsage = parseInt(localStorage.getItem('expressInteractionCount') || '0') + 
                      parseInt(localStorage.getItem('chatInteractionCount') || '0') + 
                      parseInt(localStorage.getItem('contentAnalysisCount') || '0') +
                      parseInt(localStorage.getItem('journalVisitCount') || '0');
                      
    if (appStartDate) {
      const daysSinceStart = Math.floor((Date.now() - new Date(appStartDate).getTime()) / (1000 * 60 * 60 * 24));
      setIsExperienced(daysSinceStart > 7 || totalUsage > 20);
    }
  };
  
  // Get the current theme color from localStorage or default to blue
  const currentTheme = localStorage.getItem('colorTheme') || 'blue';
  
  // Determine if dark mode is active
  const isDarkMode = document.documentElement.classList.contains('dark') ||
                    localStorage.getItem('darkMode') === 'true';
  
  // Render appropriate splash screen based on experience level
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Dynamic gradient background with animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--theme-color))] via-[hsl(var(--theme-color))]/70 to-[hsl(var(--theme-color-lighter))]/50 dark:from-[hsl(var(--theme-color))]/70 dark:via-[hsl(var(--theme-color))]/50 dark:to-[hsl(var(--theme-color-lighter))]/30 animate-pulse-subtle"></div>
      
      {isExperienced ? (
        // Advanced splash screen for experienced users
        <div className={`splash-advanced relative z-10 transition-all duration-700 ${animateOut ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
          {/* Advanced animated background elements */}
          <div className="splash-swirl w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="splash-glow w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          
          {/* Central content */}
          <div className="splash-logo relative z-10">
            <span className="text-7xl font-display font-bold bg-gradient-to-r from-white to-white/80 dark:from-white dark:to-white/80 bg-clip-text text-transparent drop-shadow-lg">
              {title}
            </span>
            {subtitle && (
              <p className="text-xl mt-3 text-white/90 dark:text-white/90 text-center font-light">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Advanced particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array(30).fill(0).map((_, i) => (
              <div 
                key={i} 
                className="splash-advanced-particle"
                style={{
                  width: `${Math.random() * 60 + 10}px`,
                  height: `${Math.random() * 60 + 10}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.6 + 0.2,
                }}
              ></div>
            ))}
            
            {/* Pulsating rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border-2 border-white/20 rounded-full animate-[ping_4s_infinite_0.5s]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full animate-[ping_5s_infinite_1s]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full animate-[ping_6s_infinite_1.5s]"></div>
          </div>
        </div>
      ) : (
        // Regular splash screen for new users
        <div className={`splash-content relative z-10 transition-all duration-700 ${animateOut ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
          <div className="splash-logo animate-float relative z-10">
            <span className="text-6xl font-display font-bold bg-gradient-to-r from-white to-white/80 dark:from-white dark:to-white/80 bg-clip-text text-transparent drop-shadow-lg">
              {title}
            </span>
            {subtitle && (
              <p className="text-xl mt-3 text-white/90 dark:text-white/90 text-center font-light">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Standard animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating particles */}
            <div className="splash-particles">
              {Array(20).fill(0).map((_, i) => (
                <div 
                  key={i} 
                  className="particle rounded-full absolute bg-white/30 dark:bg-white/30 blur-sm"
                  style={{
                    '--delay': `${i * 0.2}s`,
                    '--size': `${Math.random() * 60 + 10}px`,
                    '--speed': `${Math.random() * 15 + 5}s`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: 'var(--size)',
                    height: 'var(--size)',
                    animation: 'float var(--speed) infinite ease-in-out var(--delay)',
                    opacity: Math.random() * 0.5 + 0.3,
                  } as React.CSSProperties}
                ></div>
              ))}
            </div>
            
            {/* Central glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/10 dark:bg-white/5 blur-3xl animate-breathe"></div>
            
            {/* Bottom light beam effect */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white/20 to-transparent dark:from-white/10 dark:to-transparent"></div>
            
            {/* Animated rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/20 dark:border-white/10 rounded-full animate-[ping_3s_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 dark:border-white/5 rounded-full animate-[ping_4s_infinite_1s]"></div>
          </div>
        </div>
      )}

      {/* Dev mode indicator */}
      {localStorage.getItem('devMode') === 'true' && (
        <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Dev Mode: {isExperienced ? 'Advanced' : 'Standard'} Splash
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
