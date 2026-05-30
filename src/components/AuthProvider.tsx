"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '@/lib/auth';
import { brandDetailsService } from '@/lib/db';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  onboardingComplete: boolean;
  refreshOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  onboardingComplete: false,
  refreshOnboarding: async () => {},
});

// Cookie helpers
const setCookie = (name: string, value: string, days = 365) => {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
};

const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const checkOnboarding = async (userId: string) => {
    try {
      const complete = await brandDetailsService.isOnboardingComplete(userId);
      setOnboardingComplete(complete);
      if (complete) {
        setCookie('vybe_onboarding_complete', 'true');
      } else {
        deleteCookie('vybe_onboarding_complete');
      }
    } catch {
      // If brand_details table doesn't exist yet, skip gracefully
      setOnboardingComplete(false);
    }
  };

  const refreshOnboarding = async () => {
    if (user) {
      await checkOnboarding(user.id);
    }
  };

  useEffect(() => {
    // Get initial session
    authService.getSession().then(async (initialSession) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        await checkOnboarding(initialSession.user.id);
      }

      setLoading(false);
    }).catch(err => {
      console.error("Failed to load initial session:", err);
      setLoading(false);
    });

    // Listen for auth changes
    const unsubscribe = authService.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await checkOnboarding(currentSession.user.id);
      } else {
        setOnboardingComplete(false);
        deleteCookie('vybe_onboarding_complete');
      }

      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, onboardingComplete, refreshOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
