import { authService } from "../../services";
import { asyncHandler, HttpSuccess } from "../../utils";

import { Request, Response } from "express";

export const forgotPasswordOtpController = asyncHandler(
    async (req: Request, res: Response) => {
        const email = req.params?.email ?? "";

        const emailAddress = email.trim();

        const result = await authService.sendOtpForPasswordReset(emailAddress);

        res.status(200).json(
            new HttpSuccess(
                200,
                true,
                "OTP sent to the provided email address if it exists in our system",
                result
            )
        );
    }
);
