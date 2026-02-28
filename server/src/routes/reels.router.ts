import { Router } from "express";
import { authenticate } from "../middlewares";

export const reelsRouter = Router();

reelsRouter.use(authenticate);
