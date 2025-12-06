import { Router } from "express";
import { loginController, signupController, validateSessionController } from "../controllers";

const authRouter = Router();

authRouter.post("/signup", signupController);
authRouter.post("/login", loginController);
authRouter.get("/validate-session",validateSessionController)

export default authRouter;
