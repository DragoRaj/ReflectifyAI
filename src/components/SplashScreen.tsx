
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br theme-gradient overflow-hidden">
      <div className="splash-content">
        <div className="splash-logo animate-float relative z-10">
          <span className="text-5xl font-display font-bold bg-gradient-to-r theme-text-gradient bg-clip-text text-transparent">
            {title}
          </span>
          {subtitle && (
            <p className="text-lg mt-2 text-slate-600 dark:text-slate-300 opacity-80">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Enhanced background particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="splash-particles">
            {Array(30).fill(0).map((_, i) => (
              <div 
                key={i} 
                className="particle" 
                style={{
                  '--delay': `${i * 0.1}s`,
                  '--size': `${Math.random() * 40 + 10}px`,
                  '--speed': `${Math.random() * 10 + 5}s`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.3,
                } as React.CSSProperties}
              ></div>
            ))}
          </div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full theme-glow blur-3xl"></div>
          <div className="absolute bottom-0 w-full h-40 theme-bottom-gradient"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
