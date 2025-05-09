
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  BarChart2, 
  MessageCircle, 
  BookText, 
  Sparkles, 
  Home,
  Shield,
  HeartPulse
} from "lucide-react";
import FeatureSplashScreen from "@/components/FeatureSplashScreen";

const FeatureSplash = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [showFeatureSplash, setShowFeatureSplash] = useState(false);
  const [featureSplashInfo, setFeatureSplashInfo] = useState({
    name: "",
    description: "",
    icon: null as React.ReactNode
  });
  
  useEffect(() => {
    // Get feature from URL hash or path
    const featureId = location.hash.replace('#', '') || location.pathname.substring(1) || 'home';

    // Only show splash screen when path changes and it's not the initial load
    const isInitialLoad = sessionStorage.getItem('initialLoadComplete') !== 'true';
    const pathChanged = location.pathname !== '/' && !isInitialLoad;
    
    // Show splash screen for direct feature navigation or path changes
    if (pathChanged || (location.pathname !== '/' && isInitialLoad)) {
      // Track this feature visit in localStorage for analytics
      const featureKey = `${featureId}VisitCount`;
      const currentCount = parseInt(localStorage.getItem(featureKey) || '0');
      localStorage.setItem(featureKey, (currentCount + 1).toString());
      
      showFeatureSplashForId(featureId);
    }
    
    // Mark initial load as complete if it hasn't been marked already
    if (isInitialLoad) {
      sessionStorage.setItem('initialLoadComplete', 'true');
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
        splashInfo = {
          name: "Content",
          description: "Loading your content workspace...",
          icon: <Shield size={48} />
        };
        break;
      case 'chat':
        splashInfo = {
          name: "Chat",
          description: "Starting your wellbeing conversation...",
          icon: <MessageCircle size={48} />
        };
        break;
      case 'journal':
        splashInfo = {
          name: "Journal",
          description: "Opening your journal...",
          icon: <BookText size={48} />
        };
        break;
      case 'mindfulness':
        splashInfo = {
          name: "Mindfulness",
          description: "Preparing your mindfulness session...",
          icon: <Sparkles size={48} />
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
      {children}
    </>
  );
};

export default FeatureSplash;
