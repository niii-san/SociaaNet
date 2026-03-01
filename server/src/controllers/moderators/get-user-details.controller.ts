import { Response } from "express";
import { asyncHandler, HttpSuccess } from "../../utils";
import { RequestWithUserContext } from "../../types";
import { moderatorService } from "../../services/moderator.service";

export const getUserDetailsController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { userId } = req.params;
        const result = await moderatorService.getUserDetails(userId);
        return res
            .status(200)
            .json(new HttpSuccess(200, true, "User details fetched", result));
    }
);
