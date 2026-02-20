import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { UnfollowUserDTO } from "../../dtos";
import { socialService } from "../../services/social.service";

export const unfollowController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();
        const followeeId = req.params?.followeeId ?? "";

        const dto = new UnfollowUserDTO(userId, followeeId);
        const result = await socialService.unfollowUser(dto);

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Successfully unfollowed the user",
                    result
                )
            );
    }
);
