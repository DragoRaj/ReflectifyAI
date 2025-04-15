
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
  
  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setAnimateOut(true);
    }, duration - 800);
    
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, duration);
    
    return () => {
      clearTimeout(animationTimer);
      clearTimeout(timer);
    };
  }, [duration, onComplete]);
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Dynamic gradient background with animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--theme-color))] via-[hsl(var(--theme-color))]/70 to-[hsl(var(--theme-color-lighter))]/50 dark:from-[hsl(var(--theme-color))]/70 dark:via-[hsl(var(--theme-color))]/50 dark:to-[hsl(var(--theme-color-lighter))]/30 animate-pulse-subtle"></div>
      
      {/* Central content with enhanced animation */}
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
        
        {/* Enhanced animated background elements */}
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
    </div>
  );
};

export default SplashScreen;
