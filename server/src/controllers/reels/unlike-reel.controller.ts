import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { likesService } from "../../services/likes.service";

export const unlikeReelController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const reelId = req.params.reelId;
        const userId = req.user._id.toString();

        const result = await likesService.unlikeReel(reelId, userId);

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Reel unliked successfully",
                    result
                )
            );
    }
);
