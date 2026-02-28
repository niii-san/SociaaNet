import { Router } from "express";
import { authenticate } from "../middlewares";
import { getReelController } from "../controllers";
import { likeReelController } from "../controllers/reels/like-reel.controller";
import { unlikeReelController } from "../controllers/reels/unlike-reel.controller";

export const reelsRouter = Router();

reelsRouter.use(authenticate);

reelsRouter.get("/:reelId", getReelController);

// Like / Unlike
reelsRouter.post("/:reelId/like", likeReelController);
reelsRouter.delete("/:reelId/like", unlikeReelController);
