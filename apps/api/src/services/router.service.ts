import { Router } from "express";
import { singleton } from "tsyringe";
import { AuthMiddleware } from "../middleware/auth.middleware.js";

export interface IRouterService {
  getRouter(): Router;
  getAuthMiddleware(): AuthMiddleware;
  registerRoutes(): void;
}

@singleton()
export class RouterService implements IRouterService {
  private router: Router;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
  }

  getRouter(): Router {
    return this.router;
  }

  getAuthMiddleware(): AuthMiddleware {
    return this.authMiddleware;
  }

  registerRoutes(): void {
    // This method will be called after all controllers are instantiated
    // Controllers will have already registered their routes in their constructors
    console.log('All routes registered with RouterService');
  }
}