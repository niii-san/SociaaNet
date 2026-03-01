import express from "express";
import { authenticate, moderatorAuthenticate } from "../middlewares";
import { getDashboardStatsController } from "../controllers/moderators/get-dashboard-stats.controller";
import { getModAllUsersController } from "../controllers/moderators/get-all-users.controller";
import { disableUserController } from "../controllers/moderators/disable-user.controller";
import { enableUserController } from "../controllers/moderators/enable-user.controller";
import { getUserDetailsController } from "../controllers/moderators/get-user-details.controller";
import { getModPostsController } from "../controllers/moderators/get-posts.controller";
import { removePostController } from "../controllers/moderators/remove-post.controller";
import { restorePostController } from "../controllers/moderators/restore-post.controller";
import { getModReelsController } from "../controllers/moderators/get-reels.controller";
import { removeReelController } from "../controllers/moderators/remove-reel.controller";
import { restoreReelController } from "../controllers/moderators/restore-reel.controller";
import { removeCommentController } from "../controllers/moderators/remove-comment.controller";

export const moderatorsRouter = express.Router();

// All moderator routes require authentication + moderator role
moderatorsRouter.use(authenticate);
moderatorsRouter.use(moderatorAuthenticate);

// Dashboard
moderatorsRouter.get("/dashboard/stats", getDashboardStatsController);

// User management
moderatorsRouter.get("/users", getModAllUsersController);
moderatorsRouter.get("/users/:userId", getUserDetailsController);
moderatorsRouter.patch("/users/:userId/disable", disableUserController);
moderatorsRouter.patch("/users/:userId/enable", enableUserController);

// Posts moderation
moderatorsRouter.get("/posts", getModPostsController);
moderatorsRouter.patch("/posts/:postId/remove", removePostController);
moderatorsRouter.patch("/posts/:postId/restore", restorePostController);

// Reels moderation
moderatorsRouter.get("/reels", getModReelsController);
moderatorsRouter.patch("/reels/:reelId/remove", removeReelController);
moderatorsRouter.patch("/reels/:reelId/restore", restoreReelController);

// Comments moderation
moderatorsRouter.delete("/comments/:commentId", removeCommentController);
