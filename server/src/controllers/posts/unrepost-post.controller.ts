import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { repostsService } from "../../services";

export const unrepostPostController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();
        const { postId } = req.params;

        const result = await repostsService.unrepostPost(postId, userId);

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Post unreposted successfully",
                    result
                )
            );
    }
);
