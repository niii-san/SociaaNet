import { Request, Response } from "express";
import { asyncHandler, HttpError, HttpSuccess } from "../../utils";
import { RequestWithUserContext } from "../../types";
import { authService } from "../../services";
import { ErrorCodes } from "../../constants/error-code";

export const logoutController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();
        const sessionId = req.cookies.session_id;

        const isDeleted = await authService.deleteSession(sessionId, userId);

        if (!isDeleted) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Failed to log out user! Please try again later."
            );
        }

        return res
            .status(200)
            .clearCookie("session_id", {
                httpOnly: true,
                secure: true
            })
            .json(
                new HttpSuccess(200, true, "User logged out successfully", null)
            );
    }
);
