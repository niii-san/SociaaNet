import { Request, Response } from "express";
import { asyncHandler } from "../../utils";

export const getAllUsersController = asyncHandler(
    async (req: Request, res: Response) => {
        return res.status(200).json({ message: "fetched all users" });
    }
);
