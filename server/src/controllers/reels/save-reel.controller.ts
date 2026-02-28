import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { savedItemsService } from "../../services";

export const saveReelController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();
        const { reelId } = req.params;

        const result = await savedItemsService.saveReel(reelId, userId);

        return res
            .status(201)
            .json(new HttpSuccess(201, true, "Reel saved successfully", result));
    }
);
