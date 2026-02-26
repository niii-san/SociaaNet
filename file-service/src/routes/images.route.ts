import express from "express";
import multer from "multer";
import { authenticate } from "../middlewares";
import {
    uploadSingleImageController,
    getSingleImageController,
    uploadMultipleImagesController
} from "../controllers";

export const imagesRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

imagesRouter.use(authenticate);

imagesRouter.post(
    "/upload-single-image",
    upload.single("image"),
    uploadSingleImageController
);
imagesRouter.post(
    "/upload-multiple-images",
    upload.array("images"),
    uploadMultipleImagesController
);
imagesRouter.get("/:imageKey", getSingleImageController);
