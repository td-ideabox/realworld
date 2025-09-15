import { useEffect } from 'react';
import { useAuthStore, useApiClientStore } from '../stores';

export const useAuthSync = () => {
  const { token, setToken: setStoreToken, setUser, setLoading } = useAuthStore();
  const { setToken } = useApiClientStore();

  // Initialize with forced auth state for testing
  useEffect(() => {
    const mockToken = 'mock-jwt-token-for-testing';
    const mockUser = {
      email: 'test@example.com',
      username: 'testuser',
      bio: null,
      image: null,
      token: mockToken,
    };

    setStoreToken(mockToken);
    setUser(mockUser);
    setToken(mockToken);
    setLoading(false);
  }, [setStoreToken, setUser, setToken, setLoading]);

  return { isInitialized: true };
};