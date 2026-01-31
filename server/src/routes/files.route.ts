import { Router } from "express";
import { getImageController } from "../controllers";

export const filesRouter = Router();

filesRouter.get("/images/:imageKey", getImageController);
