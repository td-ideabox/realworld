import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConduitApiClient, User, UpdateUserRequest, LoginRequest, RegisterRequest } from '@conduit/transport';
import { getStoredToken, getStoredUser } from '../hooks/useAuthToken';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // OIDC/Cognito fields - now actively used
  oidcUser?: any;
  cognitoTokens?: {
    idToken?: string;
    accessToken?: string;
    refreshToken?: string;
  };
}

export interface AuthActions {
  // Core auth state management
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  logout: () => void;

  // API integration methods
  login: (client: ConduitApiClient, credentials: LoginRequest) => Promise<void>;
  register: (client: ConduitApiClient, userData: RegisterRequest) => Promise<void>;
  getCurrentUser: (client: ConduitApiClient) => Promise<void>;
  updateUser: (client: ConduitApiClient, userData: UpdateUserRequest) => Promise<void>;

  // OIDC/Cognito integration methods
  setCognitoTokens: (tokens: any) => void;
  setOidcUser: (oidcUser: any) => void;
  syncWithOIDC: () => void;

  // Initialize auth state from localStorage
  initializeAuth: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      // OIDC/Cognito fields
      oidcUser: undefined,
      cognitoTokens: undefined,

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token: string | null) => {
        set({ token });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          oidcUser: undefined,
          cognitoTokens: undefined
        });
      },

      initializeAuth: () => {
        const storedToken = getStoredToken();
        const storedUser = getStoredUser();

        if (storedToken && storedUser) {
          set({
            token: storedToken,
            user: storedUser,
            isAuthenticated: true
          });
        }
      },

      syncWithOIDC: () => {
        const storedToken = getStoredToken();
        const storedUser = getStoredUser();

        set({
          token: storedToken,
          user: storedUser,
          isAuthenticated: !!storedToken
        });
      },

      setCognitoTokens: (tokens: any) => {
        set({ cognitoTokens: tokens });
      },

      setOidcUser: (oidcUser: any) => {
        set({ oidcUser });
      },

      login: async (client: ConduitApiClient, credentials: LoginRequest) => {
        try {
          set({ isLoading: true, error: null });
          const response = await client.login(credentials);
          const { user } = response;

          set({
            user,
            token: user.token,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to login',
            isLoading: false
          });
          throw error;
        }
      },

      register: async (client: ConduitApiClient, userData: RegisterRequest) => {
        try {
          set({ isLoading: true, error: null });
          const response = await client.register(userData);
          const { user } = response;

          set({
            user,
            token: user.token,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to register',
            isLoading: false
          });
          throw error;
        }
      },

      getCurrentUser: async (client: ConduitApiClient) => {
        try {
          set({ isLoading: true, error: null });
          const response = await client.getCurrentUser();
          const { user } = response;

          set({
            user,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to get user',
            isLoading: false
          });
          throw error;
        }
      },

      updateUser: async (client: ConduitApiClient, userData: UpdateUserRequest) => {
        try {
          set({ isLoading: true, error: null });
          const response = await client.updateUser(userData);
          const { user } = response;

          set({
            user,
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update user',
            isLoading: false
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          oidcUser: undefined,
          cognitoTokens: undefined
        });
      }
    }),
    {
      name: 'conduit-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        // Include OIDC/Cognito fields in persistence for merge compatibility
        oidcUser: state.oidcUser,
        cognitoTokens: state.cognitoTokens
      }),
    }
  )
);