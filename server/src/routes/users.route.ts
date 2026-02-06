import { Router } from "express";
import { authenticate, moderatorAuthenticate } from "../middlewares";
import {
    getAllUsersController,
    getProfileByUsernameController,
    getUserSettingsController,
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

// Get settings of current user
usersRouter.get("/me/settings", getUserSettingsController);

// Get current user via cookie
usersRouter.get("/me", getCurrentUserController);

// Update bio
usersRouter.patch("/me/bio", updateBioController);

// update username
usersRouter.patch("/me/username", updateUsernameController);

// update fullname
usersRouter.patch("/me/fullname", updateFullNameController);

usersRouter.get("/me/activities", getUserActivitiesController);

// Moderators only routes
usersRouter.get("/", moderatorAuthenticate, getAllUsersController);

export default usersRouter;
