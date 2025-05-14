
import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

interface ThemeSwitcherProps {
  showLabel?: boolean;
  size?: "sm" | "default";
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  showLabel = true,
  size = "default"
}) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <Button
      variant="ghost"
      size={size}
      className="w-full justify-start"
      onClick={toggleDarkMode}
    >
      {isDarkMode ? (
        <Moon className={`${size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} ${showLabel ? "mr-2" : ""}`} />
      ) : (
        <Sun className={`${size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} ${showLabel ? "mr-2" : ""}`} />
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
            {isDarkMode ? "Dark Mode" : "Light Mode"}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
};

export default ThemeSwitcher;
