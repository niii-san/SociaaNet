import { Router } from "express";
import { authenticate, moderatorAuthenticate } from "../middlewares";
import {
    acceptFollowRequestController,
    followController,
    getAllUsersController,
    getFollowersController,
    getFollowingsController,
    getProfileByUsernameController,
    getUserSettingsController,
    rejectFollowRequestController,
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

const usersRouter = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB
    }
});

// Unprotected Routes
usersRouter.get("/profile/:username", getProfileByUsernameController);

// Protected Routes
usersRouter.use(authenticate);

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

usersRouter.get("/search", searchUsersController);

// Social Interactions

// Follow and unfollow
usersRouter.post("/me/:userId/follow", followController);
usersRouter.delete("/me/:userId/follow", unfollowController);
// Accept or Reject follow Request
usersRouter.patch(
    "/me/:followerId/follow-request",
    acceptFollowRequestController
);
usersRouter.delete(
    "/me/:followerId/follow-request",
    rejectFollowRequestController
);

// Get following, followers, and follow requests
(usersRouter.get("/:userId/following", getFollowingsController),
    usersRouter.get("/:userId/followers", getFollowersController),
    usersRouter.get("/me/follow-requests", getFollowersController),
    // Moderators only routes
    usersRouter.get("/", moderatorAuthenticate, getAllUsersController));

export default usersRouter;
