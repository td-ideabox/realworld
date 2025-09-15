import "./container.js";
import { container } from "./container.js";
import { Application } from "./Application.js";

async function main() {
  try {
    // Instantiate all controllers to register their routes
    container.resolve("HelloController");
    container.resolve("UserController");
    container.resolve("ProfileController");
    container.resolve("ArticleController");
    container.resolve("CommentController");
    container.resolve("TagController");

    const app = container.resolve<Application>("Application");
    await app.start();
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

main();
