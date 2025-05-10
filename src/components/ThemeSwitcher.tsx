
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ThemeSwitcherProps {
  isDarkMode: boolean;
  onDarkModeChange: (isDark: boolean) => void;
  showLabel?: boolean;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  isDarkMode, 
  onDarkModeChange,
  showLabel = true
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start"
      onClick={() => onDarkModeChange(!isDarkMode)}
    >
      {isDarkMode ? (
        <Moon className="h-4 w-4 mr-2" />
      ) : (
        <Sun className="h-4 w-4 mr-2" />
      )}
      <AnimatePresence>
        {showLabel && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap"
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
};

export default ThemeSwitcher;
