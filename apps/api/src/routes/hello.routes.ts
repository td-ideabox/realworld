import { Router } from "express";
import { container } from "../container.js";
import { HelloController } from "../controllers/hello.controller.js";

const router: Router = Router();
const helloController = container.resolve(HelloController);

router.get("/hello", (req, res) => helloController.getHello(req, res));

export { router as helloRoutes };
