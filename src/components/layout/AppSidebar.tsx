import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { 
  ChevronRight,
  MenuIcon, 
  HomeIcon, 
  BarChart2Icon, 
  MessageCircleIcon, 
  BookIcon, 
  SparklesIcon, 
  UserIcon, 
  LogOut 
} from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setExpanded(false);
      }
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const navItems: NavItem[] = [
    {
      label: "Home",
      path: "/",
      icon: <HomeIcon size={20} />,
      roles: ["student", "teacher", "admin"]
    },
    {
      label: "Analytics",
      path: "/analytics",
      icon: <BarChart2Icon size={20} />,
      roles: ["student", "teacher", "admin"]
    },
    {
      label: "Chat",
      path: "/chat",
      icon: <MessageCircleIcon size={20} />,
      roles: ["student"]
    },
    {
      label: "Journal",
      path: "/journal",
      icon: <BookIcon size={20} />,
      roles: ["student"]
    },
    {
      label: "Mindfulness",
      path: "/mindfulness",
      icon: <SparklesIcon size={20} />,
      roles: ["student"]
    }
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (!profile) return true; // Show all before profile loaded
    return item.roles.includes(profile.role);
  });

  return (
    <div className="flex min-h-screen w-full">
      <motion.div 
        className={`fixed left-0 top-0 h-full z-40 ${expanded ? 'w-64' : 'w-16'}`}
        initial={false}
        animate={{ width: expanded ? '16rem' : '4rem' }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div className="h-full bg-gradient-to-b from-indigo-900 to-purple-900 dark:from-indigo-950 dark:to-purple-950 text-white shadow-lg shadow-indigo-500/20 flex flex-col">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-indigo-400 dark:bg-indigo-300 flex items-center justify-center">
                <span className="text-indigo-900 font-bold">R</span>
              </div>
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="font-bold text-xl text-white overflow-hidden whitespace-nowrap"
                  >
                    Reflectify
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white opacity-70 hover:opacity-100 p-1 hover:bg-white/10"
              onClick={toggleSidebar}
            >
              <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          <div className="mt-6 flex-1 overflow-y-auto">
            <div className="space-y-1 px-3">
              {filteredNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2.5 rounded-lg
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                    transition-all duration-200
                  `}
                >
                  <span className="flex items-center justify-center h-5 w-5">
                    {item.icon}
                  </span>
                  <AnimatePresence>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-3 overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-white/10 space-y-3">
            <ThemeSwitcher 
              showLabel={expanded}
              size="sm"
            />
            
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10" 
              onClick={signOut}
            >
              <LogOut className={`h-4 w-4 ${expanded ? 'mr-2' : ''}`} />
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    Sign out
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </motion.div>

      <div className={`flex-1 transition-all duration-300 ${expanded ? 'ml-64' : 'ml-16'}`}>
        {children}
      </div>
    </div>
  );
}
