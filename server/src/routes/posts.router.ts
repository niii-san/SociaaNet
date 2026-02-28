import { Router } from "express";
import { authenticate } from "../middlewares";
import { getPostController } from "../controllers";
import { likePostController } from "../controllers/posts/like-post.controller";
import { unlikePostController } from "../controllers/posts/unlike-post.controller";

export const postsRouter = Router();

postsRouter.use(authenticate);

postsRouter.get("/:postId", getPostController);

// Like / Unlike
postsRouter.post("/:postId/like", likePostController);
postsRouter.delete("/:postId/like", unlikePostController);
