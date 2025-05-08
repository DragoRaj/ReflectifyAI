
import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';

interface FeatureSplashScreenProps {
  featureName: string;
  featureDescription: string;
  icon: React.ReactNode;
  onComplete: () => void;
}

export default function FeatureSplashScreen({
  featureName,
  featureDescription,
  icon,
  onComplete
}: FeatureSplashScreenProps) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
      animationComplete ? 'opacity-0' : 'opacity-100'
    } ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="relative flex flex-col items-center">
        {/* Animated circular background */}
        <div className={`absolute inset-0 flex items-center justify-center -z-10`}>
          <div className={`w-64 h-64 rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'} animate-pulse`}></div>
          <div className={`absolute w-48 h-48 rounded-full ${
            isDarkMode ? 'bg-gradient-to-r from-indigo-700/40 to-purple-700/40' : 'bg-gradient-to-r from-indigo-200 to-purple-200'
          } animate-pulse`}></div>
        </div>
        
        <div className="mb-6 transform animate-bounce">
          <div className={`p-6 rounded-full ${
            isDarkMode 
              ? 'bg-gradient-to-br from-indigo-700 to-purple-800 shadow-[0_0_20px_5px_rgba(124,58,237,0.3)]' 
              : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_20px_5px_rgba(124,58,237,0.2)]'
          }`}>
            {React.isValidElement(icon) &&
              React.cloneElement(icon as React.ReactElement, {
                className: "h-12 w-12 text-white"
              })}
          </div>
        </div>
        
        <div className="space-y-2 text-center">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {featureName}
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {featureDescription}
          </p>
        </div>
        
        <div className="mt-8">
          <div className="relative h-1 w-48 overflow-hidden rounded-full bg-gray-200">
            <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-loader"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
