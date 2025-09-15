'use client';

import { useAuth } from 'react-oidc-context';
import { useEffect } from 'react';

export function useAuthToken() {
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.access_token) {
      localStorage.setItem('token', auth.user.access_token);

      // Store user profile information
      if (auth.user.profile) {
        localStorage.setItem('user', JSON.stringify({
          email: auth.user.profile.email,
          sub: auth.user.profile.sub,
          username: auth.user.profile.email?.split('@')[0] || 'user',
        }));
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [auth.isAuthenticated, auth.user]);

  return {
    token: auth.user?.access_token,
    isAuthenticated: auth.isAuthenticated,
    user: auth.user?.profile,
    login: () => auth.signinRedirect(),
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      auth.signoutRedirect();
    },
  };
}

// Utility functions for token management
export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const getStoredUser = (): any | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const clearStoredAuth = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Function to get authorization headers for API calls (Cognito Bearer format)
export const getAuthHeaders = (): Record<string, string> => {
  const token = getStoredToken();
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
  return {
    'Content-Type': 'application/json',
  };
};