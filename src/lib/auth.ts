import { supabase } from './supabase';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';

type UserRole = 'brand' | 'creator';

// Cookie management helpers
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
};

const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
};

type AuthStateCallback = (event: AuthChangeEvent, session: Session | null) => void;

// Extract role from user metadata and persist as a readable cookie for proxy.ts
const setRoleCookie = (session: Session) => {
  const role = session.user?.user_metadata?.role;
  if (role === 'brand' || role === 'creator') {
    setCookie('vybe_user_role', role, 365);
  }
};

// Direct Supabase Auth Service
export const authService = {
  // Sign Up with Email and Password
  async signUp(email: string, password: string, name: string, role: UserRole) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role,
        },
      },
    });
    if (error) throw error;
    return data;
  },

  // Confirm standard Email OTP code
  async verifyOtp(email: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    });
    if (error) throw error;
    if (data?.session) {
      setCookie('vybe_auth_session', 'active');
      setCookie('sb-access-token', data.session.access_token);
      setRoleCookie(data.session);
    }
    return data;
  },

  // Resend signup verification OTP
  async resendOtp(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    if (error) throw error;
    return true;
  },

  // Sign In with Email and Password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data?.session) {
      setCookie('vybe_auth_session', 'active');
      setCookie('sb-access-token', data.session.access_token);
      setRoleCookie(data.session);
    }
    return data;
  },

  // Sign in using Google OAuth
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw error;
    return data;
  },

  // Trigger forgot password flow
  async sendPasswordReset(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return true;
  },

  // Update password (for reset password flow)
  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return true;
  },

  // Exchange auth code for user session (runs after redirect from reset email link)
  async exchangeCodeForSession(code: string) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    if (data?.session) {
      setCookie('vybe_auth_session', 'active');
      setCookie('sb-access-token', data.session.access_token);
      setRoleCookie(data.session);
    }
    return data;
  },

  // Get current active session
  async getSession(): Promise<Session | null> {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      deleteCookie('vybe_auth_session');
      deleteCookie('sb-access-token');
      deleteCookie('vybe_user_role');
      return null;
    }
    setCookie('vybe_auth_session', 'active');
    setCookie('sb-access-token', session.access_token);
    setRoleCookie(session);
    return session;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    deleteCookie('vybe_auth_session');
    deleteCookie('sb-access-token');
    deleteCookie('vybe_user_role');
  },

  // Register listener for auth state change
  onAuthStateChange(callback: AuthStateCallback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setCookie('vybe_auth_session', 'active');
        setCookie('sb-access-token', session.access_token);
        setRoleCookie(session);
      } else {
        deleteCookie('vybe_auth_session');
        deleteCookie('sb-access-token');
        deleteCookie('vybe_user_role');
      }
      callback(event, session);
    });
    return () => {
      subscription.unsubscribe();
    };
  }
};
