import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpError, HttpSuccess } from "../../utils";
import { ErrorCodes } from "../../constants/error-code";
import { userSettingsService } from "../../services/user-settings.service";
import { SetShowSensitiveContentDto, UpdateFeedModeDto } from "../../dtos";

export const updateFeedSettingsController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();
        const mode = req.body?.mode;
        const showSensitiveContent = req.body?.show_sensitive_content;

        const fieldCount = [mode, showSensitiveContent].filter(
            (field) => field !== undefined
        ).length;
        let result;

        if (fieldCount === 0 || fieldCount > 1) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Exactly one of 'mode' or 'show_sensitive_content' must be provided in the request body"
            );
        }

        if (mode !== undefined) {
            const dto = new UpdateFeedModeDto(userId, mode);
            result = await userSettingsService.updateFeedMode(dto);
        }

        if (showSensitiveContent !== undefined) {
            const dto = new SetShowSensitiveContentDto(
                userId,
                showSensitiveContent
            );
            result = await userSettingsService.setShowSensitiveContent(dto);
        }

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Feed settings updated successfully",
                    result
                )
            );
    }
);
