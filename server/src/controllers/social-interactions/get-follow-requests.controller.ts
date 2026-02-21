import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { socialService } from "../../services/social.service";

export const getFollowRequestsController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();

        const followRequests = await socialService.getFollowRequests(userId);

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Follow requests retrieved successfully",
                    followRequests
                )
            );
    }
);
