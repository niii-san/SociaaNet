import { Router } from "express";
import { authenticate } from "../middlewares";
import { uploadPostController, uploadReelController } from "../controllers";
import multer from "multer";

export const mediaRouter = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB
    }
});

mediaRouter.use(authenticate);

mediaRouter.post("/post", upload.array("images"), uploadPostController);
mediaRouter.post("/reel", upload.single("video"), uploadReelController);
