import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { commentsService } from "../../services/comments.service";

export const getCommentsController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const targetId = req.params.postId || req.params.reelId;
        const targetType = req.params.postId ? "post" : "reel";
        const userId = req.user._id.toString();
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const result = await commentsService.getComments(
            targetId,
            targetType as "post" | "reel",
            userId,
            page,
            limit
        );

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Comments retrieved successfully",
                    result
                )
            );
    }
);
