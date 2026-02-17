import { Router } from "express";
import {
    getUserSettingsController,
    notificationsController,
    privacyController,
    appearanceController
} from "../controllers";

export const settingsRouter = Router();

// Get settings of current user
settingsRouter.get("/", getUserSettingsController);

// Update privacy settings of current user
settingsRouter.patch("/privacy", privacyController);

// Update notification settings of current user
settingsRouter.patch("/notifications", notificationsController);

// Update appearance settings of current user
settingsRouter.patch("/appearance", appearanceController);
