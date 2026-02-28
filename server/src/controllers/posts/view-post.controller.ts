import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { viewsService } from "../../services";

export const viewPostController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const postId = req.params.postId;
        const userId = req.user._id.toString();

        const result = await viewsService.viewPost(postId, userId);

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Post view recorded successfully",
                    result
                )
            );
    }
);
