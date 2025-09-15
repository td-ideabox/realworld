import { useEffect } from 'react';
import { useAuthStore, useApiClientStore } from '../stores';
import { useAuthToken } from './useAuthToken';

export const useAuthSync = () => {
  const { token, syncWithOIDC, initializeAuth } = useAuthStore();
  const { setToken } = useApiClientStore();
  const { isAuthenticated, token: oidcToken } = useAuthToken();

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Sync with OIDC changes
  useEffect(() => {
    if (isAuthenticated && oidcToken) {
      syncWithOIDC();
    } else if (!isAuthenticated) {
      useAuthStore.getState().clearAuth();
    }
  }, [isAuthenticated, oidcToken, syncWithOIDC]);

  // Sync API client token
  useEffect(() => {
    setToken(token);
  }, [token, setToken]);

  return { isInitialized: true };
};