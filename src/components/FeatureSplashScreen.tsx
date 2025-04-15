
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
  
  useEffect(() => {
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
  }, [duration, onComplete]);
  
  if (!visible) return null;
  
  return (
    <div className={`fixed inset-0 z-40 flex items-center justify-center backdrop-blur-lg transition-all duration-500 ${animateOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Background gradient that respects dark/light mode but uses theme color */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--theme-color))/50] via-transparent to-[hsl(var(--theme-color))/30] dark:from-[hsl(var(--theme-color))/30] dark:to-[hsl(var(--theme-color))/10]"></div>
      
      {/* Animated content */}
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
      </div>
      
      {/* Particles */}
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
  );
};

export default FeatureSplashScreen;
