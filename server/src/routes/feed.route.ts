import { Router } from "express";
import { authenticate } from "../middlewares";
import { getHomeFeedController } from "../controllers/feed/get-home-feed.controller";
import { getExploreController } from "../controllers/feed/get-explore.controller";
import { getReelsFeedController } from "../controllers/feed/get-reels-feed.controller";
import { getSuggestedUsersController } from "../controllers/feed/get-suggested-users.controller";

export const feedRouter = Router();

feedRouter.use(authenticate);

// Home feed — unseen posts first, then seen
feedRouter.get("/home", getHomeFeedController);

// Explore — trending public content
feedRouter.get("/explore", getExploreController);

// Reels feed — for vertical scroll viewer
feedRouter.get("/reels", getReelsFeedController);

// Suggested users — for sidebar widget
feedRouter.get("/suggested-users", getSuggestedUsersController);
