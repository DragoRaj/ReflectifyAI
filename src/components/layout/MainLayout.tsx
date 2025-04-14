
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Moon, Sun, BarChart2, Home, Shield, MessageCircle, Sparkles, HeartPulse } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

// Simplified function groups for the app - reduced to 4 main groups
const featureGroups = [
  {
    name: "Home",
    icon: <Home className="h-4 w-4" />,
    id: "home"
  },
  {
    name: "Analytics",
    icon: <BarChart2 className="h-4 w-4" />,
    id: "analytics"
  },
  {
    name: "Content",
    icon: <Shield className="h-4 w-4" />,
    subItems: [
      { name: "Content Analysis", id: "content" },
      { name: "Chat", id: "chat" },
      { name: "Express", id: "rant" }
    ]
  },
  {
    name: "Wellbeing",
    icon: <Sparkles className="h-4 w-4" />,
    subItems: [
      { name: "Mindfulness", id: "mindfulness" },
      { name: "Journal", id: "journal" },
      { name: "Health", id: "health" }
    ]
  }
];

const MainLayout = ({ children, className }: MainLayoutProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for system preference or saved preference
    const isDark = localStorage.getItem("darkMode") === "true" || 
                  window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(isDark);
    updateTheme(isDark);
    
    // Add animation delay
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
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
    // Update URL hash for better navigation
    window.location.hash = tab;
    
    // Add animation effect for tab change
    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.classList.add("fade-transition");
      setTimeout(() => {
        mainContent.classList.remove("fade-transition");
      }, 300);
    }
    
    // Scroll to the feature section
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Custom event for tab change (to be used in Index.tsx)
    const tabChangeEvent = new CustomEvent('tabChange', { detail: { tab } });
    window.dispatchEvent(tabChangeEvent);
  };

  return (
    <div className={cn("min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500", className)}>
      <header className="fixed top-0 left-0 right-0 z-50 py-3 px-6 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-blue-100 dark:border-blue-900/50 transition-all duration-500 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-display font-semibold text-xl bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              Reflectify
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                {featureGroups.map((group) => (
                  !group.subItems ? (
                    <NavigationMenuItem key={group.name}>
                      <NavigationMenuLink 
                        className={cn(
                          navigationMenuTriggerStyle(),
                          activeTab === group.id ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : ""
                        )}
                        onClick={() => handleTabClick(group.id)}
                      >
                        <div className="flex items-center gap-1.5">
                          {group.icon}
                          <span>{group.name}</span>
                        </div>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={group.name}>
                      <NavigationMenuTrigger
                        className={cn(
                          group.subItems.some(item => item.id === activeTab) ? 
                          "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : ""
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                          {group.icon}
                          <span>{group.name}</span>
                        </div>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-1 p-2">
                          {group.subItems.map((item) => (
                            <li key={item.id}>
                              <NavigationMenuLink
                                className={cn(
                                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
                                  "hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900 dark:hover:text-blue-300",
                                  activeTab === item.id ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : ""
                                )}
                                onClick={() => handleTabClick(item.id)}
                              >
                                <div className="text-sm font-medium">{item.name}</div>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  )
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 mr-2">
              <Sun className="h-4 w-4 text-amber-500 dark:text-amber-300" />
              <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
              <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </div>
            
            <button className="rounded-full bg-blue-100/80 dark:bg-blue-900/80 p-2 transition hover:bg-blue-200 dark:hover:bg-blue-800">
              <span className="sr-only">User settings</span>
              <div className="h-7 w-7 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400"></div>
            </button>
          </div>
        </div>
      </header>
      
      <main className="pt-24 pb-16 transition-opacity duration-300 ease-in-out">
        <div className={`transition-opacity duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {children}
        </div>
      </main>
      
      <footer className="py-6 px-6 border-t border-blue-100 dark:border-blue-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} Reflectify. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
