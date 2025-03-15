
import React from "react";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout = ({ children, className }: MainLayoutProps) => {
  return (
    <div className={cn("min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-950", className)}>
      <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-display font-semibold text-xl reflectify-gradient-text">Reflectify</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            <button className="tab-button active">Home</button>
            <button className="tab-button">Health</button>
            <button className="tab-button">Mindfulness</button>
            <button className="tab-button">Analytics</button>
          </nav>
          
          <div className="flex items-center space-x-4">
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
      
      <footer className="py-6 px-6 border-t border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
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
