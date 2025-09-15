import "./container.js";
import { container } from "./container.js";
import { Application } from "./Application.js";

async function main() {
  try {
    const app = container.resolve<Application>("Application");
    await app.start();
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

main();
