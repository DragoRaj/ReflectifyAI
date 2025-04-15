import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { BarChart2, Home, Shield, Sparkles } from "lucide-react";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import DevControls from "@/components/DevControls";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

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
    const isDark = localStorage.getItem("darkMode") === "true" || 
                  window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(isDark);
    updateTheme(isDark);
    
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setActiveTab(hash);
    }
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
    window.location.hash = tab;
    
    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.classList.add("fade-transition");
      setTimeout(() => {
        mainContent.classList.remove("fade-transition");
      }, 300);
    }
    
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    const tabChangeEvent = new CustomEvent('tabChange', { detail: { tab } });
    window.dispatchEvent(tabChangeEvent);
  };

  return (
    <div className={cn("min-h-screen bg-gradient-to-b from-background to-accent/30 transition-colors duration-500", className)}>
      <header className="fixed top-0 left-0 right-0 z-50 py-3 px-6 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-border transition-all duration-500 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-display font-semibold text-xl text-foreground dark:text-foreground">
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
                          activeTab === group.id ? "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary" : ""
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
                          "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary" : ""
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
                                  "hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary",
                                  activeTab === item.id ? "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary" : ""
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
            <ThemeSwitcher isDarkMode={isDarkMode} onDarkModeChange={toggleDarkMode} />
            
            <button className="rounded-full bg-primary/10 dark:bg-primary/20 p-2 transition hover:bg-primary/20 dark:hover:bg-primary/30">
              <span className="sr-only">User settings</span>
              <div className="h-7 w-7 rounded-full bg-gradient-to-r from-primary to-primary dark:from-primary dark:to-primary/80"></div>
            </button>
          </div>
        </div>
      </header>
      
      <main className="pt-24 pb-16 transition-opacity duration-300 ease-in-out">
        <div className={`transition-opacity duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {children}
        </div>
      </main>
      
      <footer className="py-6 px-6 border-t border-border bg-background/80 dark:bg-background/80 backdrop-blur-lg transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Reflectify. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
      
      <DevControls />
    </div>
  );
};

export default MainLayout;
