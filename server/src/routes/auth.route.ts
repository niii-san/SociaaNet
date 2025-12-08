import { Router } from "express";
import {
  loginController,
  signupController,
  validateSessionController
} from "../controllers";
import { authenticate } from "../middlewares";

const authRouter = Router();

authRouter.post("/signup", signupController);
authRouter.post("/login", loginController);
authRouter.get("/validate-session", authenticate, validateSessionController);

export default authRouter;
