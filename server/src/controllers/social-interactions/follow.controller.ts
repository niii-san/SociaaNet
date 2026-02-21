import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { FollowUserDTO } from "../../dtos";
import { socialService } from "../../services/social.service";

export const followController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();
        const followeeId = req.params?.followeeId ?? "";

        const dto = new FollowUserDTO(userId, followeeId);

        const result = await socialService.followUser(dto);

        if (result.is_follow_request) {
            return res
                .status(200)
                .json(
                    new HttpSuccess(
                        200,
                        true,
                        "Follow Request Sent Successfully",
                        result
                    )
                );
        }

        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "Followed User Successfully", result)
            );
    }
);
