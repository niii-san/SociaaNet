import { Router } from "express";
import { getImageController, getVideoController } from "../controllers";
import { authenticate } from "../middlewares";
import { getThumbnailController } from "../controllers/files/get-thumbnail-controller";

export const filesRouter = Router();

filesRouter.use(authenticate);
filesRouter.get("/images/:imageKey", getImageController);
filesRouter.get("/videos/:videoKey", getVideoController);
filesRouter.get("/thumbnails/:thumbnailKey", getThumbnailController);
