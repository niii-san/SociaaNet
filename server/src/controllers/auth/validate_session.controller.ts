import { asyncHandler, ApiSuccessResponse } from "../../utils";
import type { Response } from "express";
import { RequestWithUserContext } from "../../types";

const validateSessionController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        return res.status(200).json(
            new ApiSuccessResponse(true, 200, "Session is valid", {
                username: req.user.username,
                full_name: req.user.full_name
            })
        );
    }
);

export default validateSessionController;
