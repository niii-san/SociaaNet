import express from "express";
import multer from "multer";
import { authenticate } from "../middlewares";
import {
    uploadSingleImageController,
    getSingleImageController
} from "../controllers";

export const imagesRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

imagesRouter.use(authenticate);

imagesRouter.post(
    "/upload-single-image",
    upload.single("image"),
    uploadSingleImageController
);
imagesRouter.get("/:imageKey", getSingleImageController);
