import { NextFunction, Response } from "express";
import { ApiErrorResponse, asyncHandler } from "../utils";
import { Session } from "../models";
import { RequestWithUserContext } from "../types";
import { ISafeUser } from "../types";
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

        const session = await Session.findOne({ session_id: cookie }).populate(
            "user_id",
            "-password"
        );

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
        const user = session.user_id as unknown as ISafeUser & {
            is_disabled: boolean;
        };
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
