import { useEffect } from 'react';
import { useAuthStore, useApiClientStore } from '../stores';

export const useAuthSync = () => {
  const { token } = useAuthStore();
  const { setToken } = useApiClientStore();

  useEffect(() => {
    setToken(token);
  }, [token, setToken]);

  return { isInitialized: true };
};