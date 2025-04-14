
import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  duration = 2500 
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-seafoam-50 dark:bg-indigo-950 transition-all duration-700">
      <div className="splash-content">
        <div className="splash-logo animate-float">
          <span className="text-5xl font-display font-bold bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent dark:from-teal-300 dark:to-emerald-400">
            Reflectify
          </span>
        </div>
        <div className="splash-particles">
          {Array(15).fill(0).map((_, i) => (
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
