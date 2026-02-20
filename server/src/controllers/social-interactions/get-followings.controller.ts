import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { socialService } from "../../services/social.service";

export const getFollowingsController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();

        const followings = await socialService.getFollowings(userId);

        return res.status(200).json(
            new HttpSuccess(
                200,
                true,
                "Successfully retrieved followings",
                followings
            )
        )
    }
);
