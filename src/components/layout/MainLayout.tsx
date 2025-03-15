
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Moon, Sun, BarChart2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout = ({ children, className }: MainLayoutProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    // Check for system preference or saved preference
    const isDark = localStorage.getItem("darkMode") === "true" || 
                  window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(isDark);
    updateTheme(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    updateTheme(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
  };

  const updateTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={cn("min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300", className)}>
      <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-display font-semibold text-xl reflectify-gradient-text">Reflectify</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            <button 
              className={`tab-button ${activeTab === "home" ? "active" : ""}`}
              onClick={() => handleTabClick("home")}
            >
              Home
            </button>
            <button 
              className={`tab-button ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => handleTabClick("analytics")}
            >
              <div className="flex items-center gap-1.5">
                <BarChart2 className="h-4 w-4" />
                <span>Analytics</span>
              </div>
            </button>
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 mr-2">
              <Sun className="h-4 w-4 text-amber-500 dark:text-amber-300" />
              <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
              <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </div>
            
            <button className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 transition hover:bg-gray-200 dark:hover:bg-gray-700">
              <span className="sr-only">User settings</span>
              <div className="h-7 w-7 rounded-full bg-gradient-to-r from-reflectify-blue to-reflectify-purple"></div>
            </button>
          </div>
        </div>
      </header>
      
      <main className="pt-24 pb-16">
        {children}
      </main>
      
      <footer className="py-6 px-6 border-t border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Reflectify. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-reflectify-blue dark:hover:text-reflectify-blue transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-reflectify-blue dark:hover:text-reflectify-blue transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-reflectify-blue dark:hover:text-reflectify-blue transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
