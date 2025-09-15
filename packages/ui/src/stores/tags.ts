import { create } from 'zustand';
import { ConduitApiClient } from '@conduit/transport';

interface TagState {
  tags: string[];
  popularTags: string[];
  isLoading: boolean;
  error: string | null;
}

interface TagActions {
  setTags: (tags: string[]) => void;
  setPopularTags: (tags: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getTags: (client: ConduitApiClient) => Promise<void>;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  clearTags: () => void;
}

type TagStore = TagState & TagActions;

export const useTagStore = create<TagStore>((set, get) => ({
  tags: [],
  popularTags: [],
  isLoading: false,
  error: null,

  setTags: (tags: string[]) => {
    set({ tags });
  },

  setPopularTags: (tags: string[]) => {
    set({ popularTags: tags });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  getTags: async (client: ConduitApiClient) => {
    try {
      set({ isLoading: true, error: null });
      const response = await client.getTags();

      set({
        tags: response.tags,
        popularTags: response.tags.slice(0, 10),
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch tags',
        isLoading: false
      });
      throw error;
    }
  },

  addTag: (tag: string) => {
    const { tags } = get();
    if (!tags.includes(tag)) {
      set({
        tags: [...tags, tag]
      });
    }
  },

  removeTag: (tag: string) => {
    set((state) => ({
      tags: state.tags.filter(t => t !== tag)
    }));
  },

  clearTags: () => {
    set({
      tags: [],
      popularTags: [],
      error: null
    });
  }
}));