import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpError, HttpSuccess } from "../../utils";
import { ErrorCodes } from "../../constants/error-code";
import { userSettingsService } from "../../services/user-settings.service";
import {
    AllowCommentsFromDto,
    AllowMentionsFromDto,
    AllowMessagesFromDto,
    DisablePrivateAccountDto,
    EnablePrivateAccountDto,
    ShowActivityStatusDto
} from "../../dtos";

interface UpdatePrivacySettingsRequest {
    private_account?: boolean;
    allow_messages_from?: "everyone" | "followers_only" | "no_one";
    allow_comments_from?: "everyone" | "followers_only" | "no_one";
    allow_mentions_from?: "everyone" | "followers_only" | "no_one";
    show_activity_status?: boolean;
}

export const privacyController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const userId = req.user._id.toString();

        const {
            private_account,
            allow_messages_from,
            allow_comments_from,
            allow_mentions_from,
            show_activity_status
        } = req.body as Partial<UpdatePrivacySettingsRequest>;
        // Validation: Ensure only one field is being updated at a time
        const fields = [
            private_account !== undefined,
            allow_messages_from !== undefined,
            allow_comments_from !== undefined,
            allow_mentions_from !== undefined,
            show_activity_status !== undefined
        ];

        const providedFieldsCount = fields.filter(Boolean).length;

        if (providedFieldsCount === 0 || providedFieldsCount > 1) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Please provide exactly one field to update in the privacy settings."
            );
        }

        // Handling each field
        let result;

        if (private_account !== undefined) {
            if (typeof private_account !== "boolean") {
                throw new HttpError(
                    400,
                    false,
                    ErrorCodes.INVALID_INPUT,
                    "private_account must be a boolean"
                );
            }

            if (private_account) {
                const dto = new EnablePrivateAccountDto(userId);
                result = await userSettingsService.enablePrivateAccount(dto);
            } else {
                const dto = new DisablePrivateAccountDto(userId);
                result = await userSettingsService.disablePrivateAccount(dto);
            }
        }

        if (allow_messages_from !== undefined) {
            const dto = new AllowMessagesFromDto(userId, allow_messages_from);
            result = await userSettingsService.allowMessagesFrom(dto);
        }

        if (allow_comments_from !== undefined) {
            const dto = new AllowCommentsFromDto(userId, allow_comments_from);
            result = await userSettingsService.allowCommentsFrom(dto);
        }

        if (allow_mentions_from !== undefined) {
            const dto = new AllowMentionsFromDto(userId, allow_mentions_from);
            result = await userSettingsService.allowMentionsFrom(dto);
        }

        if(show_activity_status !== undefined) {
            const dto = new ShowActivityStatusDto(userId, show_activity_status);
            result = await userSettingsService.setShowActivityStatus(dto)

        }

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Privacy settings updated successfully",
                    result
                )
            );
    }
);
