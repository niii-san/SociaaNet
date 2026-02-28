import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { commentsService } from "../../services/comments.service";

export const getRepliesController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { commentId } = req.params;
        const userId = req.user._id.toString();
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await commentsService.getReplies(
            commentId,
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
                    "Replies retrieved successfully",
                    result
                )
            );
    }
);
