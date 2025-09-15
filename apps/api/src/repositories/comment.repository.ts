import { singleton, inject } from "tsyringe";
import { eq, and, desc } from "@conduit/data";
import { Comment, NewComment, CommentWithAuthor, comments, users } from "@conduit/data";
import type { IDatabaseService } from "../services/database.service.js";

export interface ICommentRepository {
  findById(id: number): Promise<Comment | null>;
  findByArticleId(articleId: number): Promise<CommentWithAuthor[]>;
  findWithAuthor(id: number): Promise<CommentWithAuthor | null>;
  create(commentData: NewComment): Promise<Comment>;
  update(id: number, commentData: Partial<NewComment>): Promise<Comment | null>;
  delete(id: number): Promise<boolean>;
  deleteByArticleId(articleId: number): Promise<number>;
}

@singleton()
export class CommentRepository implements ICommentRepository {
  constructor(
    @inject("IDatabaseService") private databaseService: IDatabaseService
  ) {}

  async findById(id: number): Promise<Comment | null> {
    const db = this.databaseService.getDatabase();
    const result = await db.select().from(comments).where(eq(comments.id, id)).get();
    return result || null;
  }

  async findByArticleId(articleId: number): Promise<CommentWithAuthor[]> {
    const db = this.databaseService.getDatabase();
    const results = await db
      .select({
        id: comments.id,
        body: comments.body,
        authorId: comments.authorId,
        articleId: comments.articleId,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
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
      .from(comments)
      .innerJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.articleId, articleId))
      .orderBy(desc(comments.createdAt))
      .all();

    return results;
  }

  async findWithAuthor(id: number): Promise<CommentWithAuthor | null> {
    const db = this.databaseService.getDatabase();
    const result = await db
      .select({
        id: comments.id,
        body: comments.body,
        authorId: comments.authorId,
        articleId: comments.articleId,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
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
      .from(comments)
      .innerJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.id, id))
      .get();

    return result || null;
  }

  async create(commentData: NewComment): Promise<Comment> {
    const db = this.databaseService.getDatabase();
    const result = await db.insert(comments).values(commentData).returning().get();
    return result;
  }

  async update(id: number, commentData: Partial<NewComment>): Promise<Comment | null> {
    const db = this.databaseService.getDatabase();
    const result = await db
      .update(comments)
      .set({ ...commentData, updatedAt: new Date().toISOString() })
      .where(eq(comments.id, id))
      .returning()
      .get();
    return result || null;
  }

  async delete(id: number): Promise<boolean> {
    const db = this.databaseService.getDatabase();
    const result = await db.delete(comments).where(eq(comments.id, id)).returning().get();
    return !!result;
  }

  async deleteByArticleId(articleId: number): Promise<number> {
    const db = this.databaseService.getDatabase();
    const results = await db.delete(comments).where(eq(comments.articleId, articleId)).returning().all();
    return results.length;
  }
}