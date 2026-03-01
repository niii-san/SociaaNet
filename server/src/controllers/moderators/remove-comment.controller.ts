import { Response } from "express";
import { asyncHandler, HttpSuccess } from "../../utils";
import { RequestWithUserContext } from "../../types";
import { moderatorService } from "../../services/moderator.service";

export const removeCommentController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { commentId } = req.params;
        const result = await moderatorService.removeComment(commentId);
        return res
            .status(200)
            .json(new HttpSuccess(200, true, result.message, null));
    }
);
