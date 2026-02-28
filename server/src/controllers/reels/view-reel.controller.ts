import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { viewsService } from "../../services";

export const viewReelController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const reelId = req.params.reelId;
        const userId = req.user._id.toString();

        const result = await viewsService.viewReel(reelId, userId);

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Reel view recorded successfully",
                    result
                )
            );
    }
);
