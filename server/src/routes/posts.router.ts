import { Router } from "express";
import { authenticate } from "../middlewares";
import { getPostController, updatePostVisibilityController } from "../controllers";
import { likePostController } from "../controllers/posts/like-post.controller";
import { unlikePostController } from "../controllers/posts/unlike-post.controller";
import { viewPostController } from "../controllers/posts/view-post.controller";
import { addCommentController } from "../controllers/comments/add-comment.controller";
import { getCommentsController } from "../controllers/comments/get-comments.controller";
import { repostPostController } from "../controllers/posts/repost-post.controller";
import { unrepostPostController } from "../controllers/posts/unrepost-post.controller";
import { savePostController } from "../controllers/posts/save-post.controller";
import { unsavePostController } from "../controllers/posts/unsave-post.controller";

export const postsRouter = Router();

postsRouter.use(authenticate);

postsRouter.get("/:postId", getPostController);

// Visibility
postsRouter.patch("/:postId/visibility", updatePostVisibilityController);

// View
postsRouter.post("/:postId/view", viewPostController);

// Like / Unlike
postsRouter.post("/:postId/like", likePostController);
postsRouter.delete("/:postId/like", unlikePostController);

// Repost / Unrepost
postsRouter.post("/:postId/repost", repostPostController);
postsRouter.delete("/:postId/repost", unrepostPostController);

// Save / Unsave
postsRouter.post("/:postId/save", savePostController);
postsRouter.delete("/:postId/save", unsavePostController);

// Comments
postsRouter.get("/:postId/comments", getCommentsController);
postsRouter.post("/:postId/comments", addCommentController);
