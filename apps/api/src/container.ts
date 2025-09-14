import "reflect-metadata";
import { container } from "tsyringe";
import {
  HelloRepository,
  IHelloRepository,
} from "./repositories/hello.repository.js";
import { HelloService, IHelloService } from "./services/hello.service.js";
import { HelloController } from "./controllers/hello.controller.js";

container.register<IHelloRepository>("IHelloRepository", {
  useClass: HelloRepository,
});

container.register<IHelloService>("IHelloService", {
  useClass: HelloService,
});

container.register("HelloController", {
  useClass: HelloController,
});

export { container };
