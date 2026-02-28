import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { commentsService } from "../../services/comments.service";

export const deleteCommentController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { commentId } = req.params;
        const userId = req.user._id.toString();

        const result = await commentsService.deleteComment(commentId, userId);

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Comment deleted successfully",
                    result
                )
            );
    }
);
