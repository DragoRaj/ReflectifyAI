
import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen } from "@/components/ui/loading-screen";
import StudentDashboard from "@/components/student/StudentDashboard";
import TeacherDashboard from "@/components/teacher/TeacherDashboard";
import Dashboard from "@/components/dashboard/Dashboard";
import OnboardingRouter from "./OnboardingRouter";

const DashboardRouter = () => {
  const { profile, isLoading } = useAuth();
  
  if (isLoading) return <LoadingScreen message="Loading your dashboard..." />;
  
  if (!profile) return <LoadingScreen message="Retrieving your profile..." />;
  
  return (
    <OnboardingRouter>
      {profile.role === 'student' && <StudentDashboard />}
      {profile.role === 'teacher' && <TeacherDashboard />}
      {profile.role === 'admin' && <Dashboard />}
    </OnboardingRouter>
  );
};

export default DashboardRouter;
