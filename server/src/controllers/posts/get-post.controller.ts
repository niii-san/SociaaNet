import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { postsService } from "../../services";

export const getPostController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();

        const postId = req.params?.postId ?? "";

        const post = await postsService.getPost(postId, userId);

        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "Post retrieved successfully", post)
            );
    }
);
