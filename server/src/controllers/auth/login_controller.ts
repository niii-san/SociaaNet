import { asyncHandler, ApiSuccessResponse } from "../../utils";
import type { Request, Response } from "express";

const loginController = asyncHandler(async (req: Request, res: Response) => {
    return res
        .status(200)
        .json(new ApiSuccessResponse(true, 200, "User login success", null));
});

export default loginController;
