'use client';

import { useEffect } from 'react';

// Dynamic auth hook that works with both dev and OIDC contexts
const useAuthContext = () => {
  try {
    // Try to use the auth context (works for both DevAuthProvider and OIDC)
    const { useAuth } = require('react-oidc-context');
    return useAuth();
  } catch {
    // Fallback if no auth context available
    return {
      isAuthenticated: false,
      user: null,
      signinRedirect: () => {},
      signoutRedirect: () => {},
    };
  }
};

export function useAuthToken() {
  // For testing: Force authenticated state
  const mockUser = {
    access_token: 'mock-jwt-token-for-testing',
    profile: {
      email: 'test@example.com',
      sub: 'test-user-123',
      username: 'testuser',
      name: 'Test User',
    }
  };

  useEffect(() => {
    // Always set mock auth data for testing
    localStorage.setItem('token', mockUser.access_token);
    localStorage.setItem('user', JSON.stringify({
      email: mockUser.profile.email,
      sub: mockUser.profile.sub,
      username: mockUser.profile.username,
    }));
  }, []);

  return {
    token: mockUser.access_token,
    isAuthenticated: true,
    user: mockUser.profile,
    login: () => console.log('Mock login'),
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('Mock logout');
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