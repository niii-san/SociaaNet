import { Router } from "express";
import { getImageController, getVideoController } from "../controllers";
import { getThumbnailController } from "../controllers/files/get-thumbnail-controller";

export const filesRouter = Router();

// File endpoints are publicly accessible — the random file key acts as a capability token.
// This ensures <img>, <video> tags work without needing auth cookies.
filesRouter.get("/images/:imageKey", getImageController);
filesRouter.get("/videos/:videoKey", getVideoController);
filesRouter.get("/thumbnails/:thumbnailKey", getThumbnailController);
