import { NextFunction, Request } from "express";
import { asyncHandler, HttpError } from "../utils";
import env from "../config/env";

export const authenticate = asyncHandler(
    async (req: Request, _: Response, next: NextFunction) => {
        if (req.headers["x-internal-api-key"] !== env.internalApiKey) {
            throw new HttpError(403, false, "NOT_ALLOWED", "Forbidden");
        }

        next();
    }
);
