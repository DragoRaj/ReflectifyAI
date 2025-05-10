
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
import { MenuIcon, HomeIcon, BarChart2Icon, MessageCircleIcon, BookIcon, SparklesIcon, UserIcon, LogOut } from "lucide-react";
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
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full">
        <div 
          className="group relative"
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
        >
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center">
                    <span className="text-white font-bold">R</span>
                  </div>
                  <AnimatePresence>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="font-bold text-xl text-indigo-700 dark:text-indigo-400 overflow-hidden whitespace-nowrap"
                      >
                        Reflectify
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <SidebarTrigger className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </SidebarHeader>

            <SidebarContent>
              <SidebarMenu>
                {filteredNavItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.path}
                      tooltip={!expanded ? item.label : undefined}
                    >
                      <NavLink to={item.path} className="flex items-center gap-2">
                        {item.icon}
                        <AnimatePresence>
                          {expanded && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden whitespace-nowrap"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="mt-auto p-4">
              <div className="flex flex-col gap-2">
                <ThemeSwitcher 
                  isDarkMode={isDarkMode} 
                  onDarkModeChange={toggleDarkMode} 
                  showLabel={expanded}
                />
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={signOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
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
            </SidebarFooter>
          </Sidebar>
        </div>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
