
import React, { useState, useEffect } from 'react';

interface FeatureSplashScreenProps {
  onComplete?: () => void;
  duration?: number;
  featureName: string;
  featureDescription?: string;
  icon?: React.ReactNode;
}

const FeatureSplashScreen: React.FC<FeatureSplashScreenProps> = ({
  onComplete,
  duration = 2000,
  featureName,
  featureDescription,
  icon
}) => {
  const [visible, setVisible] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);
  const [isExperienced, setIsExperienced] = useState(false);
  
  useEffect(() => {
    // Check user experience level
    checkUserExperience();
    
    // Log this feature visit
    logFeatureInteraction(featureName.toLowerCase());
    
    const animationTimer = setTimeout(() => {
      setAnimateOut(true);
    }, duration - 500);
    
    const visibilityTimer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, duration);
    
    return () => {
      clearTimeout(animationTimer);
      clearTimeout(visibilityTimer);
    };
  }, [duration, onComplete, featureName]);
  
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
      
      // If they're experienced users, shorten the duration
      if ((daysSinceStart > 14 || featureInteractions > 50) && onComplete) {
        setTimeout(onComplete, Math.min(duration, 1200));
      }
    }
  };
  
  const logFeatureInteraction = (feature: string) => {
    // Increment feature visit count
    const featureKey = `${feature.toLowerCase().replace(/\s+/g, '')}VisitCount`;
    const currentCount = parseInt(localStorage.getItem(featureKey) || '0');
    localStorage.setItem(featureKey, (currentCount + 1).toString());
    
    // Log interaction details for analytics
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
  
  // Simple date formatting
  const format = (date: Date, formatStr: string) => {
    // Simple date formatting
    if (formatStr === 'yyyy-MM-dd') {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
    if (formatStr === 'HH:mm:ss') {
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    }
    
    // Fallback to date string
    return String(date);
  };
  
  if (!visible) return null;
  
  return (
    <div className={`fixed inset-0 z-40 flex items-center justify-center transition-all duration-500 ${animateOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Enhanced dynamic background gradient that respects theme color and dark/light mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--theme-gradient-start))/60] via-[hsl(var(--theme-color))/30] to-[hsl(var(--theme-gradient-end))/10] backdrop-blur-xl"></div>
      
      {isExperienced ? (
        // Enhanced advanced feature splash for experienced users
        <div className={`transform transition-all duration-500 relative z-10 ${animateOut ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
          <div className="flex flex-col items-center text-center p-8">
            {/* Enhanced icon animation with orbit particles */}
            {icon && (
              <div className="relative mb-6">
                {/* Dynamic glow effect based on theme */}
                <div className="absolute inset-0 rounded-full blur-2xl bg-[hsl(var(--theme-color))/20] animate-pulse"></div>
                
                {/* Icon with animated ring */}
                <div className="text-5xl relative z-10 text-white drop-shadow-lg animate-float p-4">
                  <div className="absolute -inset-3 rounded-full border border-white/20 animate-[spin_15s_linear_infinite]"></div>
                  <div className="absolute -inset-6 rounded-full border border-white/10 animate-[spin_25s_linear_infinite_reverse]"></div>
                  
                  {/* Orbit particles */}
                  {Array(5).fill(0).map((_, i) => (
                    <div 
                      key={i}
                      className="absolute rounded-full bg-white/40 w-2 h-2"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${i * 72}deg) translateX(50px) rotate(${i * 72 * -1}deg)`,
                        animation: `orbit ${5 + i}s linear infinite`
                      }}
                    ></div>
                  ))}
                  
                  {icon}
                </div>
              </div>
            )}
            
            <h2 className="text-4xl font-display font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent drop-shadow-md">
              {featureName}
            </h2>
            
            {featureDescription && (
              <p className="text-white/90 max-w-md text-lg">
                {featureDescription}
              </p>
            )}
            
            {/* Enhanced particles with theme colors */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              {Array(30).fill(0).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute rounded-full blur-md"
                  style={{
                    width: `${Math.random() * 30 + 5}px`,
                    height: `${Math.random() * 30 + 5}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    background: i % 3 === 0 
                      ? `hsla(var(--theme-gradient-start), ${Math.random() * 0.3 + 0.1})` 
                      : i % 3 === 1
                        ? `hsla(var(--theme-color), ${Math.random() * 0.3 + 0.1})`
                        : `hsla(var(--theme-gradient-end), ${Math.random() * 0.3 + 0.1})`,
                    animation: `advancedFloat ${Math.random() * 8 + 5}s infinite ease-in-out ${i * 0.2}s`,
                  }}
                ></div>
              ))}
              
              {/* Animated geometric shapes */}
              <div className="absolute top-1/4 left-1/5 w-16 h-16 rounded-lg rotate-12 bg-white/10 backdrop-blur-sm border border-white/20 
                           animate-[float_10s_infinite_ease-in-out_0.3s]"></div>
              <div className="absolute bottom-1/4 right-1/5 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 
                           animate-[float_8s_infinite_ease-in-out_0.7s]"></div>
              
              {/* Pulsating center glow */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-3xl animate-pulsate"
                style={{ background: `radial-gradient(circle, hsla(var(--theme-gradient-start), 0.3) 0%, hsla(var(--theme-color), 0.2) 50%, transparent 70%)` }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        // Enhanced feature splash for newer users
        <div className={`transform transition-all duration-500 relative z-10 ${animateOut ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
          <div className="flex flex-col items-center text-center p-8">
            {icon && (
              <div className="relative mb-4">
                {/* Add glow behind the icon */}
                <div className="absolute inset-0 rounded-full blur-xl bg-[hsl(var(--theme-color))/30] animate-pulse"></div>
                <div className="text-5xl relative z-10 text-white animate-float drop-shadow-lg p-4">
                  {icon}
                </div>
              </div>
            )}
            <h2 className="text-3xl font-display font-bold text-white mb-2 drop-shadow-md">
              {featureName}
            </h2>
            
            {/* Add a decorative line under the title */}
            <div className="w-16 h-1 bg-white/50 rounded-full mb-4"></div>
            
            {featureDescription && (
              <p className="text-white/90 max-w-md">
                {featureDescription}
              </p>
            )}
            
            {/* Animated rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[200px] h-[200px] border border-white/20 rounded-full animate-[ping_2s_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[250px] h-[250px] border border-white/10 rounded-full animate-[ping_3s_infinite_0.5s]"></div>
          </div>
          
          {/* Enhanced particles with theme colors */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array(20).fill(0).map((_, i) => (
              <div 
                key={i} 
                className="absolute rounded-full blur-sm"
                style={{
                  width: `${Math.random() * 20 + 5}px`,
                  height: `${Math.random() * 20 + 5}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  background: i % 3 === 0 
                    ? `hsla(var(--theme-gradient-start), ${Math.random() * 0.3 + 0.1})` 
                    : i % 3 === 1
                      ? `hsla(var(--theme-color), ${Math.random() * 0.3 + 0.1})`
                      : `hsla(var(--theme-gradient-end), ${Math.random() * 0.3 + 0.1})`,
                  animation: `float ${Math.random() * 8 + 5}s infinite ease-in-out ${i * 0.3}s`,
                }}
              ></div>
            ))}
            
            {/* Add a few geometric shapes */}
            <div className="absolute top-1/4 right-1/4 w-10 h-10 rounded-lg rotate-12 bg-white/10 backdrop-blur-sm border border-white/20 
                         animate-[float_7s_infinite_ease-in-out_0.2s]"></div>
            <div className="absolute bottom-1/4 left-1/4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 
                         animate-[float_9s_infinite_ease-in-out_1s]"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureSplashScreen;
