import express from "express";
import multer from "multer";
import { uploadSingleImageController } from "../../controllers";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
    "/upload-single-image",
    upload.single("image"),
    uploadSingleImageController
);

export default router;
