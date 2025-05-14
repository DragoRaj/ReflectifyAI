
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen } from "@/components/ui/loading-screen";
import OnboardingSurvey from "@/components/OnboardingSurvey";
import { TeacherSurvey } from "@/components/surveys/TeacherSurvey";
import AdminSurvey from "@/components/surveys/AdminSurvey";
import { supabase } from "@/integrations/supabase/client";

const OnboardingRouter = ({ children }: { children: React.ReactNode }) => {
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
        } else if (profile.role === 'admin') {
          const { data, error } = await supabase
            .from("admin_surveys")
            .select("*")
            .eq("admin_id", user.id)
            .maybeSingle();
              
          if (error) {
            console.error("Error checking admin onboarding:", error);
          }
              
          setNeedsOnboarding(!data);
        } else {
          // Default case, shouldn't normally be reached
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
    return <LoadingScreen message="Preparing your experience..." />;
  }
  
  if (needsOnboarding) {
    if (profile?.role === 'teacher') {
      return <TeacherSurvey onComplete={() => setNeedsOnboarding(false)} />;
    } else if (profile?.role === 'admin') {
      return <AdminSurvey onComplete={() => setNeedsOnboarding(false)} />;
    } else {
      return <OnboardingSurvey onComplete={() => setNeedsOnboarding(false)} />;
    }
  }
  
  return <>{children}</>;
};

export default OnboardingRouter;
