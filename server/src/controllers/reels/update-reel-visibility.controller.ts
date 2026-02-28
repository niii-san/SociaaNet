import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpError, HttpSuccess } from "../../utils";
import { postsService } from "../../services";
import { ErrorCodes } from "../../constants/error-code";

export const updateReelVisibilityController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();
        const reelId = req.params?.reelId ?? "";
        const { visibility } = req.body;

        if (!visibility) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "visibility is required"
            );
        }

        const result = await postsService.updateReelVisibility(
            reelId,
            visibility,
            userId
        );

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Reel visibility updated successfully",
                    result
                )
            );
    }
);
