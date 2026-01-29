import express from "express";
import multer from "multer";
import { uploadSingleImageController } from "../../controllers";
import { authenticate } from "../../middlewares";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
    "/upload-single-image",
    authenticate,
    upload.single("image"),
    uploadSingleImageController
);

export default router;
