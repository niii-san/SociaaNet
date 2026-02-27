import { Router } from "express";
import { getImageController, getVideoController } from "../controllers";
import { authenticate } from "../middlewares";

export const filesRouter = Router();

filesRouter.use(authenticate)
filesRouter.get("/images/:imageKey", getImageController);
filesRouter.get("/videos/:videoKey",getVideoController)
