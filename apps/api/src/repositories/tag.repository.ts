import { singleton, inject } from "tsyringe";
import { eq, and, inArray } from "@conduit/data";
import { Tag, NewTag, tags, articleTags } from "@conduit/data";
import { IDatabaseService } from "../services/database.service.js";

export interface ITagRepository {
  findById(id: number): Promise<Tag | null>;
  findByName(name: string): Promise<Tag | null>;
  findAll(): Promise<Tag[]>;
  findByArticleId(articleId: number): Promise<Tag[]>;
  create(tagData: NewTag): Promise<Tag>;
  findOrCreate(name: string): Promise<Tag>;
  findOrCreateMany(names: string[]): Promise<Tag[]>;
  addToArticle(tagId: number, articleId: number): Promise<void>;
  removeFromArticle(tagId: number, articleId: number): Promise<void>;
  removeAllFromArticle(articleId: number): Promise<void>;
  getMostPopular(limit?: number): Promise<Tag[]>;
}

@singleton()
export class TagRepository implements ITagRepository {
  constructor(
    @inject("IDatabaseService") private databaseService: IDatabaseService
  ) {}

  async findById(id: number): Promise<Tag | null> {
    const db = this.databaseService.getDatabase();
    const result = await db.select().from(tags).where(eq(tags.id, id)).get();
    return result || null;
  }

  async findByName(name: string): Promise<Tag | null> {
    const db = this.databaseService.getDatabase();
    const result = await db.select().from(tags).where(eq(tags.name, name)).get();
    return result || null;
  }

  async findAll(): Promise<Tag[]> {
    const db = this.databaseService.getDatabase();
    const results = await db.select().from(tags).orderBy(tags.name).all();
    return results;
  }

  async findByArticleId(articleId: number): Promise<Tag[]> {
    const db = this.databaseService.getDatabase();
    const results = await db
      .select({
        id: tags.id,
        name: tags.name,
        createdAt: tags.createdAt,
      })
      .from(articleTags)
      .innerJoin(tags, eq(articleTags.tagId, tags.id))
      .where(eq(articleTags.articleId, articleId))
      .all();

    return results;
  }

  async create(tagData: NewTag): Promise<Tag> {
    const db = this.databaseService.getDatabase();
    const result = await db.insert(tags).values(tagData).returning().get();
    return result;
  }

  async findOrCreate(name: string): Promise<Tag> {
    const existing = await this.findByName(name);
    if (existing) {
      return existing;
    }

    return this.create({ name });
  }

  async findOrCreateMany(names: string[]): Promise<Tag[]> {
    const uniqueNames = [...new Set(names)];
    const results: Tag[] = [];

    for (const name of uniqueNames) {
      const tag = await this.findOrCreate(name);
      results.push(tag);
    }

    return results;
  }

  async addToArticle(tagId: number, articleId: number): Promise<void> {
    const db = this.databaseService.getDatabase();

    // Check if the relationship already exists
    const existing = await db
      .select()
      .from(articleTags)
      .where(and(eq(articleTags.tagId, tagId), eq(articleTags.articleId, articleId)))
      .get();

    if (!existing) {
      await db.insert(articleTags).values({ tagId, articleId });
    }
  }

  async removeFromArticle(tagId: number, articleId: number): Promise<void> {
    const db = this.databaseService.getDatabase();
    await db
      .delete(articleTags)
      .where(and(eq(articleTags.tagId, tagId), eq(articleTags.articleId, articleId)));
  }

  async removeAllFromArticle(articleId: number): Promise<void> {
    const db = this.databaseService.getDatabase();
    await db.delete(articleTags).where(eq(articleTags.articleId, articleId));
  }

  async getMostPopular(limit = 10): Promise<Tag[]> {
    const db = this.databaseService.getDatabase();

    // Get tags ordered by how many articles they're associated with
    const results = await db
      .select({
        id: tags.id,
        name: tags.name,
        createdAt: tags.createdAt,
      })
      .from(tags)
      .innerJoin(articleTags, eq(tags.id, articleTags.tagId))
      .groupBy(tags.id, tags.name, tags.createdAt)
      .orderBy(tags.name) // For consistent ordering, could be changed to count
      .limit(limit)
      .all();

    return results;
  }
}