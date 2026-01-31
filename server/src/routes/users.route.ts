import { Router } from "express";
import { authenticate } from "../middlewares";
import { uploadAvatarController } from "../controllers";
import multer from "multer";

const usersRouter = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB
    }
});

usersRouter.post(
    "/me/avatar",
    authenticate,
    upload.single("avatar"),
    uploadAvatarController
);

export default usersRouter;
