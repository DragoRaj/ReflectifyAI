
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Moon, Sun, BarChart2, Home, Shield, MessageCircle, BookText, HeartPulse, Sparkles } from "lucide-react";
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

// Function groups for the app
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
      { name: "Content Analysis", id: "content" }
    ]
  },
  {
    name: "Communication",
    icon: <MessageCircle className="h-4 w-4" />,
    subItems: [
      { name: "Chat", id: "chat" },
      { name: "Express", id: "rant" }
    ]
  },
  {
    name: "Wellbeing",
    icon: <Sparkles className="h-4 w-4" />,
    subItems: [
      { name: "Mindfulness", id: "mindfulness" },
      { name: "Journal", id: "journal" }
    ]
  },
  {
    name: "Health",
    icon: <HeartPulse className="h-4 w-4" />,
    subItems: [
      { name: "Health Tracking", id: "health" }
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
    // Add animation effect for tab change
    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.classList.add("fade-transition");
      setTimeout(() => {
        mainContent.classList.remove("fade-transition");
        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <div className={cn("min-h-screen bg-gradient-to-b from-seafoam-50 to-mint-100 dark:from-indigo-950 dark:to-slate-900 transition-colors duration-500", className)}>
      <header className="fixed top-0 left-0 right-0 z-50 py-3 px-6 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-emerald-100 dark:border-indigo-800/50 transition-all duration-500 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-display font-semibold text-xl bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent dark:from-teal-300 dark:to-emerald-400">
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
                          activeTab === group.id ? "bg-emerald-50 dark:bg-indigo-900 text-emerald-600 dark:text-teal-300" : ""
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
                          "bg-emerald-50 dark:bg-indigo-900 text-emerald-600 dark:text-teal-300" : ""
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
                                  "hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-indigo-900 dark:hover:text-teal-300",
                                  activeTab === item.id ? "bg-emerald-50 dark:bg-indigo-900 text-emerald-600 dark:text-teal-300" : ""
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
            
            <button className="rounded-full bg-emerald-100/80 dark:bg-indigo-800/80 p-2 transition hover:bg-emerald-200 dark:hover:bg-indigo-700">
              <span className="sr-only">User settings</span>
              <div className="h-7 w-7 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 dark:from-teal-300 dark:to-emerald-400"></div>
            </button>
          </div>
        </div>
      </header>
      
      <main className="pt-24 pb-16 transition-opacity duration-300 ease-in-out">
        {!isLoaded && (
          <div className="splash-screen">
            <div className="splash-content">
              <div className="splash-logo animate-float">
                <span className="text-4xl font-display font-bold bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent dark:from-teal-300 dark:to-emerald-400">
                  Reflectify
                </span>
              </div>
              <div className="splash-particles">
                {Array(12).fill(0).map((_, i) => (
                  <div 
                    key={i} 
                    className="particle" 
                    style={{
                      '--delay': `${i * 0.2}s`,
                      '--size': `${Math.random() * 20 + 10}px`,
                      '--speed': `${Math.random() * 10 + 10}s`
                    } as React.CSSProperties}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className={`transition-opacity duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {children}
        </div>
      </main>
      
      <footer className="py-6 px-6 border-t border-emerald-100 dark:border-indigo-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} Reflectify. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-teal-300 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-teal-300 transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-teal-300 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
