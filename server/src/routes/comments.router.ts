import { Router } from "express";
import { authenticate } from "../middlewares";
import { deleteCommentController } from "../controllers/comments/delete-comment.controller";
import { replyCommentController } from "../controllers/comments/reply-comment.controller";
import { getRepliesController } from "../controllers/comments/get-replies.controller";
import { likeCommentController } from "../controllers/comments/like-comment.controller";
import { unlikeCommentController } from "../controllers/comments/unlike-comment.controller";

export const commentsRouter = Router();

commentsRouter.use(authenticate);

// Reply to a comment
commentsRouter.post("/:commentId/reply", replyCommentController);

// Get replies for a comment
commentsRouter.get("/:commentId/replies", getRepliesController);

// Like / Unlike a comment
commentsRouter.post("/:commentId/like", likeCommentController);
commentsRouter.delete("/:commentId/like", unlikeCommentController);

// Delete a comment
commentsRouter.delete("/:commentId", deleteCommentController);
