import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { IArticleService } from "../services/article.service.js";
import type { IUserService } from "../services/user.service.js";
import type { IRouterService } from "../services/router.service.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { CreateArticleRequestSchema, UpdateArticleRequestSchema, ArticleQuerySchema, FeedQuerySchema } from "@conduit/transport";

@injectable()
export class ArticleController {
  constructor(
    @inject("IArticleService") private articleService: IArticleService,
    @inject("IUserService") private userService: IUserService,
    @inject("IRouterService") private routerService: IRouterService
  ) {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    const router = this.routerService.getRouter();
    const auth = this.routerService.getAuthMiddleware();

    // Article routes
    router.get("/articles", auth.optional, this.getArticles.bind(this));
    router.get("/articles/feed", auth.authenticate, this.getFeedArticles.bind(this));
    router.get("/articles/:slug", auth.optional, this.getArticle.bind(this));
    router.post("/articles", auth.authenticate, this.createArticle.bind(this));
    router.put("/articles/:slug", auth.authenticate, this.updateArticle.bind(this));
    router.delete("/articles/:slug", auth.authenticate, this.deleteArticle.bind(this));

    // Article interaction routes
    router.post("/articles/:slug/favorite", auth.authenticate, this.favoriteArticle.bind(this));
    router.delete("/articles/:slug/favorite", auth.authenticate, this.unfavoriteArticle.bind(this));
  }

  async getArticles(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validation = ArticleQuerySchema.safeParse(req.query);

      if (!validation.success) {
        res.status(422).json({
          errors: { query: validation.error.errors.map(e => `${e.path.join('.')} ${e.message}`) }
        });
        return;
      }

      const filters = validation.data;

      let currentUserId: number | undefined;
      if (req.user) {
        const currentUser = await this.userService.getUserByEmail(req.user.email);
        currentUserId = currentUser?.id;
      }

      const result = await this.articleService.getArticles(filters, currentUserId);

      res.json(result);
    } catch (error) {
      console.error('Get articles error:', error);
      res.status(500).json({
        errors: { body: ['Internal server error'] }
      });
    }
  }

  async getFeedArticles(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          errors: { authentication: ['Required'] }
        });
        return;
      }

      const validation = FeedQuerySchema.safeParse(req.query);

      if (!validation.success) {
        res.status(422).json({
          errors: { query: validation.error.errors.map(e => `${e.path.join('.')} ${e.message}`) }
        });
        return;
      }

      const { limit, offset } = validation.data;

      const currentUser = await this.userService.getUserByEmail(req.user.email);

      if (!currentUser) {
        res.status(401).json({
          errors: { authentication: ['User not found'] }
        });
        return;
      }

      const result = await this.articleService.getFeedArticles(currentUser.id, limit, offset);

      res.json(result);
    } catch (error) {
      console.error('Get feed articles error:', error);
      res.status(500).json({
        errors: { body: ['Internal server error'] }
      });
    }
  }

  async getArticle(req: AuthenticatedRequest, res: Response): Promise<void> {
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

      const article = await this.articleService.getArticleBySlug(slug, currentUserId);

      if (!article) {
        res.status(404).json({
          errors: { article: ['not found'] }
        });
        return;
      }

      res.json({ article });
    } catch (error) {
      console.error('Get article error:', error);
      res.status(500).json({
        errors: { body: ['Internal server error'] }
      });
    }
  }

  async createArticle(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          errors: { authentication: ['Required'] }
        });
        return;
      }

      const validation = CreateArticleRequestSchema.safeParse(req.body);

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

      const { title, description, body, tagList } = validation.data.article;

      const article = await this.articleService.createArticle(
        currentUser.id,
        { title, description, body },
        tagList
      );

      res.status(201).json({ article });
    } catch (error: any) {
      console.error('Create article error:', error);

      if (error.message === 'Article with this title already exists') {
        res.status(422).json({
          errors: { title: ['has already been taken'] }
        });
        return;
      }

      res.status(500).json({
        errors: { body: ['Internal server error'] }
      });
    }
  }

  async updateArticle(req: AuthenticatedRequest, res: Response): Promise<void> {
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

      const validation = UpdateArticleRequestSchema.safeParse(req.body);

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

      const updateData = validation.data.article;

      const article = await this.articleService.updateArticle(slug, currentUser.id, updateData);

      if (!article) {
        res.status(404).json({
          errors: { article: ['not found'] }
        });
        return;
      }

      res.json({ article });
    } catch (error: any) {
      console.error('Update article error:', error);

      if (error.message === 'Not authorized to update this article') {
        res.status(403).json({
          errors: { authorization: ['Not authorized to update this article'] }
        });
        return;
      }

      res.status(500).json({
        errors: { body: ['Internal server error'] }
      });
    }
  }

  async deleteArticle(req: AuthenticatedRequest, res: Response): Promise<void> {
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

      const currentUser = await this.userService.getUserByEmail(req.user.email);

      if (!currentUser) {
        res.status(401).json({
          errors: { authentication: ['User not found'] }
        });
        return;
      }

      const success = await this.articleService.deleteArticle(slug, currentUser.id);

      if (!success) {
        res.status(404).json({
          errors: { article: ['not found'] }
        });
        return;
      }

      res.status(200).json({});
    } catch (error: any) {
      console.error('Delete article error:', error);

      if (error.message === 'Not authorized to delete this article') {
        res.status(403).json({
          errors: { authorization: ['Not authorized to delete this article'] }
        });
        return;
      }

      res.status(500).json({
        errors: { body: ['Internal server error'] }
      });
    }
  }

  async favoriteArticle(req: AuthenticatedRequest, res: Response): Promise<void> {
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

      const currentUser = await this.userService.getUserByEmail(req.user.email);

      if (!currentUser) {
        res.status(401).json({
          errors: { authentication: ['User not found'] }
        });
        return;
      }

      const article = await this.articleService.favoriteArticle(slug, currentUser.id);

      if (!article) {
        res.status(404).json({
          errors: { article: ['not found'] }
        });
        return;
      }

      res.json({ article });
    } catch (error) {
      console.error('Favorite article error:', error);
      res.status(500).json({
        errors: { body: ['Internal server error'] }
      });
    }
  }

  async unfavoriteArticle(req: AuthenticatedRequest, res: Response): Promise<void> {
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

      const currentUser = await this.userService.getUserByEmail(req.user.email);

      if (!currentUser) {
        res.status(401).json({
          errors: { authentication: ['User not found'] }
        });
        return;
      }

      const article = await this.articleService.unfavoriteArticle(slug, currentUser.id);

      if (!article) {
        res.status(404).json({
          errors: { article: ['not found'] }
        });
        return;
      }

      res.json({ article });
    } catch (error) {
      console.error('Unfavorite article error:', error);
      res.status(500).json({
        errors: { body: ['Internal server error'] }
      });
    }
  }
}