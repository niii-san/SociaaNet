import { GetUserSettingsByUserIdDto } from "../../dtos";
import { usersService } from "../../services";
import { asyncHandler, HttpSuccess } from "../../utils";
import { Request, Response } from "express";

import { RequestWithUserContext } from "../../types";

export const getUserSettingsController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();

        const dto = new GetUserSettingsByUserIdDto(userId);

        const userSettings = await usersService.getUserSettingsByUserId(dto);

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "User settings fetched",
                    userSettings
                )
            );
    }
);
