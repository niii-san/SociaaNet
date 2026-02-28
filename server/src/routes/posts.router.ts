import { Router } from "express";
import { authenticate } from "../middlewares";
import { getPostController } from "../controllers";

export const postsRouter = Router();

postsRouter.use(authenticate);

postsRouter.get("/:postId", getPostController);
