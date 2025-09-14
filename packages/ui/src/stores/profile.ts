import { create } from 'zustand';
import { ConduitApiClient, Profile } from '@conduit/transport';

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
}

interface ProfileActions {
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getProfile: (client: ConduitApiClient, username: string) => Promise<void>;
  followUser: (client: ConduitApiClient, username: string) => Promise<void>;
  unfollowUser: (client: ConduitApiClient, username: string) => Promise<void>;
  clearProfile: () => void;
}

type ProfileStore = ProfileState & ProfileActions;

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  setProfile: (profile: Profile | null) => {
    set({ profile });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  getProfile: async (client: ConduitApiClient, username: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await client.getProfile(username);

      set({
        profile: response.profile,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
        isLoading: false
      });
      throw error;
    }
  },

  followUser: async (client: ConduitApiClient, username: string) => {
    try {
      set({ error: null });
      const response = await client.followUser(username);

      set({
        profile: response.profile
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to follow user'
      });
      throw error;
    }
  },

  unfollowUser: async (client: ConduitApiClient, username: string) => {
    try {
      set({ error: null });
      const response = await client.unfollowUser(username);

      set({
        profile: response.profile
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to unfollow user'
      });
      throw error;
    }
  },

  clearProfile: () => {
    set({
      profile: null,
      error: null
    });
  }
}));