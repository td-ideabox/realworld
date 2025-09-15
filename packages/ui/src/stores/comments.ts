import { create } from 'zustand';
import { ConduitApiClient, Comment, CreateCommentRequest } from '@conduit/transport';

interface CommentState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  currentArticleSlug: string | null;
}

interface CommentActions {
  setComments: (comments: Comment[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentArticleSlug: (slug: string | null) => void;
  getComments: (client: ConduitApiClient, slug: string) => Promise<void>;
  createComment: (client: ConduitApiClient, slug: string, commentData: CreateCommentRequest) => Promise<Comment>;
  deleteComment: (client: ConduitApiClient, slug: string, commentId: number) => Promise<void>;
  addComment: (comment: Comment) => void;
  removeComment: (commentId: number) => void;
  clearComments: () => void;
}

type CommentStore = CommentState & CommentActions;

export const useCommentStore = create<CommentStore>((set, get) => ({
  comments: [],
  isLoading: false,
  error: null,
  currentArticleSlug: null,

  setComments: (comments: Comment[]) => {
    set({ comments });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setCurrentArticleSlug: (slug: string | null) => {
    set({ currentArticleSlug: slug });
  },

  getComments: async (client: ConduitApiClient, slug: string) => {
    try {
      set({ isLoading: true, error: null, currentArticleSlug: slug });
      const response = await client.getComments(slug);

      set({
        comments: response.comments,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch comments',
        isLoading: false
      });
      throw error;
    }
  },

  createComment: async (client: ConduitApiClient, slug: string, commentData: CreateCommentRequest) => {
    try {
      set({ error: null });
      const response = await client.createComment(slug, commentData);

      const { comments } = get();
      set({
        comments: [response.comment, ...comments]
      });

      return response.comment;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create comment'
      });
      throw error;
    }
  },

  deleteComment: async (client: ConduitApiClient, slug: string, commentId: number) => {
    try {
      set({ error: null });
      await client.deleteComment(slug, commentId);

      get().removeComment(commentId);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete comment'
      });
      throw error;
    }
  },

  addComment: (comment: Comment) => {
    const { comments } = get();
    set({
      comments: [comment, ...comments]
    });
  },

  removeComment: (commentId: number) => {
    set((state) => ({
      comments: state.comments.filter(comment => comment.id !== commentId)
    }));
  },

  clearComments: () => {
    set({
      comments: [],
      currentArticleSlug: null,
      error: null
    });
  }
}));