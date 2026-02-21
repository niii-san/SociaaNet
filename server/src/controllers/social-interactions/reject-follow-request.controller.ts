import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { socialService } from "../../services/social.service";

export const rejectFollowRequestController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();
        const followerId = req.params?.followerId ?? "";

        const result = await socialService.rejectFollowRequest(
            followerId,
            userId
        );

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Follow request rejected successfully",
                    result
                )
            );
    }
);
