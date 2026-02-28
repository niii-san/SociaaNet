import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { likesService } from "../../services/likes.service";

export const likePostController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const postId = req.params.postId;
        const userId = req.user._id.toString();

        const result = await likesService.likePost(postId, userId);

        return res
            .status(200)
            .json(new HttpSuccess(200, true, "Post liked successfully", result));
    }
);
