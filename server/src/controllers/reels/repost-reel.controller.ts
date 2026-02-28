import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { repostsService } from "../../services";

export const repostReelController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();
        const { reelId } = req.params;

        const result = await repostsService.repostReel(reelId, userId);

        return res
            .status(201)
            .json(
                new HttpSuccess(201, true, "Reel reposted successfully", result)
            );
    }
);
