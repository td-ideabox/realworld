import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  useApiClientStore,
  useAuthStore,
  useArticleStore,
  useProfileStore,
  useCommentStore,
  useTagStore
} from '../stores';
import {
  UpdateUserRequest,
  CreateArticleRequest,
  UpdateArticleRequest,
  CreateCommentRequest,
  ArticleQuery,
  FeedQuery
} from '@conduit/transport';
import { useAuthToken } from './useAuthToken';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { getClient } = useApiClientStore();
  const authStore = useAuthStore();
  const {
    getCurrentUser: getCurrentUserStore,
    updateUser: updateUserStore,
    clearAuth,
    // OIDC fields now actively used
    oidcUser,
    cognitoTokens
  } = authStore;

  // Get OIDC auth functions
  const { login: oidcLogin, logout: oidcLogout } = useAuthToken();

  const getCurrentUserQuery = useQuery({
    queryKey: ['user'],
    queryFn: () => getCurrentUserStore(getClient()),
    // Enable if we have either regular token or OIDC tokens (for merge compatibility)
    enabled: !!(useAuthStore.getState().token || useAuthStore.getState().cognitoTokens?.accessToken),
  });

  const updateUserMutation = useMutation({
    mutationFn: (userData: UpdateUserRequest) => updateUserStore(getClient(), userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const logout = () => {
    clearAuth();
    oidcLogout();
    queryClient.clear();
  };

  return {
    // OIDC auth methods
    login: oidcLogin,
    logout,
    getCurrentUser: getCurrentUserQuery,
    updateUser: updateUserMutation,
    // Expose OIDC fields
    oidcUser,
    cognitoTokens,
    // Direct access to auth store
    authStore,
  };
};

export const useArticles = () => {
  const queryClient = useQueryClient();
  const { getClient } = useApiClientStore();
  const {
    getArticles,
    getFeed,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    favoriteArticle,
    unfavoriteArticle
  } = useArticleStore();

  const articlesQuery = (query?: ArticleQuery) => useQuery({
    queryKey: ['articles', query],
    queryFn: () => getArticles(getClient(), query),
  });

  const feedQuery = (query?: FeedQuery) => useQuery({
    queryKey: ['feed', query],
    queryFn: () => getFeed(getClient(), query),
    enabled: !!useAuthStore.getState().isAuthenticated,
  });

  const articleQuery = (slug: string) => useQuery({
    queryKey: ['article', slug],
    queryFn: () => getArticle(getClient(), slug),
    enabled: !!slug,
  });

  const createArticleMutation = useMutation({
    mutationFn: (articleData: CreateArticleRequest) => createArticle(getClient(), articleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: ({ slug, articleData }: { slug: string; articleData: UpdateArticleRequest }) =>
      updateArticle(getClient(), slug, articleData),
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: ['article', slug] });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: (slug: string) => deleteArticle(getClient(), slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const favoriteArticleMutation = useMutation({
    mutationFn: (slug: string) => favoriteArticle(getClient(), slug),
    onSuccess: (_, slug) => {
      queryClient.invalidateQueries({ queryKey: ['article', slug] });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const unfavoriteArticleMutation = useMutation({
    mutationFn: (slug: string) => unfavoriteArticle(getClient(), slug),
    onSuccess: (_, slug) => {
      queryClient.invalidateQueries({ queryKey: ['article', slug] });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  return {
    useArticles: articlesQuery,
    useFeed: feedQuery,
    useArticle: articleQuery,
    createArticle: createArticleMutation,
    updateArticle: updateArticleMutation,
    deleteArticle: deleteArticleMutation,
    favoriteArticle: favoriteArticleMutation,
    unfavoriteArticle: unfavoriteArticleMutation,
  };
};

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { getClient } = useApiClientStore();
  const { getProfile, followUser, unfollowUser } = useProfileStore();

  const profileQuery = (username: string) => useQuery({
    queryKey: ['profile', username],
    queryFn: () => getProfile(getClient(), username),
    enabled: !!username,
  });

  const followUserMutation = useMutation({
    mutationFn: (username: string) => followUser(getClient(), username),
    onSuccess: (_, username) => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
    },
  });

  const unfollowUserMutation = useMutation({
    mutationFn: (username: string) => unfollowUser(getClient(), username),
    onSuccess: (_, username) => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
    },
  });

  return {
    useProfile: profileQuery,
    followUser: followUserMutation,
    unfollowUser: unfollowUserMutation,
  };
};

export const useComments = () => {
  const queryClient = useQueryClient();
  const { getClient } = useApiClientStore();
  const { getComments, createComment, deleteComment } = useCommentStore();

  const commentsQuery = (slug: string) => useQuery({
    queryKey: ['comments', slug],
    queryFn: () => getComments(getClient(), slug),
    enabled: !!slug,
  });

  const createCommentMutation = useMutation({
    mutationFn: ({ slug, commentData }: { slug: string; commentData: CreateCommentRequest }) =>
      createComment(getClient(), slug, commentData),
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', slug] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: ({ slug, commentId }: { slug: string; commentId: number }) =>
      deleteComment(getClient(), slug, commentId),
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', slug] });
    },
  });

  return {
    useComments: commentsQuery,
    createComment: createCommentMutation,
    deleteComment: deleteCommentMutation,
  };
};

export const useTags = () => {
  const { getClient } = useApiClientStore();
  const { getTags } = useTagStore();

  const tagsQuery = useQuery({
    queryKey: ['tags'],
    queryFn: () => getTags(getClient()),
    staleTime: 5 * 60 * 1000, // Tags don't change often, cache for 5 minutes
  });

  return {
    useTags: tagsQuery,
  };
};