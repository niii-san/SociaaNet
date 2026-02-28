import { Router } from "express";
import { authenticate } from "../middlewares";
import { getReelController, updateReelVisibilityController } from "../controllers";
import { likeReelController } from "../controllers/reels/like-reel.controller";
import { unlikeReelController } from "../controllers/reels/unlike-reel.controller";
import { viewReelController } from "../controllers/reels/view-reel.controller";
import { addCommentController } from "../controllers/comments/add-comment.controller";
import { getCommentsController } from "../controllers/comments/get-comments.controller";

export const reelsRouter = Router();

reelsRouter.use(authenticate);

reelsRouter.get("/:reelId", getReelController);

// Visibility
reelsRouter.patch("/:reelId/visibility", updateReelVisibilityController);

// View
reelsRouter.post("/:reelId/view", viewReelController);

// Like / Unlike
reelsRouter.post("/:reelId/like", likeReelController);
reelsRouter.delete("/:reelId/like", unlikeReelController);

// Comments
reelsRouter.get("/:reelId/comments", getCommentsController);
reelsRouter.post("/:reelId/comments", addCommentController);
