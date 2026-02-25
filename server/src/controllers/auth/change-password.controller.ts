import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { authService } from "../../services";

export const changePasswordController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();
        const currentPassword = req.body?.current_password ?? "";
        const newPassword = req.body?.new_password ?? "";

        const result = await authService.changePassword(
            userId,
            currentPassword,
            newPassword
        );

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Password changed successfully",
                    result
                )
            );
    }
);
