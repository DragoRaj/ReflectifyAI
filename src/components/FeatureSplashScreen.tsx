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
    
    // Dev override for quicker testing
    const devDuration = localStorage.getItem('devFeatureSplashDuration');
    const actualDuration = devDuration ? parseInt(devDuration) : duration;
    
    const animationTimer = setTimeout(() => {
      setAnimateOut(true);
    }, actualDuration - 500);
    
    const visibilityTimer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, actualDuration);
    
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
  
  // Determine if dark mode is active
  const isDarkMode = document.documentElement.classList.contains('dark') || 
                    localStorage.getItem('darkMode') === 'true';
  
  return (
    <div className={`fixed inset-0 z-40 flex items-center justify-center backdrop-blur-lg transition-all duration-500 ${animateOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Background gradient that respects dark/light mode and theme color */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--theme-color))/50] via-transparent to-[hsl(var(--theme-color))/30] dark:from-[hsl(var(--theme-color))/30] dark:to-[hsl(var(--theme-color))/10]"></div>
      
      {isExperienced ? (
        // Advanced feature splash for experienced users
        <div className={`transform transition-all duration-500 relative z-10 ${animateOut ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
          <div className="flex flex-col items-center text-center p-6">
            {/* Advanced icon animation */}
            {icon && (
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="text-5xl relative z-10 text-white drop-shadow-lg animate-float">
                  {icon}
                </div>
                {/* Rotating ring around icon */}
                <div className="absolute -inset-4 border border-white/20 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
              </div>
            )}
            
            <h2 className="text-3xl font-display font-bold text-white mb-2 drop-shadow-md bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {featureName}
            </h2>
            
            {featureDescription && (
              <p className="text-white/90 max-w-md">
                {featureDescription}
              </p>
            )}
            
            {/* Enhanced particles for experienced users */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              {Array(15).fill(0).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute bg-white/20 rounded-full blur-sm"
                  style={{
                    width: `${Math.random() * 20 + 5}px`,
                    height: `${Math.random() * 20 + 5}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `advancedFloat ${Math.random() * 8 + 5}s infinite ease-in-out ${i * 0.2}s`,
                  }}
                ></div>
              ))}
              
              {/* Pulsating center glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-white/5 blur-3xl animate-pulsate"></div>
            </div>
          </div>
        </div>
      ) : (
        // Standard feature splash for newer users
        <div className={`transform transition-all duration-500 relative z-10 ${animateOut ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
          <div className="flex flex-col items-center text-center p-8">
            {icon && (
              <div className="text-5xl mb-4 text-white animate-float drop-shadow-lg">
                {icon}
              </div>
            )}
            <h2 className="text-3xl font-display font-bold text-white mb-2 drop-shadow-md">
              {featureName}
            </h2>
            {featureDescription && (
              <p className="text-white/90 max-w-md">
                {featureDescription}
              </p>
            )}
            
            {/* Animated rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[200px] h-[200px] border border-white/20 rounded-full animate-[ping_2s_infinite]"></div>
          </div>
          
          {/* Standard particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array(10).fill(0).map((_, i) => (
              <div 
                key={i} 
                className="absolute bg-white/20 rounded-full blur-sm"
                style={{
                  width: `${Math.random() * 20 + 5}px`,
                  height: `${Math.random() * 20 + 5}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 8 + 5}s infinite ease-in-out ${i * 0.3}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* Dev mode indicator */}
      {localStorage.getItem('devMode') === 'true' && (
        <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Dev Mode: {isExperienced ? 'Advanced' : 'Standard'} Feature Splash
        </div>
      )}
    </div>
  );
};

export default FeatureSplashScreen;
