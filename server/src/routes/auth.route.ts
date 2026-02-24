import { Router } from "express";
import {
    changePasswordWithOtpController,
    forgotPasswordOtpController,
    loginController,
    signupController,
    validateSessionController
} from "../controllers";
import { authenticate } from "../middlewares";

const authRouter = Router();

authRouter.post("/signup", signupController);
authRouter.post("/login", loginController);
authRouter.get("/validate-session", authenticate, validateSessionController);
authRouter.get("/forgot-password-otp/:email", forgotPasswordOtpController);
authRouter.post("/change-password-with-otp", changePasswordWithOtpController);

export default authRouter;
