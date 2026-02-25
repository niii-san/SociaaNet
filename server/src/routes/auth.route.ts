import { Router } from "express";
import {
    changePasswordController,
    changePasswordWithOtpController,
    forgotPasswordOtpController,
    loginController,
    logoutController,
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

authRouter.patch("/change-password", authenticate, changePasswordController);
authRouter.delete("/logout", authenticate, logoutController);

export default authRouter;
