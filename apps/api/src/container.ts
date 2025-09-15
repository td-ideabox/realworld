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

// Services
import { UserService, IUserService } from "./services/user.service.js";
import { CognitoService, ICognitoService } from "./services/cognito.service.js";
import { ProfileService, IProfileService } from "./services/profile.service.js";
import { ArticleService, IArticleService } from "./services/article.service.js";
import { CommentService, ICommentService } from "./services/comment.service.js";
import { TagService, ITagService } from "./services/tag.service.js";

// Controllers
import { UserController } from "./controllers/user.controller.js";
import { ProfileController } from "./controllers/profile.controller.js";
import { ArticleController } from "./controllers/article.controller.js";
import { CommentController } from "./controllers/comment.controller.js";
import { TagController } from "./controllers/tag.controller.js";

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

// Register repositories
container.register<IUserRepository>("IUserRepository", { useToken: UserRepository });
container.register<IArticleRepository>("IArticleRepository", { useToken: ArticleRepository });
container.register<ICommentRepository>("ICommentRepository", { useToken: CommentRepository });
container.register<ITagRepository>("ITagRepository", { useToken: TagRepository });
container.register<IFavoriteRepository>("IFavoriteRepository", { useToken: FavoriteRepository });
container.register<IFollowRepository>("IFollowRepository", { useToken: FollowRepository });

// Register services
container.register<ICognitoService>("ICognitoService", { useToken: CognitoService });
container.register<IUserService>("IUserService", { useToken: UserService });
container.register<IProfileService>("IProfileService", { useToken: ProfileService });
container.register<IArticleService>("IArticleService", { useToken: ArticleService });
container.register<ICommentService>("ICommentService", { useToken: CommentService });
container.register<ITagService>("ITagService", { useToken: TagService });

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

// Register controllers
container.register("UserController", { useClass: UserController });
container.register("ProfileController", { useClass: ProfileController });
container.register("ArticleController", { useClass: ArticleController });
container.register("CommentController", { useClass: CommentController });
container.register("TagController", { useClass: TagController });

export { container };
