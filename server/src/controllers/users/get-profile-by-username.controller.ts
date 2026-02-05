// get-profile-by-username.controller.ts

import { Request, Response } from "express";
import { asyncHandler, HttpSuccess } from "../../utils";
import { GetUserByUsernameDto } from "../../dtos";
import { usersService } from "../../services";

interface RequestWithUsername extends Request {
    params: {
        username: string;
    };
}

export const getProfileByUsernameController = asyncHandler(
    async (req: RequestWithUsername, res: Response) => {
        const dto = new GetUserByUsernameDto(req.params.username);
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
