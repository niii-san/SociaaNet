import { NextFunction, Response } from "express";
import { asyncHandler, HttpError } from "../utils";
import { RequestWithUserContext } from "../types";
import { ErrorCodes } from "../constants/error-code";

// this middleware can only be used after using authenticate middleware
export const moderatorAuthenticate = asyncHandler(
    async (req: RequestWithUserContext, _: Response, next: NextFunction) => {
        if (req.user.role !== "moderator" && req.user.role !== "system_admin") {
            throw new HttpError(
                403,
                false,
                ErrorCodes.FORBIDDEN,
                "Forbidden: Moderator access required"
            );
        }

        next();
    }
);
