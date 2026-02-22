// get-profile-by-username.controller.ts

import { Response } from "express";
import { asyncHandler, HttpSuccess } from "../../utils";
import { GetUserByUsernameDto, GetUserProfileDto } from "../../dtos";
import { usersService } from "../../services";
import { RequestWithUserContext } from "../../types";

interface RequestWithUsername extends RequestWithUserContext {
    params: {
        username: string;
    };
}

export const getProfileByUsernameController = asyncHandler(
    async (req: RequestWithUsername, res: Response) => {
        const currentUserId = req.user._id.toString()
        const targetProfileUsername = req.params?.username ?? "";

        const dto = new GetUserProfileDto(targetProfileUsername, currentUserId);

        const userProfile = await usersService.getUserProfileByUsername(dto);

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    `${userProfile.username} profile retrieved`,
                    userProfile
                )
            );
    }
);
