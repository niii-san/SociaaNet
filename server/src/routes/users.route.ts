import { Router } from "express";
import { authenticate } from "../middlewares";
import {
    getProfileByUsernameController,
    getUserSettingsController,
    uploadAvatarController
} from "../controllers";
import multer from "multer";
import { getCurrentUserController } from "../controllers/users/get-current-user.controller";

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

export default usersRouter;
