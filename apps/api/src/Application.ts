import express, { Express } from "express";
import { injectable, inject } from "tsyringe";
import { IDatabaseService } from "./services/database.service.js";
import { IRouterService } from "./services/router.service.js";

@injectable()
export class Application {
  private app: Express;
  private port: number;

  constructor(
    @inject("IDatabaseService") private databaseService: IDatabaseService,
    @inject("IRouterService") private routerService: IRouterService
  ) {
    this.app = express();
    this.port = parseInt(process.env.API_PORT || "3000", 10);
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
  }

  private setupRoutes(): void {
    this.app.use("/api", this.routerService.getRouter());
  }

  async start(): Promise<void> {
    try {
      // Initialize database first
      console.log("Initializing database...");
      await this.databaseService.initialize();
      console.log("Database initialized successfully");

      // Start the Express server
      this.app.listen(this.port, () => {
        console.log(`API server running on port ${this.port}`);
        console.log("Application started successfully");
      });
    } catch (error) {
      console.error("Failed to start application:", error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      this.databaseService.close();
      console.log("Application stopped successfully");
    } catch (error) {
      console.error("Error stopping application:", error);
      throw error;
    }
  }

  getApp(): Express {
    return this.app;
  }
}