'use client';

import { useState, useCallback } from 'react';

// Simple JWT-like token generator for development
const generateMockJWT = (email: string, username: string) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: `dev-user-${Date.now()}`,
    email,
    username,
    name: username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    iss: 'conduit-dev',
    aud: 'conduit-app'
  }));
  const signature = btoa('dev-signature'); // Mock signature

  return `${header}.${payload}.${signature}`;
};

export interface DevAuthUser {
  access_token: string;
  profile: {
    sub: string;
    email: string;
    username: string;
    name: string;
  };
}

export function useDevAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('dev-auth-token');
    }
    return false;
  });

  const [user, setUser] = useState<DevAuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dev-auth-user');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, username?: string) => {
    setIsLoading(true);

    // Simulate async login
    await new Promise(resolve => setTimeout(resolve, 500));

    const userUsername = username || email.split('@')[0];
    const token = generateMockJWT(email, userUsername!);

    const mockUser: DevAuthUser = {
      access_token: token,
      profile: {
        sub: `dev-user-${Date.now()}`,
        email,
        username: userUsername!,
        name: userUsername!,
      }
    };

    // Store in localStorage
    localStorage.setItem('dev-auth-token', token);
    localStorage.setItem('dev-auth-user', JSON.stringify(mockUser));
    localStorage.setItem('token', token); // For API compatibility
    localStorage.setItem('user', JSON.stringify({
      email,
      username: userUsername!,
      sub: mockUser.profile.sub,
    }));

    setUser(mockUser);
    setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('dev-auth-token');
    localStorage.removeItem('dev-auth-user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const signinRedirect = useCallback(() => {
    // For dev auth, we'll handle this in the login form
    console.log('Dev auth: signinRedirect called');
  }, []);

  const signoutRedirect = useCallback(() => {
    logout();
    window.location.href = '/';
  }, [logout]);

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    signinRedirect,
    signoutRedirect,
  };
}