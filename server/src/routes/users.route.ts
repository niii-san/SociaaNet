import { Router } from "express";
import { authenticate, moderatorAuthenticate } from "../middlewares";
import {
    acceptFollowRequestController,
    deleteFollowRequestController,
    followController,
    getAllUsersController,
    getFollowersController,
    getFollowingRequests,
    getFollowingsController,
    getFollowRequestsController,
    getProfileByUsernameController,
    getUserSettingsController,
    rejectFollowRequestController,
    removeFollowerController,
    searchUsersController,
    unfollowController,
    updateBioController,
    updateFullNameController,
    updateUsernameController,
    uploadAvatarController
} from "../controllers";
import multer from "multer";
import { getCurrentUserController } from "../controllers/users/get-current-user.controller";
import { getUserActivitiesController } from "../controllers/users/get-user-activities.controller";
import { getLikeHistoryController } from "../controllers/users/get-like-history.controller";
import { getCommentHistoryController } from "../controllers/users/get-comment-history.controller";

const usersRouter = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB
    }
});


// Protected Routes
usersRouter.use(authenticate);

// Get user profile
usersRouter.get("/profile/:username", getProfileByUsernameController);

// Upload Avatar
usersRouter.post(
    "/me/avatar",
    authenticate,
    upload.single("avatar"),
    uploadAvatarController
);

// Get current user via cookie
usersRouter.get("/me", getCurrentUserController);

// Update bio
usersRouter.patch("/me/bio", updateBioController);

// update username
usersRouter.patch("/me/username", updateUsernameController);

// update fullname
usersRouter.patch("/me/fullname", updateFullNameController);

usersRouter.get("/me/activities", getUserActivitiesController);

// History
usersRouter.get("/me/history/likes", getLikeHistoryController);
usersRouter.get("/me/history/comments", getCommentHistoryController);

usersRouter.get("/search", searchUsersController);

// Social Interactions

// Follow and unfollow
usersRouter.post("/me/:followeeId/follow", followController);
usersRouter.delete("/me/:followeeId/follow", unfollowController);
usersRouter.delete(
    "/me/:followeeId/follow-request/cancel",
    deleteFollowRequestController
);

// Remove follower
usersRouter.delete("/me/followers/:followerId", removeFollowerController);

// Get following, followers, and follow requests
usersRouter.get("/:userId/following", getFollowingsController);
usersRouter.get("/:userId/followers", getFollowersController);
usersRouter.get("/me/follow-requests", getFollowRequestsController);

// Get follwing requests
usersRouter.get("/me/following-requests", getFollowingRequests);

// Accept or Reject follow Request
usersRouter.patch(
    "/me/:followerId/follow-request",
    acceptFollowRequestController
);

usersRouter.delete(
    "/me/:followerId/follow-request",
    rejectFollowRequestController
);

// Moderators only routes
usersRouter.get("/", moderatorAuthenticate, getAllUsersController);

export default usersRouter;
