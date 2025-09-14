import { z } from 'zod';
import {
  UserSchema,
  ProfileSchema,
  ArticleSchema,
  CommentSchema,
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
  ArticleQuerySchema,
  FeedQuerySchema,
} from './schemas';

// Core types
export type User = z.infer<typeof UserSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type Article = z.infer<typeof ArticleSchema>;
export type Comment = z.infer<typeof CommentSchema>;

// Request types
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
export type CreateArticleRequest = z.infer<typeof CreateArticleRequestSchema>;
export type UpdateArticleRequest = z.infer<typeof UpdateArticleRequestSchema>;
export type CreateCommentRequest = z.infer<typeof CreateCommentRequestSchema>;

// Response types
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;
export type ArticleResponse = z.infer<typeof ArticleResponseSchema>;
export type ArticlesResponse = z.infer<typeof ArticlesResponseSchema>;
export type CommentResponse = z.infer<typeof CommentResponseSchema>;
export type CommentsResponse = z.infer<typeof CommentsResponseSchema>;
export type TagsResponse = z.infer<typeof TagsResponseSchema>;

// Error types
export type ApiError = z.infer<typeof ErrorSchema>;

// Query parameter types
export type ArticleQuery = z.infer<typeof ArticleQuerySchema>;
export type FeedQuery = z.infer<typeof FeedQuerySchema>;

// API client configuration
export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}

// HTTP method types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

// API error response
export interface ApiErrorResponse {
  error: ApiError;
  status: number;
  message?: string;
}