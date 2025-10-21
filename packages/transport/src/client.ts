import {
  ApiClientConfig,
  ApiResponse,
  ApiErrorResponse,
  HttpMethod,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  CreateArticleRequest,
  UpdateArticleRequest,
  CreateCommentRequest,
  UserResponse,
  ProfileResponse,
  ArticleResponse,
  ArticlesResponse,
  CommentResponse,
  CommentsResponse,
  TagsResponse,
  ArticleQuery,
  FeedQuery,
} from './types.js';
import {
  LoginRequestSchema,
  RegisterRequestSchema,
  UpdateUserRequestSchema,
  CreateArticleRequestSchema,
  UpdateArticleRequestSchema,
  CreateCommentRequestSchema,
  UserResponseSchema,
  ProfileResponseSchema,
  ArticleResponseSchema,
  ArticlesResponseSchema,
  CommentResponseSchema,
  CommentsResponseSchema,
  TagsResponseSchema,
  ErrorSchema,
} from './schemas.js';

export class ConduitApiClient {
  private baseUrl: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private token: string | null = null;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.timeout = config.timeout || 10000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.defaultHeaders,
    };
  }

  setToken(token: string | null): void {
    this.token = token;
  }

  private getHeaders(): Record<string, string> {
    const headers = { ...this.defaultHeaders };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }

  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    data?: unknown,
    queryParams?: Record<string, string | number | undefined>
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}/api${endpoint}`);

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const config: RequestInit = {
      method,
      headers: this.getHeaders(),
      signal: AbortSignal.timeout(this.timeout),
    };

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url.toString(), config);
      const responseData = await response.json();

      if (!response.ok) {
        const error = ErrorSchema.parse(responseData);
        const apiError: ApiErrorResponse = {
          error,
          status: response.status,
          message: response.statusText,
        };
        throw apiError;
      }

      return {
        data: responseData as T,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<UserResponse> {
    const validatedCredentials = LoginRequestSchema.parse(credentials);
    const response = await this.request<UserResponse>('POST', '/users/login', validatedCredentials);
    const validatedResponse = UserResponseSchema.parse(response.data);
    this.setToken(validatedResponse.user.token);
    return validatedResponse;
  }

  async register(userData: RegisterRequest): Promise<UserResponse> {
    const validatedUserData = RegisterRequestSchema.parse(userData);
    const response = await this.request<UserResponse>('POST', '/users', validatedUserData);
    const validatedResponse = UserResponseSchema.parse(response.data);
    this.setToken(validatedResponse.user.token);
    return validatedResponse;
  }

  // User methods
  async getCurrentUser(): Promise<UserResponse> {
    const response = await this.request<UserResponse>('GET', '/user');
    return UserResponseSchema.parse(response.data);
  }

  async updateUser(userData: UpdateUserRequest): Promise<UserResponse> {
    const validatedUserData = UpdateUserRequestSchema.parse(userData);
    const response = await this.request<UserResponse>('PUT', '/user', validatedUserData);
    return UserResponseSchema.parse(response.data);
  }

  // Profile methods
  async getProfile(username: string): Promise<ProfileResponse> {
    const response = await this.request<ProfileResponse>('GET', `/profiles/${username}`);
    return ProfileResponseSchema.parse(response.data);
  }

  async followUser(username: string): Promise<ProfileResponse> {
    const response = await this.request<ProfileResponse>('POST', `/profiles/${username}/follow`);
    return ProfileResponseSchema.parse(response.data);
  }

  async unfollowUser(username: string): Promise<ProfileResponse> {
    const response = await this.request<ProfileResponse>('DELETE', `/profiles/${username}/follow`);
    return ProfileResponseSchema.parse(response.data);
  }

  // Article methods
  async getArticles(query?: ArticleQuery): Promise<ArticlesResponse> {
    const response = await this.request<ArticlesResponse>('GET', '/articles', undefined, query);
    return ArticlesResponseSchema.parse(response.data);
  }

  async getFeed(query?: FeedQuery): Promise<ArticlesResponse> {
    const response = await this.request<ArticlesResponse>('GET', '/articles/feed', undefined, query);
    return ArticlesResponseSchema.parse(response.data);
  }

  async getArticle(slug: string): Promise<ArticleResponse> {
    const response = await this.request<ArticleResponse>('GET', `/articles/${slug}`);
    return ArticleResponseSchema.parse(response.data);
  }

  async createArticle(articleData: CreateArticleRequest): Promise<ArticleResponse> {
    const validatedArticleData = CreateArticleRequestSchema.parse(articleData);
    const response = await this.request<ArticleResponse>('POST', '/articles', validatedArticleData);
    return ArticleResponseSchema.parse(response.data);
  }

  async updateArticle(slug: string, articleData: UpdateArticleRequest): Promise<ArticleResponse> {
    const validatedArticleData = UpdateArticleRequestSchema.parse(articleData);
    const response = await this.request<ArticleResponse>('PUT', `/articles/${slug}`, validatedArticleData);
    return ArticleResponseSchema.parse(response.data);
  }

  async deleteArticle(slug: string): Promise<void> {
    await this.request('DELETE', `/articles/${slug}`);
  }

  async favoriteArticle(slug: string): Promise<ArticleResponse> {
    const response = await this.request<ArticleResponse>('POST', `/articles/${slug}/favorite`);
    return ArticleResponseSchema.parse(response.data);
  }

  async unfavoriteArticle(slug: string): Promise<ArticleResponse> {
    const response = await this.request<ArticleResponse>('DELETE', `/articles/${slug}/favorite`);
    return ArticleResponseSchema.parse(response.data);
  }

  // Comment methods
  async getComments(slug: string): Promise<CommentsResponse> {
    const response = await this.request<CommentsResponse>('GET', `/articles/${slug}/comments`);
    return CommentsResponseSchema.parse(response.data);
  }

  async createComment(slug: string, commentData: CreateCommentRequest): Promise<CommentResponse> {
    const validatedCommentData = CreateCommentRequestSchema.parse(commentData);
    const response = await this.request<CommentResponse>('POST', `/articles/${slug}/comments`, validatedCommentData);
    return CommentResponseSchema.parse(response.data);
  }

  async deleteComment(slug: string, commentId: number): Promise<void> {
    await this.request('DELETE', `/articles/${slug}/comments/${commentId}`);
  }

  // Tags methods
  async getTags(): Promise<TagsResponse> {
    const response = await this.request<TagsResponse>('GET', '/tags');
    return TagsResponseSchema.parse(response.data);
  }
}