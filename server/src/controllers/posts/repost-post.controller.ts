import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { repostsService } from "../../services";

export const repostPostController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();
        const { postId } = req.params;

        const result = await repostsService.repostPost(postId, userId);

        return res
            .status(201)
            .json(
                new HttpSuccess(201, true, "Post reposted successfully", result)
            );
    }
);
