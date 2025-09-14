import { z } from 'zod';

// User-related schemas
export const UserSchema = z.object({
  email: z.string().email(),
  token: z.string(),
  username: z.string(),
  bio: z.string().nullable(),
  image: z.string().nullable(),
});

export const ProfileSchema = z.object({
  username: z.string(),
  bio: z.string().nullable(),
  image: z.string().nullable(),
  following: z.boolean(),
});

export const ArticleSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  body: z.string(),
  tagList: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  favorited: z.boolean(),
  favoritesCount: z.number(),
  author: ProfileSchema,
});

export const CommentSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  body: z.string(),
  author: ProfileSchema,
});

// Request schemas
export const LoginRequestSchema = z.object({
  user: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

export const RegisterRequestSchema = z.object({
  user: z.object({
    username: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

export const UpdateUserRequestSchema = z.object({
  user: z.object({
    email: z.string().email().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    image: z.string().optional(),
    bio: z.string().optional(),
  }),
});

export const CreateArticleRequestSchema = z.object({
  article: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    body: z.string().min(1),
    tagList: z.array(z.string()).optional(),
  }),
});

export const UpdateArticleRequestSchema = z.object({
  article: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    body: z.string().optional(),
    tagList: z.array(z.string()).optional(),
  }),
});

export const CreateCommentRequestSchema = z.object({
  comment: z.object({
    body: z.string().min(1),
  }),
});

// Response schemas
export const UserResponseSchema = z.object({
  user: UserSchema,
});

export const ProfileResponseSchema = z.object({
  profile: ProfileSchema,
});

export const ArticleResponseSchema = z.object({
  article: ArticleSchema,
});

export const ArticlesResponseSchema = z.object({
  articles: z.array(ArticleSchema),
  articlesCount: z.number(),
});

export const CommentResponseSchema = z.object({
  comment: CommentSchema,
});

export const CommentsResponseSchema = z.object({
  comments: z.array(CommentSchema),
});

export const TagsResponseSchema = z.object({
  tags: z.array(z.string()),
});

// Error schemas
export const ErrorSchema = z.object({
  errors: z.record(z.array(z.string())),
});

// Query parameter schemas
export const ArticleQuerySchema = z.object({
  tag: z.string().optional(),
  author: z.string().optional(),
  favorited: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
}).partial().extend({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

export const FeedQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
}).partial().extend({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});