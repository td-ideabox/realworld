import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { ICommentService } from "../services/comment.service.js";
import type { IUserService } from "../services/user.service.js";
import type { IRouterService } from "../services/router.service.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { CreateCommentRequestSchema } from "@conduit/transport";

@injectable()
export class CommentController {
  constructor(
    @inject("ICommentService") private commentService: ICommentService,
    @inject("IUserService") private userService: IUserService,
    @inject("IRouterService") private routerService: IRouterService
  ) {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    const router = this.routerService.getRouter();
    const auth = this.routerService.getAuthMiddleware();

    // Comment routes
    router.get("/articles/:slug/comments", auth.optional, this.getComments.bind(this));
    router.post("/articles/:slug/comments", auth.authenticate, this.createComment.bind(this));
    router.delete("/articles/:slug/comments/:id", auth.authenticate, this.deleteComment.bind(this));
  }

  async getComments(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      if (!slug) {
        res.status(400).json({
          errors: { slug: ['is required'] }
        });
        return;
      }

      let currentUserId: number | undefined;
      if (req.user) {
        const currentUser = await this.userService.getUserByEmail(req.user.email);
        currentUserId = currentUser?.id;
      }

      const comments = await this.commentService.getCommentsByArticleSlug(slug, currentUserId);

      res.json({ comments });
    } catch (error: any) {
      console.error('Get comments error:', error);

      if (error.message === 'Article not found') {
        res.status(404).json({
          errors: { article: ['not found'] }
        });
        return;
      }

      res.status(500).json({
        errors: { body: ['Internal server error'] }
      });
    }
  }

  async createComment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          errors: { authentication: ['Required'] }
        });
        return;
      }

      const { slug } = req.params;

      if (!slug) {
        res.status(400).json({
          errors: { slug: ['is required'] }
        });
        return;
      }

      const validation = CreateCommentRequestSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(422).json({
          errors: { body: validation.error.errors.map(e => `${e.path.join('.')} ${e.message}`) }
        });
        return;
      }

      const currentUser = await this.userService.getUserByEmail(req.user.email);

      if (!currentUser) {
        res.status(401).json({
          errors: { authentication: ['User not found'] }
        });
        return;
      }

      const { body } = validation.data.comment;

      const comment = await this.commentService.createComment(slug, currentUser.id, body);

      res.status(201).json({ comment });
    } catch (error: any) {
      console.error('Create comment error:', error);

      if (error.message === 'Article not found') {
        res.status(404).json({
          errors: { article: ['not found'] }
        });
        return;
      }

      res.status(500).json({
        errors: { body: ['Internal server error'] }
      });
    }
  }

  async deleteComment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          errors: { authentication: ['Required'] }
        });
        return;
      }

      const { slug, id } = req.params;

      if (!slug) {
        res.status(400).json({
          errors: { slug: ['is required'] }
        });
        return;
      }

      if (!id) {
        res.status(400).json({
          errors: { id: ['is required'] }
        });
        return;
      }

      const commentId = parseInt(id, 10);
      if (isNaN(commentId)) {
        res.status(400).json({
          errors: { id: ['must be a valid number'] }
        });
        return;
      }

      const currentUser = await this.userService.getUserByEmail(req.user.email);

      if (!currentUser) {
        res.status(401).json({
          errors: { authentication: ['User not found'] }
        });
        return;
      }

      const success = await this.commentService.deleteComment(commentId, currentUser.id);

      if (!success) {
        res.status(404).json({
          errors: { comment: ['not found'] }
        });
        return;
      }

      res.status(200).json({});
    } catch (error: any) {
      console.error('Delete comment error:', error);

      if (error.message === 'Not authorized to delete this comment') {
        res.status(403).json({
          errors: { authorization: ['Not authorized to delete this comment'] }
        });
        return;
      }

      res.status(500).json({
        errors: { body: ['Internal server error'] }
      });
    }
  }
}