import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { savedItemsService } from "../../services";

export const unsaveReelController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();
        const { reelId } = req.params;

        const result = await savedItemsService.unsaveReel(reelId, userId);

        return res
            .status(200)
            .json(new HttpSuccess(200, true, "Reel removed from saved", result));
    }
);
