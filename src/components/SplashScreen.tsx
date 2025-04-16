
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
    
    // Log this session in feature interaction tracking
    logFeatureInteraction('app_start');
    
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
  
  const checkUserExperience = () => {
    // Check app usage data from localStorage
    const appStartDate = localStorage.getItem('appStartDate');
    
    // Calculate total feature interactions
    const featureInteractions = [
      'chatVisitCount', 
      'rantVisitCount', 
      'mindfulnessVisitCount', 
      'journalVisitCount', 
      'healthVisitCount', 
      'contentVisitCount',
      'analyticsVisitCount'
    ].reduce((total, key) => total + parseInt(localStorage.getItem(key) || '0'), 0);
                      
    if (appStartDate) {
      const daysSinceStart = Math.floor((Date.now() - new Date(appStartDate).getTime()) / (1000 * 60 * 60 * 24));
      setIsExperienced(daysSinceStart > 7 || featureInteractions > 20);
    } else {
      // First visit - set start date
      localStorage.setItem('appStartDate', new Date().toISOString());
    }
  };
  
  const logFeatureInteraction = (feature: string) => {
    const now = new Date();
    const dateStr = format(now, 'yyyy-MM-dd');
    const timeStr = format(now, 'HH:mm:ss');
    
    // Get existing logs
    const interactionLogsStr = localStorage.getItem('featureInteractionLogs');
    let logs: Record<string, any>[] = [];
    
    if (interactionLogsStr) {
      try {
        logs = JSON.parse(interactionLogsStr);
      } catch (e) {
        console.error('Error parsing feature interaction logs', e);
      }
    }
    
    // Add new log
    logs.push({
      feature,
      date: dateStr,
      time: timeStr
    });
    
    // Keep only last 100 interactions to avoid localStorage size issues
    if (logs.length > 100) {
      logs = logs.slice(logs.length - 100);
    }
    
    // Save updated logs
    localStorage.setItem('featureInteractionLogs', JSON.stringify(logs));
  };
  
  const format = (date: Date, formatStr: string) => {
    // Simple date formatting
    if (formatStr === 'yyyy-MM-dd') {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
    if (formatStr === 'HH:mm:ss') {
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    }
    
    // Fallback to the format function from date-fns if available
    return String(date);
  };
  
  if (!visible) return null;
  
  // Determine if dark mode is active
  const isDarkMode = document.documentElement.classList.contains('dark') ||
                    localStorage.getItem('darkMode') === 'true';
  
  // Render appropriate splash screen based on experience level
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Enhanced dynamic gradient background with animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--theme-gradient-start))] via-[hsl(var(--theme-color))]/70 to-[hsl(var(--theme-gradient-end))]/50 dark:from-[hsl(var(--theme-gradient-start))]/70 dark:via-[hsl(var(--theme-color))]/50 dark:to-[hsl(var(--theme-gradient-end))]/30 animate-pulse-subtle"></div>
      
      {isExperienced ? (
        // Enhanced advanced splash screen for experienced users
        <div className={`splash-advanced relative z-10 transition-all duration-700 ${animateOut ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
          {/* Advanced animated background elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-2xl opacity-30 animate-[spin_15s_linear_infinite]" style={{
            background: `conic-gradient(
              from 0deg at 50% 50%,
              hsla(var(--theme-gradient-start), 0.7) 0%,
              hsla(var(--theme-color), 0.6) 25%, 
              hsla(var(--theme-color-lighter), 0.5) 50%,
              hsla(var(--theme-color), 0.4) 75%, 
              hsla(var(--theme-gradient-end), 0.7) 100%
            )`
          }}></div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl animate-[pulsate_6s_ease-in-out_infinite_alternate]" style={{
            background: `radial-gradient(
              circle at center,
              hsla(var(--theme-gradient-start), 0.6) 0%,
              hsla(var(--theme-color), 0.3) 50%,
              transparent 80%
            )`
          }}></div>
          
          {/* Animated geometric shapes */}
          <div className="absolute top-1/3 left-1/4 w-24 h-24 rounded-lg rotate-12 bg-white/10 backdrop-blur-sm border border-white/20 
                         animate-[float_10s_infinite_ease-in-out_1s]"></div>
          <div className="absolute bottom-1/3 right-1/4 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 
                         animate-[float_8s_infinite_ease-in-out_0.5s]"></div>
          <div className="absolute top-1/2 right-1/3 w-20 h-20 rounded-xl rotate-45 bg-white/10 backdrop-blur-sm border border-white/20 
                         animate-[float_12s_infinite_ease-in-out_2s]"></div>
          
          {/* Central content */}
          <div className="splash-logo relative z-10">
            <span className="text-7xl font-display font-bold bg-gradient-to-r from-white to-white/80 dark:from-white dark:to-white/80 bg-clip-text text-transparent drop-shadow-lg">
              {title}
            </span>
            <div className="relative h-1 w-40 mx-auto mt-4 mb-4 overflow-hidden rounded-full">
              <div className="absolute inset-0 bg-white/30"></div>
              <div className="absolute inset-0 bg-white/80 rounded-full animate-[shimmer_2s_infinite_linear]" 
                   style={{width: '50%', transform: 'translateX(-100%)'}}></div>
            </div>
            {subtitle && (
              <p className="text-xl mt-3 text-white/90 dark:text-white/90 text-center font-light">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Enhanced particles with more colors */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array(40).fill(0).map((_, i) => (
              <div 
                key={i} 
                className="absolute rounded-full blur-sm"
                style={{
                  width: `${Math.random() * 60 + 10}px`,
                  height: `${Math.random() * 60 + 10}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  background: i % 3 === 0 
                    ? `hsla(var(--theme-gradient-start), ${Math.random() * 0.4 + 0.2})` 
                    : i % 3 === 1
                      ? `hsla(var(--theme-color), ${Math.random() * 0.4 + 0.2})`
                      : `hsla(var(--theme-gradient-end), ${Math.random() * 0.4 + 0.2})`,
                  animation: `advancedFloat ${Math.random() * 8 + 5}s infinite ease-in-out ${Math.random() * 5}s`,
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
        // Enhanced regular splash screen for new users
        <div className={`splash-content relative z-10 transition-all duration-700 ${animateOut ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
          <div className="splash-logo animate-float relative z-10">
            <span className="text-6xl font-display font-bold bg-gradient-to-r from-white to-white/80 dark:from-white dark:to-white/80 bg-clip-text text-transparent drop-shadow-lg">
              {title}
            </span>
            
            {/* Add animated loading bar */}
            <div className="relative h-1 w-32 mx-auto mt-4 mb-3 overflow-hidden rounded-full">
              <div className="absolute inset-0 bg-white/30"></div>
              <div className="absolute h-full bg-white/80 rounded-full animate-[shimmer_2s_infinite_linear]" 
                   style={{width: '30%', transform: 'translateX(-100%)'}}></div>
            </div>
            
            {subtitle && (
              <p className="text-xl mt-3 text-white/90 dark:text-white/90 text-center font-light">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Enhanced animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating particles with theme colors */}
            <div className="splash-particles">
              {Array(30).fill(0).map((_, i) => (
                <div 
                  key={i} 
                  className="particle rounded-full absolute blur-sm"
                  style={{
                    '--delay': `${i * 0.2}s`,
                    '--size': `${Math.random() * 60 + 10}px`,
                    '--speed': `${Math.random() * 15 + 5}s`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: 'var(--size)',
                    height: 'var(--size)',
                    background: i % 3 === 0 
                      ? `hsla(var(--theme-gradient-start), ${Math.random() * 0.4 + 0.2})` 
                      : i % 3 === 1
                        ? `hsla(var(--theme-color), ${Math.random() * 0.4 + 0.2})`
                        : `hsla(var(--theme-gradient-end), ${Math.random() * 0.4 + 0.2})`,
                    animation: 'float var(--speed) infinite ease-in-out var(--delay)',
                    opacity: Math.random() * 0.5 + 0.3,
                  } as React.CSSProperties}
                ></div>
              ))}
            </div>
            
            {/* Central glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full 
                          bg-gradient-to-r from-[hsla(var(--theme-gradient-start),0.2)] to-[hsla(var(--theme-gradient-end),0.1)] 
                          blur-3xl animate-breathe"></div>
            
            {/* Bottom light beam effect */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white/20 to-transparent"></div>
            
            {/* Animated shapes */}
            <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-lg rotate-12 bg-white/10 backdrop-blur-sm border border-white/20 
                         animate-[float_8s_infinite_ease-in-out_0.5s]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 
                         animate-[float_7s_infinite_ease-in-out_1s]"></div>
            
            {/* Animated rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/20 rounded-full animate-[ping_3s_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full animate-[ping_4s_infinite_1s]"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
