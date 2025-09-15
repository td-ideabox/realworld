import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { IProfileService } from "../services/profile.service.js";
import type { IUserService } from "../services/user.service.js";
import type { IRouterService } from "../services/router.service.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

@injectable()
export class ProfileController {
  constructor(
    @inject("IProfileService") private profileService: IProfileService,
    @inject("IUserService") private userService: IUserService,
    @inject("IRouterService") private routerService: IRouterService
  ) {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    const router = this.routerService.getRouter();
    const auth = this.routerService.getAuthMiddleware();

    // Profile routes
    router.get("/profiles/:username", auth.optional, this.getProfile.bind(this));
    router.post("/profiles/:username/follow", auth.authenticate, this.followUser.bind(this));
    router.delete("/profiles/:username/follow", auth.authenticate, this.unfollowUser.bind(this));
  }

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { username } = req.params;

      if (!username) {
        res.status(400).json({
          errors: { username: ['is required'] }
        });
        return;
      }

      let currentUserId: number | undefined;
      if (req.user) {
        const currentUser = await this.userService.getUserByEmail(req.user.email);
        currentUserId = currentUser?.id;
      }

      const profile = await this.profileService.getProfile(username, currentUserId);

      if (!profile) {
        res.status(404).json({
          errors: { profile: ['not found'] }
        });
        return;
      }

      res.json({ profile });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        errors: { body: ['Internal server error'] }
      });
    }
  }

  async followUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          errors: { authentication: ['Required'] }
        });
        return;
      }

      const { username } = req.params;

      if (!username) {
        res.status(400).json({
          errors: { username: ['is required'] }
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

      const profile = await this.profileService.followUser(currentUser.id, username);

      if (!profile) {
        res.status(404).json({
          errors: { profile: ['not found'] }
        });
        return;
      }

      res.json({ profile });
    } catch (error: any) {
      console.error('Follow user error:', error);

      if (error.message === 'Cannot follow yourself') {
        res.status(422).json({
          errors: { follow: ['Cannot follow yourself'] }
        });
        return;
      }

      res.status(500).json({
        errors: { body: ['Internal server error'] }
      });
    }
  }

  async unfollowUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          errors: { authentication: ['Required'] }
        });
        return;
      }

      const { username } = req.params;

      if (!username) {
        res.status(400).json({
          errors: { username: ['is required'] }
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

      const profile = await this.profileService.unfollowUser(currentUser.id, username);

      if (!profile) {
        res.status(404).json({
          errors: { profile: ['not found'] }
        });
        return;
      }

      res.json({ profile });
    } catch (error) {
      console.error('Unfollow user error:', error);
      res.status(500).json({
        errors: { body: ['Internal server error'] }
      });
    }
  }
}