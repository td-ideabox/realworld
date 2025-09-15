import { singleton, inject } from "tsyringe";
import { eq, and } from "@conduit/data";
import { Favorite, NewFavorite, favorites } from "@conduit/data";
import type { IDatabaseService } from "../services/database.service.js";

export interface IFavoriteRepository {
  findById(id: number): Promise<Favorite | null>;
  findByUserAndArticle(userId: number, articleId: number): Promise<Favorite | null>;
  findByUserId(userId: number): Promise<Favorite[]>;
  findByArticleId(articleId: number): Promise<Favorite[]>;
  create(favoriteData: NewFavorite): Promise<Favorite>;
  delete(id: number): Promise<boolean>;
  deleteByUserAndArticle(userId: number, articleId: number): Promise<boolean>;
  isFavorited(userId: number, articleId: number): Promise<boolean>;
  getFavoriteCount(articleId: number): Promise<number>;
}

@singleton()
export class FavoriteRepository implements IFavoriteRepository {
  constructor(
    @inject("IDatabaseService") private databaseService: IDatabaseService
  ) {}

  async findById(id: number): Promise<Favorite | null> {
    const db = this.databaseService.getDatabase();
    const result = await db.select().from(favorites).where(eq(favorites.id, id)).get();
    return result || null;
  }

  async findByUserAndArticle(userId: number, articleId: number): Promise<Favorite | null> {
    const db = this.databaseService.getDatabase();
    const result = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.articleId, articleId)))
      .get();
    return result || null;
  }

  async findByUserId(userId: number): Promise<Favorite[]> {
    const db = this.databaseService.getDatabase();
    const results = await db.select().from(favorites).where(eq(favorites.userId, userId)).all();
    return results;
  }

  async findByArticleId(articleId: number): Promise<Favorite[]> {
    const db = this.databaseService.getDatabase();
    const results = await db.select().from(favorites).where(eq(favorites.articleId, articleId)).all();
    return results;
  }

  async create(favoriteData: NewFavorite): Promise<Favorite> {
    const db = this.databaseService.getDatabase();
    const result = await db.insert(favorites).values(favoriteData).returning().get();
    return result;
  }

  async delete(id: number): Promise<boolean> {
    const db = this.databaseService.getDatabase();
    const result = await db.delete(favorites).where(eq(favorites.id, id)).returning().get();
    return !!result;
  }

  async deleteByUserAndArticle(userId: number, articleId: number): Promise<boolean> {
    const db = this.databaseService.getDatabase();
    const result = await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.articleId, articleId)))
      .returning()
      .get();
    return !!result;
  }

  async isFavorited(userId: number, articleId: number): Promise<boolean> {
    const favorite = await this.findByUserAndArticle(userId, articleId);
    return !!favorite;
  }

  async getFavoriteCount(articleId: number): Promise<number> {
    const favorites = await this.findByArticleId(articleId);
    return favorites.length;
  }
}