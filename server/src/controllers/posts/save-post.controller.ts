import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { savedItemsService } from "../../services";

export const savePostController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();
        const { postId } = req.params;

        const result = await savedItemsService.savePost(postId, userId);

        return res
            .status(201)
            .json(new HttpSuccess(201, true, "Post saved successfully", result));
    }
);
