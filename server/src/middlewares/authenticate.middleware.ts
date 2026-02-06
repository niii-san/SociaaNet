import { NextFunction, Response } from "express";
import { HttpError, asyncHandler } from "../utils";
import { RequestWithUserContext } from "../types";
import { authRepo, userRepo } from "../repositories";
import { ErrorCodes } from "../constants/error-code";

export const authenticate = asyncHandler(
    async (req: RequestWithUserContext, _: Response, next: NextFunction) => {
        const cookie =
            req.cookies["session_id"] ||
            req.header("Authorization")?.replace("Bearer ", "").trim();

        if (!cookie) {
            throw new HttpError(
                401,
                false,
                ErrorCodes.INVALID_INPUT,
                "Authentication credentials were not provided"
            );
        }

        const session = await authRepo.getSessionById(cookie);

        if (!session) {
            throw new HttpError(
                401,
                false,
                ErrorCodes.UNAUTHORIZED,
                "Session is invalid or has expired"
            );
        }

        if (session.has_expired) {
            throw new HttpError(
                401,
                false,
                ErrorCodes.UNAUTHORIZED,
                "Session is invalid or has expired"
            );
        }

        const user = await userRepo.getUserById(session.user_id.toString());

        if (!user) {
            throw new HttpError(
                401,
                false,
                ErrorCodes.UNAUTHORIZED,
                "Session is invalid or has expired"
            );
        }

        if (user.is_disabled) {
            throw new HttpError(
                403,
                false,
                ErrorCodes.FORBIDDEN,
                "User account has been disabled, please contact support for more information"
            );
        }

        const now = new Date();
        const expiresAt = new Date(session.expires_at);

        if (expiresAt < now) {
            session.has_expired = true;
            await session.save();

            throw new HttpError(
                401,
                false,
                ErrorCodes.UNAUTHORIZED,
                "Session is invalid or has expired"
            );
        }

        req.user = user;
        next();
    }
);
