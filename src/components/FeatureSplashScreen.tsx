
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
    <div className={`fixed inset-0 z-40 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-md transition-all duration-500 ${animateOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`transform transition-all duration-500 ${animateOut ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="flex flex-col items-center text-center p-8">
          {icon && (
            <div className="text-5xl mb-4 text-blue-500 dark:text-blue-400 animate-pulse">
              {icon}
            </div>
          )}
          <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400 mb-2">
            {featureName}
          </h2>
          {featureDescription && (
            <p className="text-slate-600 dark:text-slate-300 max-w-md">
              {featureDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeatureSplashScreen;
