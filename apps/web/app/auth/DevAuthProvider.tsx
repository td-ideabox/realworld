'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useDevAuth, type DevAuthUser } from '@repo/ui/hooks';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: DevAuthUser | null;
  signinRedirect: () => void;
  signoutRedirect: () => void;
  devLogin?: (email: string, username?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
  children: ReactNode;
}

export function DevAuthProvider({ children }: Props) {
  const devAuth = useDevAuth();

  // Initialize auth state from localStorage
  useEffect(() => {
    // Auth state is managed in useDevAuth hook
  }, []);

  const contextValue: AuthContextType = {
    isAuthenticated: devAuth.isAuthenticated,
    isLoading: devAuth.isLoading,
    user: devAuth.user,
    signinRedirect: devAuth.signinRedirect,
    signoutRedirect: devAuth.signoutRedirect,
    devLogin: devAuth.login,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook that mimics react-oidc-context's useAuth
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within DevAuthProvider');
  }
  return context;
}