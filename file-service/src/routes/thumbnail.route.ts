import express from "express";
import { authenticate } from "../middlewares";
import { getThumbnailController } from "../controllers";

export const thumbnailRouter = express.Router();


thumbnailRouter.get("/:thumbnailKey", getThumbnailController);
