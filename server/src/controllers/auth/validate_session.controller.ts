import { asyncHandler, ApiSuccessResponse } from "../../utils";
import type { Request, Response } from "express";

const validateSessionController = asyncHandler(
    async (req: Request, res: Response) => {
        return res
            .status(200)
            .json(new ApiSuccessResponse(true, 200, "Session is valid", null));
    }
);

export default validateSessionController;
