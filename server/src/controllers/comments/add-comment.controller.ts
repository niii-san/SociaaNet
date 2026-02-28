import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { commentsService } from "../../services/comments.service";

export const addCommentController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const targetId = req.params.postId || req.params.reelId;
        const targetType = req.params.postId ? "post" : "reel";
        const userId = req.user._id.toString();
        const { content } = req.body;

        const result = await commentsService.addComment(
            targetId,
            targetType as "post" | "reel",
            content,
            userId
        );

        return res
            .status(201)
            .json(
                new HttpSuccess(
                    201,
                    true,
                    "Comment added successfully",
                    result
                )
            );
    }
);
