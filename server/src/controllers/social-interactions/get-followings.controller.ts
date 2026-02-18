import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler } from "../../utils";

export const getFollowingsController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        throw new Error("Not implemented yet - Controller Layer");
    }
);
