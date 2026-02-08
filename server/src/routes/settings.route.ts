import { Router } from "express";
import { getUserSettingsController, privacyController } from "../controllers";

export const settingsRouter = Router();

// Get settings of current user
settingsRouter.get("/", getUserSettingsController);

//
settingsRouter.patch("/privacy", privacyController);
