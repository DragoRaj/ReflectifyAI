
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import DashboardRouter from "./DashboardRouter";
import Auth from "@/pages/Auth";
import JournalPage from "@/components/JournalPage";
import WellbeingChatPage from "@/components/WellbeingChatPage";
import MindfulnessPage from "@/components/MindfulnessPage";
import TeacherDashboard from "@/components/teacher/TeacherDashboard";
import FunctionalAnalytics from "@/components/FunctionalAnalytics";
import NotFound from "@/pages/NotFound";
import DevConsole from "@/components/DevConsole";
import FeatureSplash from "../features/FeatureSplash";

const AppRoutes = () => {
  return (
    <FeatureSplash>
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
    </FeatureSplash>
  );
};

export default AppRoutes;
