import { Router } from "express";
import { authenticate } from "../middlewares";
import { getReelController } from "../controllers";

export const reelsRouter = Router();

reelsRouter.use(authenticate);

reelsRouter.get("/:reelId", getReelController);
