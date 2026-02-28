import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { repostsService } from "../../services";

export const unrepostReelController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();
        const { reelId } = req.params;

        const result = await repostsService.unrepostReel(reelId, userId);

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Reel unreposted successfully",
                    result
                )
            );
    }
);
