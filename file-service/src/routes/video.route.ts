import { Router } from "express";
import multer from "multer";
import { getVideoController, uploadVideoController } from "../controllers";
import { authenticate } from "../middlewares";

export const videoRouter = Router();

const upload = multer({
    storage: multer.memoryStorage()
});

videoRouter.use(authenticate);
videoRouter.post("/", upload.single("video"), uploadVideoController);
videoRouter.get("/:videoKey", getVideoController);
