import { Router } from "express";
import { authenticate } from "../middlewares";
import { getReelController, updateReelVisibilityController } from "../controllers";
import { likeReelController } from "../controllers/reels/like-reel.controller";
import { unlikeReelController } from "../controllers/reels/unlike-reel.controller";
import { viewReelController } from "../controllers/reels/view-reel.controller";
import { addCommentController } from "../controllers/comments/add-comment.controller";
import { getCommentsController } from "../controllers/comments/get-comments.controller";
import { repostReelController } from "../controllers/reels/repost-reel.controller";
import { unrepostReelController } from "../controllers/reels/unrepost-reel.controller";
import { saveReelController } from "../controllers/reels/save-reel.controller";
import { unsaveReelController } from "../controllers/reels/unsave-reel.controller";

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

// Repost / Unrepost
reelsRouter.post("/:reelId/repost", repostReelController);
reelsRouter.delete("/:reelId/repost", unrepostReelController);

// Save / Unsave
reelsRouter.post("/:reelId/save", saveReelController);
reelsRouter.delete("/:reelId/save", unsaveReelController);

// Comments
reelsRouter.get("/:reelId/comments", getCommentsController);
reelsRouter.post("/:reelId/comments", addCommentController);
