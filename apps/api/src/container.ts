import "reflect-metadata";
import { container } from "tsyringe";
import {
  HelloRepository,
  IHelloRepository,
} from "./repositories/hello.repository.js";
import { HelloService, IHelloService } from "./services/hello.service.js";
import { HelloController } from "./controllers/hello.controller.js";

// Database Service
import { DatabaseService, IDatabaseService } from "./services/database.service.js";

// Router Service
import { RouterService, IRouterService } from "./services/router.service.js";

// Application
import { Application } from "./Application.js";

// Repositories
import {
  UserRepository,
  IUserRepository,
  ArticleRepository,
  IArticleRepository,
  CommentRepository,
  ICommentRepository,
  TagRepository,
  ITagRepository,
  FavoriteRepository,
  IFavoriteRepository,
  FollowRepository,
  IFollowRepository,
} from "./repositories/index.js";

// Note: Services with @singleton() decorators are automatically registered by tsyringe
// We only need to manually register interfaces for services without decorators

// Register interface mappings for @singleton() decorated services
container.register<IDatabaseService>("IDatabaseService", { useToken: DatabaseService });
container.register<IRouterService>("IRouterService", { useToken: RouterService });
container.register<IUserRepository>("IUserRepository", { useToken: UserRepository });
container.register<IArticleRepository>("IArticleRepository", { useToken: ArticleRepository });
container.register<ICommentRepository>("ICommentRepository", { useToken: CommentRepository });
container.register<ITagRepository>("ITagRepository", { useToken: TagRepository });
container.register<IFavoriteRepository>("IFavoriteRepository", { useToken: FavoriteRepository });
container.register<IFollowRepository>("IFollowRepository", { useToken: FollowRepository });

// Register existing services and controllers
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
