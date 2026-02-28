import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { savedItemsService } from "../../services";

export const unsavePostController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();
        const { postId } = req.params;

        const result = await savedItemsService.unsavePost(postId, userId);

        return res
            .status(200)
            .json(new HttpSuccess(200, true, "Post removed from saved", result));
    }
);
