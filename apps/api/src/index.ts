import "./container.js";
import express from "express";
import { helloRoutes } from "./routes/hello.routes.js";

const app = express();
const PORT = process.env.API_PORT || 3000;

app.use(express.json());

app.use("/api", helloRoutes);

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
