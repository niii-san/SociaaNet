import { ApiSuccessResponse, asyncHandler } from "../../utils";
import type { Request, Response } from "express";

const signupController = asyncHandler(async (req: Request, res: Response) => {
    return res.status(201).json(new ApiSuccessResponse(true, 201, "User created", null));
});

export default signupController;
