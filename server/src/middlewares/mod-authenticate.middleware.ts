import { NextFunction, Response } from "express";
import { asyncHandler, HttpError } from "../utils";
import { RequestWithUserContext } from "../types";

// this middleware can only be used after using authenticate middleware
export const moderatorAuthenticate = asyncHandler(
    async (req: RequestWithUserContext, _: Response, next: NextFunction) => {
        console.log("moderatorAuthenticate middleware called");

        if (req.user.role !== "moderator") {
            throw new HttpError(
                403,
                false,
                "FORBIDDEN",
                "Forbidden: Moderator access required"
            );
        }

        next();
    }
);
