import { create } from 'zustand';
import {
  ConduitApiClient,
  Article,
  ArticleQuery,
  FeedQuery,
  CreateArticleRequest,
  UpdateArticleRequest
} from '@conduit/transport';

interface ArticleState {
  articles: Article[];
  currentArticle: Article | null;
  feed: Article[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  selectedTag: string | null;
  viewMode: 'global' | 'feed' | 'tag';
}

interface ArticleActions {
  setArticles: (articles: Article[], totalCount: number) => void;
  setCurrentArticle: (article: Article | null) => void;
  setFeed: (articles: Article[], totalCount: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentPage: (page: number) => void;
  setSelectedTag: (tag: string | null) => void;
  setViewMode: (mode: 'global' | 'feed' | 'tag') => void;

  getArticles: (client: ConduitApiClient, query?: ArticleQuery) => Promise<void>;
  getFeed: (client: ConduitApiClient, query?: FeedQuery) => Promise<void>;
  getArticle: (client: ConduitApiClient, slug: string) => Promise<void>;
  createArticle: (client: ConduitApiClient, articleData: CreateArticleRequest) => Promise<Article>;
  updateArticle: (client: ConduitApiClient, slug: string, articleData: UpdateArticleRequest) => Promise<Article>;
  deleteArticle: (client: ConduitApiClient, slug: string) => Promise<void>;
  favoriteArticle: (client: ConduitApiClient, slug: string) => Promise<void>;
  unfavoriteArticle: (client: ConduitApiClient, slug: string) => Promise<void>;

  updateArticleInList: (updatedArticle: Article) => void;
  removeArticleFromList: (slug: string) => void;
  clearArticles: () => void;
}

type ArticleStore = ArticleState & ArticleActions;

export const useArticleStore = create<ArticleStore>((set, get) => ({
  articles: [],
  currentArticle: null,
  feed: [],
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  selectedTag: null,
  viewMode: 'global',

  setArticles: (articles: Article[], totalCount: number) => {
    set({ articles, totalCount });
  },

  setCurrentArticle: (article: Article | null) => {
    set({ currentArticle: article });
  },

  setFeed: (articles: Article[], totalCount: number) => {
    set({ feed: articles, totalCount });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
  },

  setSelectedTag: (tag: string | null) => {
    set({ selectedTag: tag });
  },

  setViewMode: (mode: 'global' | 'feed' | 'tag') => {
    set({ viewMode: mode });
  },

  getArticles: async (client: ConduitApiClient, query?: ArticleQuery) => {
    try {
      set({ isLoading: true, error: null });
      const response = await client.getArticles(query);

      set({
        articles: response.articles,
        totalCount: response.articlesCount,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch articles',
        isLoading: false
      });
      throw error;
    }
  },

  getFeed: async (client: ConduitApiClient, query?: FeedQuery) => {
    try {
      set({ isLoading: true, error: null });
      const response = await client.getFeed(query);

      set({
        feed: response.articles,
        totalCount: response.articlesCount,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch feed',
        isLoading: false
      });
      throw error;
    }
  },

  getArticle: async (client: ConduitApiClient, slug: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await client.getArticle(slug);

      set({
        currentArticle: response.article,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch article',
        isLoading: false
      });
      throw error;
    }
  },

  createArticle: async (client: ConduitApiClient, articleData: CreateArticleRequest) => {
    try {
      set({ isLoading: true, error: null });
      const response = await client.createArticle(articleData);

      const { articles } = get();
      set({
        articles: [response.article, ...articles],
        currentArticle: response.article,
        isLoading: false
      });

      return response.article;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create article',
        isLoading: false
      });
      throw error;
    }
  },

  updateArticle: async (client: ConduitApiClient, slug: string, articleData: UpdateArticleRequest) => {
    try {
      set({ isLoading: true, error: null });
      const response = await client.updateArticle(slug, articleData);

      get().updateArticleInList(response.article);
      set({
        currentArticle: response.article,
        isLoading: false
      });

      return response.article;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update article',
        isLoading: false
      });
      throw error;
    }
  },

  deleteArticle: async (client: ConduitApiClient, slug: string) => {
    try {
      set({ isLoading: true, error: null });
      await client.deleteArticle(slug);

      get().removeArticleFromList(slug);
      set({
        currentArticle: null,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete article',
        isLoading: false
      });
      throw error;
    }
  },

  favoriteArticle: async (client: ConduitApiClient, slug: string) => {
    try {
      const response = await client.favoriteArticle(slug);
      get().updateArticleInList(response.article);

      const { currentArticle } = get();
      if (currentArticle && currentArticle.slug === slug) {
        set({ currentArticle: response.article });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to favorite article'
      });
      throw error;
    }
  },

  unfavoriteArticle: async (client: ConduitApiClient, slug: string) => {
    try {
      const response = await client.unfavoriteArticle(slug);
      get().updateArticleInList(response.article);

      const { currentArticle } = get();
      if (currentArticle && currentArticle.slug === slug) {
        set({ currentArticle: response.article });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to unfavorite article'
      });
      throw error;
    }
  },

  updateArticleInList: (updatedArticle: Article) => {
    set((state) => ({
      articles: state.articles.map(article =>
        article.slug === updatedArticle.slug ? updatedArticle : article
      ),
      feed: state.feed.map(article =>
        article.slug === updatedArticle.slug ? updatedArticle : article
      )
    }));
  },

  removeArticleFromList: (slug: string) => {
    set((state) => ({
      articles: state.articles.filter(article => article.slug !== slug),
      feed: state.feed.filter(article => article.slug !== slug)
    }));
  },

  clearArticles: () => {
    set({
      articles: [],
      feed: [],
      currentArticle: null,
      totalCount: 0,
      currentPage: 1,
      selectedTag: null,
      viewMode: 'global'
    });
  }
}));