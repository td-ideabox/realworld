import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { IHelloService } from "../services/hello.service.js";
import type { IRouterService } from "../services/router.service.js";

@injectable()
export class HelloController {
  constructor(
    @inject("IHelloService") private helloService: IHelloService,
    @inject("IRouterService") private routerService: IRouterService
  ) {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    const router = this.routerService.getRouter();
    router.get("/hello", this.getHello.bind(this));
  }

  async getHello(req: Request, res: Response): Promise<void> {
    try {
      const message = await this.helloService.getHelloMessage();
      res.json({ message });
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
