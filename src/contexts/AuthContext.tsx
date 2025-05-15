
import React, { createContext, useContext, ReactNode } from 'react';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { User, Session } from '@supabase/supabase-js';
import { Profile } from '@/types/school-types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  refreshProfile: () => Promise<Profile | null>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  refreshProfile: () => Promise.resolve(null),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useSupabaseAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
