import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { IUserService } from "../services/user.service.js";
import type { ICognitoService } from "../services/cognito.service.js";
import type { IRouterService } from "../services/router.service.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { LoginRequestSchema, RegisterRequestSchema, UpdateUserRequestSchema } from "@conduit/transport";
import { getAvatarUrl } from "../utils/avatar.js";

@injectable()
export class UserController {
  constructor(
    @inject("IUserService") private userService: IUserService,
    @inject("ICognitoService") private cognitoService: ICognitoService,
    @inject("IRouterService") private routerService: IRouterService
  ) {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    const router = this.routerService.getRouter();
    const auth = this.routerService.getAuthMiddleware();

    // Authentication routes
    router.post("/users/login", this.login.bind(this));
    router.post("/users", this.register.bind(this));

    // User profile routes (require authentication)
    router.get("/user", auth.authenticate, this.getCurrentUser.bind(this));
    router.put("/user", auth.authenticate, this.updateUser.bind(this));
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const validation = LoginRequestSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(422).json({
          errors: { body: validation.error.errors.map(e => `${e.path.join('.')} ${e.message}`) }
        });
        return;
      }

      const { email, password } = validation.data.user;

      const { user, authResult } = await this.userService.loginUser(email, password);

      res.json({
        user: {
          email: user.email,
          token: authResult.idToken, // Use Cognito's ID token
          username: user.username,
          bio: user.bio,
          image: await getAvatarUrl(user.image)
        }
      });
    } catch (error: any) {
      console.error('Login error:', error);

      if (error.message === 'Invalid credentials') {
        res.status(422).json({
          errors: { 'email or password': ['is invalid'] }
        });
        return;
      }

      res.status(500).json({
        errors: { body: ['Internal server error'] }
      });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const validation = RegisterRequestSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(422).json({
          errors: { body: validation.error.errors.map(e => `${e.path.join('.')} ${e.message}`) }
        });
        return;
      }

      const { username, email, password } = validation.data.user;

      // Check if user already exists locally
      const existingUserByEmail = await this.userService.getUserByEmail(email);
      if (existingUserByEmail) {
        res.status(422).json({
          errors: { email: ['has already been taken'] }
        });
        return;
      }

      const existingUserByUsername = await this.userService.getUserByUsername(username);
      if (existingUserByUsername) {
        res.status(422).json({
          errors: { username: ['has already been taken'] }
        });
        return;
      }

      const { user, cognitoUser } = await this.userService.registerUser(username, email, password);

      // Login the user to get tokens
      const { authResult } = await this.userService.loginUser(email, password);

      res.status(201).json({
        user: {
          email: user.email,
          token: authResult.idToken, // Use Cognito's ID token
          username: user.username,
          bio: user.bio,
          image: await getAvatarUrl(user.image)
        }
      });
    } catch (error: any) {
      console.error('Registration error:', error);

      if (error.message === 'User already exists') {
        res.status(422).json({
          errors: { email: ['has already been taken'] }
        });
        return;
      }

      res.status(500).json({
        errors: { body: ['Internal server error'] }
      });
    }
  }

  async getCurrentUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          errors: { authentication: ['Required'] }
        });
        return;
      }

      const user = await this.userService.getUserByEmail(req.user.email);

      if (!user) {
        // Sync user from Cognito if not found locally
        const cognitoUser = await this.cognitoService.getUserByEmail(req.user.email);
        if (cognitoUser) {
          const syncedUser = await this.userService.syncUserFromCognito(cognitoUser);
          res.json({
            user: {
              email: syncedUser.email,
              token: req.headers.authorization?.split(' ')[1] || '', // Return the current token
              username: syncedUser.username,
              bio: syncedUser.bio,
              image: await getAvatarUrl(syncedUser.image)
            }
          });
          return;
        }

        res.status(404).json({
          errors: { user: ['not found'] }
        });
        return;
      }

      res.json({
        user: {
          email: user.email,
          token: req.headers.authorization?.split(' ')[1] || '', // Return the current token
          username: user.username,
          bio: user.bio,
          image: await getAvatarUrl(user.image)
        }
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        errors: { body: ['Internal server error'] }
      });
    }
  }

  async updateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          errors: { authentication: ['Required'] }
        });
        return;
      }

      const validation = UpdateUserRequestSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(422).json({
          errors: { body: validation.error.errors.map(e => `${e.path.join('.')} ${e.message}`) }
        });
        return;
      }

      const currentUser = await this.userService.getUserByEmail(req.user.email);

      if (!currentUser) {
        res.status(404).json({
          errors: { user: ['not found'] }
        });
        return;
      }

      const updateData = validation.data.user;

      // Check for username conflicts if username is being updated
      if (updateData.username && updateData.username !== currentUser.username) {
        const existingUser = await this.userService.getUserByUsername(updateData.username);
        if (existingUser) {
          res.status(422).json({
            errors: { username: ['has already been taken'] }
          });
          return;
        }
      }

      // Check for email conflicts if email is being updated
      if (updateData.email && updateData.email !== currentUser.email) {
        const existingUser = await this.userService.getUserByEmail(updateData.email);
        if (existingUser) {
          res.status(422).json({
            errors: { email: ['has already been taken'] }
          });
          return;
        }
      }

      // Update user in Cognito first
      const cognitoUpdates: any = {};
      if (updateData.username) cognitoUpdates.username = updateData.username;
      if (updateData.bio !== undefined) cognitoUpdates.bio = updateData.bio;
      if (updateData.image !== undefined) cognitoUpdates.image = updateData.image;

      if (Object.keys(cognitoUpdates).length > 0) {
        await this.cognitoService.updateUserProfile(req.user.email, cognitoUpdates);
      }

      // Update local user record
      const updatedUser = await this.userService.updateUser(currentUser.id, {
        username: updateData.username,
        email: updateData.email,
        bio: updateData.bio,
        image: updateData.image
      });

      if (!updatedUser) {
        res.status(500).json({
          errors: { body: ['Failed to update user'] }
        });
        return;
      }

      res.json({
        user: {
          email: updatedUser.email,
          token: req.headers.authorization?.split(' ')[1] || '', // Return the current token
          username: updatedUser.username,
          bio: updatedUser.bio,
          image: await getAvatarUrl(updatedUser.image)
        }
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        errors: { body: ['Internal server error'] }
      });
    }
  }
}