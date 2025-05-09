
import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { motion } from 'framer-motion';

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
    <motion.div 
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isDarkMode ? 'bg-slate-900' : 'bg-white'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative flex flex-col items-center">
        {/* Animated circular background */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center -z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div 
            className={`w-64 h-64 rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8] 
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div 
            className={`absolute w-48 h-48 rounded-full ${
              isDarkMode 
                ? 'bg-gradient-to-r from-indigo-700/40 to-purple-700/40' 
                : 'bg-gradient-to-r from-indigo-200 to-purple-200'
            }`}
            animate={{ 
              rotate: 360,
              scale: [0.9, 1, 0.9]
            }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        </motion.div>
        
        <motion.div 
          className="mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 10
          }}
        >
          <motion.div 
            className={`p-6 rounded-full ${
              isDarkMode 
                ? 'bg-gradient-to-br from-indigo-700 to-purple-800 shadow-[0_0_20px_5px_rgba(124,58,237,0.3)]' 
                : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_20px_5px_rgba(124,58,237,0.2)]'
            }`}
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, -5, 0, 5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: 1,
              ease: "easeInOut"
            }}
          >
            {React.isValidElement(icon) &&
              React.cloneElement(icon as React.ReactElement, {
                className: "h-12 w-12 text-white"
              })}
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="space-y-2 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {featureName}
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {featureDescription}
          </p>
        </motion.div>
        
        <motion.div 
          className="mt-8 w-48"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-gray-200">
            <motion.div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-purple-600"
              animate={{ x: ["0%", "100%"] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear" 
              }}
              style={{ width: "50%" }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
