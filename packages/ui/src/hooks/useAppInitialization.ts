import { useEffect } from 'react';
import { useApiClientStore, useAuthStore } from '../stores';

export const useAppInitialization = () => {
  const { initializeClient, setToken } = useApiClientStore();
  const { initializeAuth, token } = useAuthStore();

  useEffect(() => {
    initializeAuth();
    initializeClient();
  }, [initializeAuth, initializeClient]);

  useEffect(() => {
    if (token) {
      setToken(token);
    }
  }, [token, setToken]);
};