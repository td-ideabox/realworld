import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConduitApiClient, User, LoginRequest, RegisterRequest, UpdateUserRequest } from '@conduit/transport';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // OIDC/Cognito compatibility fields - will be used when merging with Cognito branch
  oidcUser?: any;
  cognitoTokens?: {
    idToken?: string;
    accessToken?: string;
    refreshToken?: string;
  };
}

interface AuthActions {
  // Core auth state management (will be compatible with OIDC)
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  logout: () => void;

  // Conduit API specific methods (may be replaced/augmented with OIDC)
  login: (client: ConduitApiClient, credentials: LoginRequest) => Promise<void>;
  register: (client: ConduitApiClient, userData: RegisterRequest) => Promise<void>;
  getCurrentUser: (client: ConduitApiClient) => Promise<void>;
  updateUser: (client: ConduitApiClient, userData: UpdateUserRequest) => Promise<void>;

  // Future OIDC/Cognito methods (stubbed for merge compatibility)
  setCognitoTokens?: (tokens: any) => void;
  setOidcUser?: (oidcUser: any) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      // OIDC/Cognito fields initialized as undefined
      oidcUser: undefined,
      cognitoTokens: undefined,

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        set({ token });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearAuth: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
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
            error: error instanceof Error ? error.message : 'Login failed',
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
            error: error instanceof Error ? error.message : 'Registration failed',
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
          // Clear OIDC/Cognito fields on logout
          oidcUser: undefined,
          cognitoTokens: undefined
        });
      },

      // Stubbed OIDC/Cognito methods for future merge compatibility
      setCognitoTokens: (tokens: any) => {
        set({ cognitoTokens: tokens });
      },

      setOidcUser: (oidcUser: any) => {
        set({ oidcUser });
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