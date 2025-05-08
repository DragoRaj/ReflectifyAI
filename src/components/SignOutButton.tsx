
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleSignOut}
      className="flex items-center gap-1 text-red-600 hover:text-red-800 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  );
}
