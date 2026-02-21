import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { socialService } from "../../services/social.service";

export const deleteFollowRequestController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const followeeId = req.params?.followeeId ?? "";
        const userId = req.user._id.toString();

        const result = await socialService.deleteFollowRequest(
            followeeId,
            userId
        );

        return res.status(200).json(
            new HttpSuccess(200, true, "Follow request deleted", {
                followerId: result.followerId,
                followeeId: result.followeeId
            })
        );
    }
);
