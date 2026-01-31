import { NextFunction, Response } from "express";
import { ApiErrorResponse, asyncHandler } from "../utils";
import { RequestWithUserContext } from "../types";
import { AuthRepository,UserRepository } from "../repositories";

const authRepo = new AuthRepository();
const userRepo = new UserRepository();

const authenticate = asyncHandler(
    async (req: RequestWithUserContext, _: Response, next: NextFunction) => {
        const cookie =
            req.cookies["session_id"] ||
            req.header("Authorization")?.replace("Bearer ", "").trim();

        if (!cookie) {
            throw new ApiErrorResponse(
                401,
                false,
                "NO_COOKIE",
                "Please provide a session_id cookie"
            );
        }

        const session = await authRepo.getSessionById(cookie);

        if (!session) {
            throw new ApiErrorResponse(
                401,
                false,
                "INVALID_SESSION",
                "Session is invalid or has expired"
            );
        }

        if (session.is_expired) {
            throw new ApiErrorResponse(
                401,
                false,
                "INVALID_SESSION",
                "Session is invalid or has expired"
            );
        }

        const user = await userRepo.getUserById(
            session.user_id as unknown as string
        );

        if (!user) {
            throw new ApiErrorResponse(
                401,
                false,
                "INVALID_SESSION",
                "Session is invalid or has expired"
            );
        }

        if (user.is_disabled) {
            throw new ApiErrorResponse(
                403,
                false,
                "USER_DISABLED",
                "User account is disabled"
            );
        }

        const now = new Date();
        const expiresAt = new Date(session.expires_at);

        if (expiresAt < now) {
            session.is_expired = true;
            await session.save();

            throw new ApiErrorResponse(
                401,
                false,
                "SESSION_EXPIRED",
                "Session has expired, please log in again"
            );
        }

        req.user = user;
        next();
    }
);
export default authenticate;
