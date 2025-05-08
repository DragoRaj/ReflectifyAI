
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SplashScreen from "@/components/SplashScreen";
import FeatureSplashScreen from "@/components/FeatureSplashScreen";
import { BarChart2, MessageCircle, Shield, HeartPulse, Sparkles, Home, BookText, LogOut } from "lucide-react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Auth from "./pages/Auth";
import Dashboard from "./components/dashboard/Dashboard";
import StudentDashboard from "./components/student/StudentDashboard";
import TeacherDashboard from "./components/teacher/TeacherDashboard";
import JournalPage from "./components/JournalPage";
import WellbeingChatPage from "./components/WellbeingChatPage";
import MindfulnessPage from "./components/MindfulnessPage";
import OnboardingSurvey from "./components/OnboardingSurvey";
import DevConsole from "./components/DevConsole";
import { supabase } from "@/integrations/supabase/client";
import { Role } from "@/types/school-types";
import FunctionalAnalytics from "@/components/FunctionalAnalytics";
import ThemeProvider from "@/components/ThemeProvider";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Role-based route component
const RoleRoute = ({ 
  allowedRoles, 
  children 
}: { 
  allowedRoles: Role[], 
  children: React.ReactNode 
}) => {
  const { profile, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!profile || !allowedRoles.includes(profile.role)) {
    // If user doesn't have the correct role, redirect to their dashboard
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Component to handle onboarding status
const OnboardingCheck = ({ children }: { children: React.ReactNode }) => {
  const { user, profile } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    async function checkOnboardingStatus() {
      if (!user || !profile) return;
      
      try {
        if (profile.role === 'student') {
          const { data, error } = await supabase
            .from("onboarding_surveys")
            .select("*")
            .eq("student_id", user.id)
            .maybeSingle();
            
          if (error) {
            console.error("Error checking onboarding:", error);
          }
            
          setNeedsOnboarding(!data);
        } else if (profile.role === 'teacher') {
          const { data, error } = await supabase
            .from("teacher_surveys")
            .select("*")
            .eq("teacher_id", user.id)
            .maybeSingle();
              
          if (error) {
            console.error("Error checking teacher onboarding:", error);
          }
              
          setNeedsOnboarding(!data);
        } else {
          // Admin doesn't need onboarding
          setNeedsOnboarding(false);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (profile) {
      checkOnboardingStatus();
    } else {
      setLoading(false);
    }
  }, [user, profile]);
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (needsOnboarding) {
    return <OnboardingSurvey onComplete={() => setNeedsOnboarding(false)} />;
  }
  
  return <>{children}</>;
};

// Component to handle feature-specific splash screens
const FeatureRouter = () => {
  const location = useLocation();
  const [showFeatureSplash, setShowFeatureSplash] = useState(false);
  const [featureSplashInfo, setFeatureSplashInfo] = useState({
    name: "",
    description: "",
    icon: null as React.ReactNode
  });
  const { profile } = useAuth();
  
  useEffect(() => {
    // Get feature from URL hash
    const featureId = location.hash.replace('#', '') || 'home';

    // Only show splash screen when hash changes and it's not the initial load
    // or if the user specifically navigated to a feature using the hash
    const isInitialLoad = sessionStorage.getItem('initialLoadComplete') !== 'true';
    const hashChanged = location.hash && !isInitialLoad;
    
    // Show splash screen for direct feature navigation or hash changes
    if (hashChanged || (location.hash && isInitialLoad)) {
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

  // Determine which dashboard to show based on user role
  const DashboardRouter = () => {
    const { profile, isLoading } = useAuth();
    
    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
    
    if (!profile) return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
    
    return (
      <OnboardingCheck>
        {profile.role === 'student' && <StudentDashboard />}
        {profile.role === 'teacher' && <TeacherDashboard />}
        {profile.role === 'admin' && <Dashboard />}
      </OnboardingCheck>
    );
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
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          } 
        />
        <Route path="/auth" element={<Auth />} />
        
        {/* Feature routes */}
        <Route 
          path="/journal" 
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['student']}>
                <JournalPage />
              </RoleRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['student']}>
                <WellbeingChatPage />
              </RoleRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mindfulness" 
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['student']}>
                <MindfulnessPage />
              </RoleRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher-dashboard" 
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['teacher', 'admin']}>
                <TeacherDashboard />
              </RoleRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <FunctionalAnalytics />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <DevConsole />
    </>
  );
};

const AuthenticatedApp = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FeatureRouter />
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
