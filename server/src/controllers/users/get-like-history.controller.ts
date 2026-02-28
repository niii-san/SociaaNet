import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { likesService } from "../../services";

export const getLikeHistoryController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const result = await likesService.getLikeHistory(userId, page, limit);

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Like history retrieved successfully",
                    result
                )
            );
    }
);
