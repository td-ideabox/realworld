import { singleton, inject } from "tsyringe";
import type { ICommentRepository } from "../repositories/comment.repository.js";
import type { IArticleRepository } from "../repositories/article.repository.js";
import type { IFollowRepository } from "../repositories/follow.repository.js";
import { Comment, NewComment, CommentWithAuthor } from "@conduit/data";

export interface CommentWithMetadata extends Omit<CommentWithAuthor, 'author'> {
  author: {
    username: string;
    bio: string | null;
    image: string | null;
    following: boolean;
  };
}

export interface ICommentService {
  getCommentsByArticleSlug(slug: string, currentUserId?: number): Promise<CommentWithMetadata[]>;
  createComment(articleSlug: string, authorId: number, body: string): Promise<CommentWithMetadata>;
  deleteComment(commentId: number, authorId: number): Promise<boolean>;
}

@singleton()
export class CommentService implements ICommentService {
  constructor(
    @inject("ICommentRepository") private commentRepository: ICommentRepository,
    @inject("IArticleRepository") private articleRepository: IArticleRepository,
    @inject("IFollowRepository") private followRepository: IFollowRepository
  ) {}

  async getCommentsByArticleSlug(slug: string, currentUserId?: number): Promise<CommentWithMetadata[]> {
    const article = await this.articleRepository.findBySlug(slug);

    if (!article) {
      throw new Error("Article not found");
    }

    const comments = await this.commentRepository.findByArticleId(article.id);

    return Promise.all(
      comments.map(comment => this.enrichCommentWithMetadata(comment, currentUserId))
    );
  }

  async createComment(articleSlug: string, authorId: number, body: string): Promise<CommentWithMetadata> {
    const article = await this.articleRepository.findBySlug(articleSlug);

    if (!article) {
      throw new Error("Article not found");
    }

    const newComment = await this.commentRepository.create({
      body,
      authorId,
      articleId: article.id
    });

    const commentWithAuthor = await this.commentRepository.findWithAuthor(newComment.id);

    if (!commentWithAuthor) {
      throw new Error("Failed to retrieve created comment");
    }

    return this.enrichCommentWithMetadata(commentWithAuthor, authorId);
  }

  async deleteComment(commentId: number, authorId: number): Promise<boolean> {
    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      return false;
    }

    if (comment.authorId !== authorId) {
      throw new Error("Not authorized to delete this comment");
    }

    return this.commentRepository.delete(commentId);
  }

  private async enrichCommentWithMetadata(comment: CommentWithAuthor, currentUserId?: number): Promise<CommentWithMetadata> {
    let following = false;

    if (currentUserId && currentUserId !== comment.author.id) {
      following = await this.followRepository.isFollowing(currentUserId, comment.author.id);
    }

    return {
      ...comment,
      author: {
        username: comment.author.username,
        bio: comment.author.bio,
        image: comment.author.image,
        following
      }
    };
  }
}