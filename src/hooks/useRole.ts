/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';

export type UserRole = 'brand' | 'creator' | null;

export function useRole() {
  const { session, user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!session || !user) {
      setRole(null);
      setLoading(false);
      return;
    }

    // Attempt to parse role from session access token JWT custom claims
    try {
      if (session.access_token) {
        const payload = session.access_token.split('.')[1];
        if (payload) {
          const decoded = JSON.parse(atob(payload));
          // Check root claim (from Auth Hook) or app_metadata claim
          const decodedRole = decoded.user_role || (decoded.app_metadata && decoded.app_metadata.user_role);
          if (decodedRole === 'brand' || decodedRole === 'creator') {
            setRole(decodedRole);
            setLoading(false);
            return;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to parse role from JWT', e);
    }

    // Fallback to user metadata where we initially store it on signup
    const metaRole = user.user_metadata?.role;
    if (metaRole === 'brand' || metaRole === 'creator') {
      setRole(metaRole);
    } else {
      // Default fallback
      setRole('creator');
    }
    
    setLoading(false);
  }, [session, user, authLoading]);

  return { role, loading };
}
