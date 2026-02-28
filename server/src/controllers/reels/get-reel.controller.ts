import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { postsService } from "../../services";

export const getReelController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();

        const reelId = req.params?.reelId ?? "";

        const reel = await postsService.getReel(reelId, userId);

        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "Reel retrieved successfully", reel)
            );
    }
);
