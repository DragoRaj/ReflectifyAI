
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import SplashScreen from "@/components/SplashScreen";
import { ThemeProvider } from "./components/ThemeProvider";
import { AppSidebar } from "@/components/layout/AppSidebar";
import AppRoutes from "@/components/routing/AppRoutes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

const AuthenticatedApp = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppSidebar>
          <AppRoutes />
        </AppSidebar>
      </AuthProvider>
    </BrowserRouter>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    // Regular behavior - show initial splash unless it's been shown already
    const shouldSkipSplash = sessionStorage.getItem('initialLoadComplete') === 'true';
    
    setShowSplash(!shouldSkipSplash);
    
    // Set initial load complete after the first splash screen
    return () => {
      sessionStorage.setItem('initialLoadComplete', 'true');
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
          {showSplash ? (
            <SplashScreen onComplete={() => setShowSplash(false)} />
          ) : (
            <AuthenticatedApp />
          )}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
