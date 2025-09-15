'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthGuard(redirectTo = '/login') {
  const router = useRouter();

  // For testing: Force authenticated state
  const auth = {
    isAuthenticated: true,
    isLoading: false,
    user: {
      profile: {
        email: 'test@example.com',
        username: 'testuser',
      }
    }
  };

  useEffect(() => {
    // Wait for auth to load
    if (auth.isLoading) return;

    // If not authenticated, redirect to login
    if (!auth.isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [auth.isAuthenticated, auth.isLoading, router, redirectTo]);

  return {
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    user: auth.user
  };
}