
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
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onComplete]);
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 transition-all duration-700">
      <div className="splash-content">
        <div className="splash-logo animate-float">
          <span className="text-5xl font-display font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            {title}
          </span>
          {subtitle && (
            <p className="text-lg mt-2 text-slate-600 dark:text-slate-300 opacity-80">
              {subtitle}
            </p>
          )}
        </div>
        <div className="splash-particles">
          {Array(20).fill(0).map((_, i) => (
            <div 
              key={i} 
              className="particle" 
              style={{
                '--delay': `${i * 0.15}s`,
                '--size': `${Math.random() * 30 + 10}px`,
                '--speed': `${Math.random() * 8 + 5}s`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              } as React.CSSProperties}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
