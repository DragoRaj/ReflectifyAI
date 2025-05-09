
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Role } from "@/types/school-types";

const RoleRoute = ({ 
  allowedRoles, 
  children 
}: { 
  allowedRoles: Role[], 
  children: React.ReactNode 
}) => {
  const { profile, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen message="Loading your profile..." />;
  }
  
  if (!profile || !allowedRoles.includes(profile.role)) {
    // If user doesn't have the correct role, redirect to their dashboard
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default RoleRoute;
