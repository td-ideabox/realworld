import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { ITagService } from "../services/tag.service.js";
import type { IRouterService } from "../services/router.service.js";

@injectable()
export class TagController {
  constructor(
    @inject("ITagService") private tagService: ITagService,
    @inject("IRouterService") private routerService: IRouterService
  ) {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    const router = this.routerService.getRouter();

    // Tag routes (no authentication required)
    router.get("/tags", this.getTags.bind(this));
  }

  async getTags(req: Request, res: Response): Promise<void> {
    try {
      const tags = await this.tagService.getPopularTags();

      res.json({ tags });
    } catch (error) {
      console.error('Get tags error:', error);
      res.status(500).json({
        errors: { body: ['Internal server error'] }
      });
    }
  }
}