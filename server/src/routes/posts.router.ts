import { Router } from "express";
import { authenticate } from "../middlewares";
import { getPostController, updatePostVisibilityController } from "../controllers";
import { likePostController } from "../controllers/posts/like-post.controller";
import { unlikePostController } from "../controllers/posts/unlike-post.controller";
import { addCommentController } from "../controllers/comments/add-comment.controller";
import { getCommentsController } from "../controllers/comments/get-comments.controller";

export const postsRouter = Router();

postsRouter.use(authenticate);

postsRouter.get("/:postId", getPostController);

// Visibility
postsRouter.patch("/:postId/visibility", updatePostVisibilityController);

// Like / Unlike
postsRouter.post("/:postId/like", likePostController);
postsRouter.delete("/:postId/like", unlikePostController);

// Comments
postsRouter.get("/:postId/comments", getCommentsController);
postsRouter.post("/:postId/comments", addCommentController);
