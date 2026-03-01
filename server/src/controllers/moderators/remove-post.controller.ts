import { Response } from "express";
import { asyncHandler, HttpSuccess } from "../../utils";
import { RequestWithUserContext } from "../../types";
import { moderatorService } from "../../services/moderator.service";

export const removePostController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { postId } = req.params;
        const result = await moderatorService.removePost(postId);
        return res
            .status(200)
            .json(new HttpSuccess(200, true, result.message, null));
    }
);
