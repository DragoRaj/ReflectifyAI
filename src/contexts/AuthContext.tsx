
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile, Role } from "@/types/school-types";
import { useNavigate } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, role: Role) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { 
    session, 
    user, 
    profile, 
    isLoading, 
    refreshProfile 
  } = useSupabaseAuth();

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success("Signed in successfully");
    } catch (error: any) {
      toast.error(error.message || "Error signing in");
      throw error;
    }
  }

  async function signUp(email: string, password: string, firstName: string, lastName: string, role: Role) {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role,
          }
        }
      });
      if (error) throw error;
      toast.success("Signed up successfully. Please check your email for verification.");
    } catch (error: any) {
      toast.error(error.message || "Error signing up");
      throw error;
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message || "Error signing out");
    }
  }

  async function updateProfile(data: Partial<Profile>) {
    try {
      if (!user) throw new Error("No user logged in");
      
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", user.id);
      
      if (error) throw error;
      
      await refreshProfile();
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Error updating profile");
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
