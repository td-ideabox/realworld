import { singleton, inject } from "tsyringe";
import { eq, and, or, like, desc, count } from "@conduit/data";
import { Article, NewArticle, ArticleWithAuthor, articles, users, tags, articleTags, favorites } from "@conduit/data";
import { IDatabaseService } from "../services/database.service.js";

export interface ArticleFilters {
  tag?: string;
  author?: string;
  favorited?: string;
  limit?: number;
  offset?: number;
}

export interface IArticleRepository {
  findById(id: number): Promise<Article | null>;
  findBySlug(slug: string): Promise<Article | null>;
  findWithAuthor(slug: string): Promise<ArticleWithAuthor | null>;
  create(articleData: NewArticle): Promise<Article>;
  update(id: number, articleData: Partial<NewArticle>): Promise<Article | null>;
  delete(id: number): Promise<boolean>;
  findMany(filters: ArticleFilters): Promise<ArticleWithAuthor[]>;
  findFeedArticles(userId: number, limit?: number, offset?: number): Promise<ArticleWithAuthor[]>;
  incrementFavoriteCount(id: number): Promise<void>;
  decrementFavoriteCount(id: number): Promise<void>;
  existsBySlug(slug: string): Promise<boolean>;
  getArticleCount(filters: Omit<ArticleFilters, 'limit' | 'offset'>): Promise<number>;
}

@singleton()
export class ArticleRepository implements IArticleRepository {
  constructor(
    @inject("IDatabaseService") private databaseService: IDatabaseService
  ) {}

  async findById(id: number): Promise<Article | null> {
    const db = this.databaseService.getDatabase();
    const result = await db.select().from(articles).where(eq(articles.id, id)).get();
    return result || null;
  }

  async findBySlug(slug: string): Promise<Article | null> {
    const db = this.databaseService.getDatabase();
    const result = await db.select().from(articles).where(eq(articles.slug, slug)).get();
    return result || null;
  }

  async findWithAuthor(slug: string): Promise<ArticleWithAuthor | null> {
    const db = this.databaseService.getDatabase();
    const result = await db
      .select({
        id: articles.id,
        slug: articles.slug,
        title: articles.title,
        description: articles.description,
        body: articles.body,
        authorId: articles.authorId,
        favoritesCount: articles.favoritesCount,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        author: {
          id: users.id,
          username: users.username,
          email: users.email,
          bio: users.bio,
          image: users.image,
          password: users.password,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        }
      })
      .from(articles)
      .innerJoin(users, eq(articles.authorId, users.id))
      .where(eq(articles.slug, slug))
      .get();

    if (!result) return null;

    // Get tags for this article
    const articleTagsResult = await db
      .select({ name: tags.name })
      .from(articleTags)
      .innerJoin(tags, eq(articleTags.tagId, tags.id))
      .where(eq(articleTags.articleId, result.id))
      .all();

    return {
      ...result,
      tagList: articleTagsResult.map(t => t.name),
      favorited: false // Will be set by service layer based on current user
    };
  }

  async create(articleData: NewArticle): Promise<Article> {
    const db = this.databaseService.getDatabase();
    const result = await db.insert(articles).values(articleData).returning().get();
    return result;
  }

  async update(id: number, articleData: Partial<NewArticle>): Promise<Article | null> {
    const db = this.databaseService.getDatabase();
    const result = await db
      .update(articles)
      .set({ ...articleData, updatedAt: new Date().toISOString() })
      .where(eq(articles.id, id))
      .returning()
      .get();
    return result || null;
  }

  async delete(id: number): Promise<boolean> {
    const db = this.databaseService.getDatabase();
    const result = await db.delete(articles).where(eq(articles.id, id)).returning().get();
    return !!result;
  }

  async findMany(filters: ArticleFilters): Promise<ArticleWithAuthor[]> {
    const db = this.databaseService.getDatabase();
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;

    let query = db
      .select({
        id: articles.id,
        slug: articles.slug,
        title: articles.title,
        description: articles.description,
        body: articles.body,
        authorId: articles.authorId,
        favoritesCount: articles.favoritesCount,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        author: {
          id: users.id,
          username: users.username,
          email: users.email,
          bio: users.bio,
          image: users.image,
          password: users.password,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        }
      })
      .from(articles)
      .innerJoin(users, eq(articles.authorId, users.id))
      .orderBy(desc(articles.createdAt))
      .limit(limit)
      .offset(offset);

    if (filters.author) {
      query = query.where(eq(users.username, filters.author));
    }

    const results = await query.all();

    // Get tags for all articles
    const articlesWithTags = await Promise.all(
      results.map(async (article) => {
        const articleTagsResult = await db
          .select({ name: tags.name })
          .from(articleTags)
          .innerJoin(tags, eq(articleTags.tagId, tags.id))
          .where(eq(articleTags.articleId, article.id))
          .all();

        return {
          ...article,
          tagList: articleTagsResult.map(t => t.name),
          favorited: false
        };
      })
    );

    return articlesWithTags;
  }

  async findFeedArticles(userId: number, limit = 20, offset = 0): Promise<ArticleWithAuthor[]> {
    // TODO: Implement feed based on followed users when follow repository is available
    // For now, return recent articles
    return this.findMany({ limit, offset });
  }

  async incrementFavoriteCount(id: number): Promise<void> {
    const db = this.databaseService.getDatabase();
    await db
      .update(articles)
      .set({
        favoritesCount: count(favorites.id),
        updatedAt: new Date().toISOString()
      })
      .where(eq(articles.id, id));
  }

  async decrementFavoriteCount(id: number): Promise<void> {
    const db = this.databaseService.getDatabase();
    const article = await this.findById(id);
    if (article && article.favoritesCount > 0) {
      await db
        .update(articles)
        .set({
          favoritesCount: Math.max(0, article.favoritesCount - 1),
          updatedAt: new Date().toISOString()
        })
        .where(eq(articles.id, id));
    }
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const article = await this.findBySlug(slug);
    return !!article;
  }

  async getArticleCount(filters: Omit<ArticleFilters, 'limit' | 'offset'>): Promise<number> {
    const db = this.databaseService.getDatabase();

    let query = db
      .select({ count: count() })
      .from(articles)
      .innerJoin(users, eq(articles.authorId, users.id));

    if (filters.author) {
      query = query.where(eq(users.username, filters.author));
    }

    const result = await query.get();
    return result?.count || 0;
  }
}