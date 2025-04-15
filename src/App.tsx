
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SplashScreen from "@/components/SplashScreen";
import FeatureSplashScreen from "@/components/FeatureSplashScreen";
import { BarChart2, MessageCircle, Shield, HeartPulse, Sparkles, Home } from "lucide-react";
import DevControls from "@/components/DevControls";

const queryClient = new QueryClient();

// Component to handle feature-specific splash screens
const FeatureRouter = () => {
  const location = useLocation();
  const [showFeatureSplash, setShowFeatureSplash] = useState(false);
  const [featureSplashInfo, setFeatureSplashInfo] = useState({
    name: "",
    description: "",
    icon: null as React.ReactNode
  });
  
  useEffect(() => {
    // Check for developer overrides
    const overrideType = localStorage.getItem('overrideSplashType');
    const overrideFeature = localStorage.getItem('overrideFeatureSplash');
    
    if (overrideType === 'feature' && overrideFeature) {
      // Override with specific feature splash
      const featureId = overrideFeature;
      showFeatureSplashForId(featureId);
      
      // Clear the override to prevent loops
      localStorage.removeItem('overrideFeatureType');
      localStorage.removeItem('overrideFeatureSplash');
      return;
    }
    
    // Regular behavior - get feature from URL hash
    const featureId = location.hash.replace('#', '') || 'home';
    
    // Only show splash screen when hash changes and it's not the initial load
    // Also respect developer override if set
    if ((location.hash && sessionStorage.getItem('initialLoadComplete') === 'true') || 
        overrideType === 'feature') {
      showFeatureSplashForId(featureId);
      
      // Clear the override if it exists
      if (overrideType === 'feature') {
        localStorage.removeItem('overrideSplashType');
      }
    }
  }, [location]);
  
  const showFeatureSplashForId = (featureId: string) => {
    let splashInfo = {
      name: "Welcome",
      description: "Loading your content...",
      icon: <Home size={48} />
    };
    
    // Set splash info based on feature
    switch (featureId) {
      case 'analytics':
        splashInfo = {
          name: "Analytics",
          description: "Analyzing your data and insights...",
          icon: <BarChart2 size={48} />
        };
        break;
      case 'content':
      case 'chat':
      case 'rant':
        splashInfo = {
          name: "Content",
          description: "Loading your content workspace...",
          icon: <Shield size={48} />
        };
        break;
      case 'mindfulness':
        splashInfo = {
          name: "Mindfulness",
          description: "Preparing your mindfulness session...",
          icon: <Sparkles size={48} />
        };
        break;
      case 'journal':
        splashInfo = {
          name: "Journal",
          description: "Opening your journal...",
          icon: <MessageCircle size={48} />
        };
        break;
      case 'health':
        splashInfo = {
          name: "Health",
          description: "Analyzing your health data...",
          icon: <HeartPulse size={48} />
        };
        break;
      default:
        splashInfo = {
          name: "Home",
          description: "Welcome to Reflectify",
          icon: <Home size={48} />
        };
    }
    
    setFeatureSplashInfo(splashInfo);
    setShowFeatureSplash(true);
  };
  
  return (
    <>
      {showFeatureSplash && (
        <FeatureSplashScreen
          featureName={featureSplashInfo.name}
          featureDescription={featureSplashInfo.description}
          icon={featureSplashInfo.icon}
          onComplete={() => setShowFeatureSplash(false)}
        />
      )}
      
      <Routes>
        <Route path="/" element={<Index />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    // Check for developer overrides
    const overrideType = localStorage.getItem('overrideSplashType');
    
    // Skip splash if override type is set to feature
    if (overrideType === 'feature') {
      setShowSplash(false);
      sessionStorage.setItem('initialLoadComplete', 'true');
      return;
    }
    
    // Regular behavior - show initial splash unless disabled
    const shouldSkipSplash = sessionStorage.getItem('initialLoadComplete') === 'true' && 
                           !overrideType;
                           
    setShowSplash(!shouldSkipSplash);
    
    // Set initial load complete after the first splash screen
    return () => {
      sessionStorage.setItem('initialLoadComplete', 'true');
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {showSplash ? (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        ) : (
          <BrowserRouter>
            <FeatureRouter />
            <DevControls />
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
