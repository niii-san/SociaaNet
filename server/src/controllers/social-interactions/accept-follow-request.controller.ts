import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { socialService } from "../../services/social.service";

export const acceptFollowRequestController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const followerId = req.params?.followerId ?? "";
        const userId = req.user._id.toString();

        const result = await socialService.acceptFollowRequest(
            followerId,
            userId
        );

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Follow request accepted successfully",
                    result
                )
            );
    }
);
