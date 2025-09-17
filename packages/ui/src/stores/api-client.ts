import { create } from 'zustand';
import { ConduitApiClient } from '@conduit/transport';

interface ApiClientState {
  client: ConduitApiClient;
}

interface ApiClientActions {
  setToken: (token: string | null) => void;
  getClient: () => ConduitApiClient;
  initializeClient: () => void;
}

type ApiClientStore = ApiClientState & ApiClientActions;

const getBaseUrl = () => {
  const apiPort = process.env.API_PORT || process.env.NEXT_PUBLIC_API_PORT || '3000';
  return process.env.NEXT_PUBLIC_API_URL || `http://localhost:${apiPort}`;
};

export const useApiClientStore = create<ApiClientStore>((set, get) => ({
  client: new ConduitApiClient({
    baseUrl: getBaseUrl(),
    timeout: 10000,
  }),

  setToken: (token: string | null) => {
    const { client } = get();
    client.setToken(token);
  },

  getClient: () => {
    return get().client;
  },

  initializeClient: () => {
    const stored = localStorage.getItem('conduit-auth');
    if (stored) {
      try {
        const authData = JSON.parse(stored);
        if (authData.state?.token) {
          const { client } = get();
          client.setToken(authData.state.token);
        }
      } catch (error) {
        console.warn('Failed to initialize API client with stored token:', error);
      }
    }
  }
}));