import { Router } from "express";
import { authenticate } from "../middlewares";
import { uploadPostController } from "../controllers";

export const mediaRouter = Router();

mediaRouter.use(authenticate);
mediaRouter.post("/post", uploadPostController);
