import { asyncHandler, HttpSuccess } from "../../utils";
import type { Response } from "express";
import { RequestWithUserContext } from "../../types";

export const validateSessionController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        return res.status(200).json(
            new HttpSuccess(true, 200, "Session is valid", {
                username: req.user.username,
                full_name: req.user.full_name
            })
        );
    }
);

