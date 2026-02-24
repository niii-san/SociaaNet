import { Request, Response } from "express";
import { asyncHandler, HttpSuccess } from "../../utils";
import { authService } from "../../services";

export const changePasswordWithOtpController = asyncHandler(
    async (req: Request, res: Response) => {
        const email = (req.body?.email_address ?? "").trim();
        const otp = req.body?.otp ?? "";
        const newPassword = req.body?.new_password ?? "";

        await authService.changePasswordWithOtp(email, otp, newPassword);

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Password changed successfully! Now you can use your new password to login.",
                    null
                )
            );
    }
);
