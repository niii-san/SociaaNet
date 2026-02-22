import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { socialService } from "../../services/social.service";

export const getFollowersController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.params.userId ?? "";

        const followers = await socialService.getFollowers(userId);

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Successfully retrieved followers",
                    followers
                )
            );
    }
);
