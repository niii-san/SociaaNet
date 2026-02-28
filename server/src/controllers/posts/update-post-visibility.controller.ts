import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpError, HttpSuccess } from "../../utils";
import { postsService } from "../../services";
import { ErrorCodes } from "../../constants/error-code";

export const updatePostVisibilityController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();
        const postId = req.params?.postId ?? "";
        const { visibility } = req.body;

        if (!visibility) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "visibility is required"
            );
        }

        const result = await postsService.updatePostVisibility(
            postId,
            visibility,
            userId
        );

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Post visibility updated successfully",
                    result
                )
            );
    }
);
