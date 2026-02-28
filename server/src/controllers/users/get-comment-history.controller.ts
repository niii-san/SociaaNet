import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { commentsService } from "../../services";

export const getCommentHistoryController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const result = await commentsService.getCommentHistory(userId, page, limit);

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Comment history retrieved successfully",
                    result
                )
            );
    }
);
