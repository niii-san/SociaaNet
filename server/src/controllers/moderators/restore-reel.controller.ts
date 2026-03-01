import { Response } from "express";
import { asyncHandler, HttpSuccess } from "../../utils";
import { RequestWithUserContext } from "../../types";
import { moderatorService } from "../../services/moderator.service";

export const restoreReelController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { reelId } = req.params;
        const moderatorId = req.user._id.toString();
        const result = await moderatorService.restoreReel(reelId, moderatorId);
        return res
            .status(200)
            .json(new HttpSuccess(200, true, result.message, null));
    }
);
