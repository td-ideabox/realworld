import { Router } from "express";
import { singleton } from "tsyringe";

export interface IRouterService {
  getRouter(): Router;
  registerRoutes(): void;
}

@singleton()
export class RouterService implements IRouterService {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  getRouter(): Router {
    return this.router;
  }

  registerRoutes(): void {
    // This method will be called after all controllers are instantiated
    // Controllers will have already registered their routes in their constructors
    console.log('All routes registered with RouterService');
  }
}