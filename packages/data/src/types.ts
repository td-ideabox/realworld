import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { users, articles, comments, tags, articleTags, favorites, follows } from './schema.js';

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Article = InferSelectModel<typeof articles>;
export type NewArticle = InferInsertModel<typeof articles>;

export type Comment = InferSelectModel<typeof comments>;
export type NewComment = InferInsertModel<typeof comments>;

export type Tag = InferSelectModel<typeof tags>;
export type NewTag = InferInsertModel<typeof tags>;

export type ArticleTag = InferSelectModel<typeof articleTags>;
export type NewArticleTag = InferInsertModel<typeof articleTags>;

export type Favorite = InferSelectModel<typeof favorites>;
export type NewFavorite = InferInsertModel<typeof favorites>;

export type Follow = InferSelectModel<typeof follows>;
export type NewFollow = InferInsertModel<typeof follows>;

export interface UserWithStats extends User {
  followingCount?: number;
  followersCount?: number;
  articlesCount?: number;
}

export interface ArticleWithAuthor extends Article {
  author: User;
  tagList: string[];
  favorited?: boolean;
}

export interface CommentWithAuthor extends Comment {
  author: User;
}

export interface ProfileData {
  username: string;
  bio: string | null;
  image: string | null;
  following: boolean;
}