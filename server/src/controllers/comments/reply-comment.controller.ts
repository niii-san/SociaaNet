import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { commentsService } from "../../services/comments.service";

export const replyCommentController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { commentId } = req.params;
        const userId = req.user._id.toString();
        const { content } = req.body;

        const result = await commentsService.replyToComment(
            commentId,
            content,
            userId
        );

        return res
            .status(201)
            .json(
                new HttpSuccess(
                    201,
                    true,
                    "Reply added successfully",
                    result
                )
            );
    }
);
