import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { SetThemeDto } from "../../dtos";
import { userSettingsService } from "../../services/user-settings.service";

export const appearanceController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();

        const dto = new SetThemeDto(userId, req.body?.theme);
        const result = await userSettingsService.setTheme(dto);

        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "Theme updated successfully", result)
            );
    }
);
