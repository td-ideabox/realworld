import { singleton, inject } from "tsyringe";
import type { IArticleRepository } from "../repositories/article.repository.js";
import type { ArticleFilters } from "../repositories/article.repository.js";
import type { ITagRepository } from "../repositories/tag.repository.js";
import type { IFavoriteRepository } from "../repositories/favorite.repository.js";
import type { IFollowRepository } from "../repositories/follow.repository.js";
import { Article, NewArticle, ArticleWithAuthor } from "@conduit/data";

export interface ArticleWithMetadata extends Omit<ArticleWithAuthor, 'author'> {
  author: {
    username: string;
    bio: string | null;
    image: string | null;
    following: boolean;
  };
}

export interface IArticleService {
  getArticles(filters: ArticleFilters, currentUserId?: number): Promise<{ articles: ArticleWithMetadata[], articlesCount: number }>;
  getFeedArticles(userId: number, limit?: number, offset?: number): Promise<{ articles: ArticleWithMetadata[], articlesCount: number }>;
  getArticleBySlug(slug: string, currentUserId?: number): Promise<ArticleWithMetadata | null>;
  createArticle(authorId: number, articleData: Omit<NewArticle, 'authorId' | 'slug'>, tagList?: string[]): Promise<ArticleWithMetadata>;
  updateArticle(slug: string, authorId: number, articleData: Partial<Omit<NewArticle, 'authorId' | 'slug'>>): Promise<ArticleWithMetadata | null>;
  deleteArticle(slug: string, authorId: number): Promise<boolean>;
  favoriteArticle(slug: string, userId: number): Promise<ArticleWithMetadata | null>;
  unfavoriteArticle(slug: string, userId: number): Promise<ArticleWithMetadata | null>;
  generateSlug(title: string): string;
}

@singleton()
export class ArticleService implements IArticleService {
  constructor(
    @inject("IArticleRepository") private articleRepository: IArticleRepository,
    @inject("ITagRepository") private tagRepository: ITagRepository,
    @inject("IFavoriteRepository") private favoriteRepository: IFavoriteRepository,
    @inject("IFollowRepository") private followRepository: IFollowRepository
  ) {}

  async getArticles(filters: ArticleFilters, currentUserId?: number): Promise<{ articles: ArticleWithMetadata[], articlesCount: number }> {
    const articles = await this.articleRepository.findMany(filters);
    const articlesCount = await this.articleRepository.getArticleCount(filters);

    const articlesWithMetadata = await Promise.all(
      articles.map(article => this.enrichArticleWithMetadata(article, currentUserId))
    );

    return { articles: articlesWithMetadata, articlesCount };
  }

  async getFeedArticles(userId: number, limit = 20, offset = 0): Promise<{ articles: ArticleWithMetadata[], articlesCount: number }> {
    const articles = await this.articleRepository.findFeedArticles(userId, limit, offset);

    const articlesWithMetadata = await Promise.all(
      articles.map(article => this.enrichArticleWithMetadata(article, userId))
    );

    // For now, return the same count as articles length
    // In a real implementation, you'd have a separate count query for feed
    return { articles: articlesWithMetadata, articlesCount: articlesWithMetadata.length };
  }

  async getArticleBySlug(slug: string, currentUserId?: number): Promise<ArticleWithMetadata | null> {
    const article = await this.articleRepository.findWithAuthor(slug);

    if (!article) {
      return null;
    }

    return this.enrichArticleWithMetadata(article, currentUserId);
  }

  async createArticle(authorId: number, articleData: Omit<NewArticle, 'authorId' | 'slug'>, tagList: string[] = []): Promise<ArticleWithMetadata> {
    const slug = this.generateSlug(articleData.title);

    // Check if slug already exists
    const existingArticle = await this.articleRepository.existsBySlug(slug);
    if (existingArticle) {
      throw new Error("Article with this title already exists");
    }

    const newArticle = await this.articleRepository.create({
      ...articleData,
      authorId,
      slug
    });

    // Handle tags
    if (tagList.length > 0) {
      await this.tagRepository.addTagsToArticle(newArticle.id, tagList);
    }

    // Get the full article with author
    const articleWithAuthor = await this.articleRepository.findWithAuthor(slug);
    if (!articleWithAuthor) {
      throw new Error("Failed to retrieve created article");
    }

    return this.enrichArticleWithMetadata(articleWithAuthor);
  }

  async updateArticle(slug: string, authorId: number, articleData: Partial<Omit<NewArticle, 'authorId' | 'slug'>>): Promise<ArticleWithMetadata | null> {
    const existingArticle = await this.articleRepository.findBySlug(slug);

    if (!existingArticle) {
      return null;
    }

    if (existingArticle.authorId !== authorId) {
      throw new Error("Not authorized to update this article");
    }

    let updateData: any = { ...articleData };

    // Generate new slug if title is being updated
    if (articleData.title && articleData.title !== existingArticle.title) {
      updateData.slug = this.generateSlug(articleData.title);
    }

    const updatedArticle = await this.articleRepository.update(existingArticle.id, updateData);

    if (!updatedArticle) {
      return null;
    }

    const articleWithAuthor = await this.articleRepository.findWithAuthor(updatedArticle.slug);
    if (!articleWithAuthor) {
      return null;
    }

    return this.enrichArticleWithMetadata(articleWithAuthor, authorId);
  }

  async deleteArticle(slug: string, authorId: number): Promise<boolean> {
    const article = await this.articleRepository.findBySlug(slug);

    if (!article) {
      return false;
    }

    if (article.authorId !== authorId) {
      throw new Error("Not authorized to delete this article");
    }

    return this.articleRepository.delete(article.id);
  }

  async favoriteArticle(slug: string, userId: number): Promise<ArticleWithMetadata | null> {
    const article = await this.articleRepository.findBySlug(slug);

    if (!article) {
      return null;
    }

    const existingFavorite = await this.favoriteRepository.isFavorited(userId, article.id);
    if (!existingFavorite) {
      await this.favoriteRepository.create({ userId, articleId: article.id });
      await this.articleRepository.incrementFavoriteCount(article.id);
    }

    const updatedArticle = await this.articleRepository.findWithAuthor(slug);
    if (!updatedArticle) {
      return null;
    }

    return this.enrichArticleWithMetadata(updatedArticle, userId);
  }

  async unfavoriteArticle(slug: string, userId: number): Promise<ArticleWithMetadata | null> {
    const article = await this.articleRepository.findBySlug(slug);

    if (!article) {
      return null;
    }

    const existingFavorite = await this.favoriteRepository.isFavorited(userId, article.id);
    if (existingFavorite) {
      await this.favoriteRepository.deleteByUserAndArticle(userId, article.id);
      await this.articleRepository.decrementFavoriteCount(article.id);
    }

    const updatedArticle = await this.articleRepository.findWithAuthor(slug);
    if (!updatedArticle) {
      return null;
    }

    return this.enrichArticleWithMetadata(updatedArticle, userId);
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async enrichArticleWithMetadata(article: ArticleWithAuthor, currentUserId?: number): Promise<ArticleWithMetadata> {
    let favorited = false;
    let following = false;

    if (currentUserId) {
      favorited = await this.favoriteRepository.isFavorited(currentUserId, article.id);
      following = await this.followRepository.isFollowing(currentUserId, article.author.id);
    }

    return {
      ...article,
      favorited,
      author: {
        username: article.author.username,
        bio: article.author.bio,
        image: article.author.image,
        following
      }
    };
  }
}