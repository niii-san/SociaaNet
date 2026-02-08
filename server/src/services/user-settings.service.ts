import mongoose, { Types } from "mongoose";
import {
    EnablePrivateAccountDto,
    DisablePrivateAccountDto,
    AllowMessagesFromDto
} from "../dtos";
import { settingsRepo, activityRepo } from "../repositories";
import { ActivityVerb } from "../types";
import { HttpError } from "../utils";
import { ErrorCodes } from "../constants/error-code";

class UserSettingsService {
    async enablePrivateAccount(
        dto: EnablePrivateAccountDto
    ): Promise<{ is_private_account: boolean }> {
        const userId = new Types.ObjectId(dto.userId);

        const value = await settingsRepo.enablePrivateAccount(
            userId.toString()
        );

        await activityRepo.createActivity({
            verb: ActivityVerb.private_account_enabled,
            actor: {
                user_id: userId
            },
            target: {
                user_id: userId
            },
            metadata: {
                is_private_account: value.is_private_account
            },
            visibility: "private"
        });

        return value;
    }

    async disablePrivateAccount(
        dto: DisablePrivateAccountDto
    ): Promise<{ is_private_account: boolean }> {
        const userId = new Types.ObjectId(dto.userId);

        const value = await settingsRepo.disablePrivateAccount(
            userId.toString()
        );

        await activityRepo.createActivity({
            verb: ActivityVerb.private_account_disabled,
            actor: {
                user_id: userId
            },
            target: {
                user_id: userId
            },
            metadata: {
                is_private_account: value.is_private_account
            },
            visibility: "private"
        });

        return value;
    }

    async allowMessagesFrom(dto: AllowMessagesFromDto) {
        const userId = new Types.ObjectId(dto.userId);
        const allowMessagesFrom = dto.allowMessagesFrom;

        const allowedValues = ["everyone", "followers_only", "no_one"];
        let result;

        if (!allowedValues.includes(allowMessagesFrom)) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid value for allow_messages_from"
            );
        }

        if (allowMessagesFrom === "everyone") {
            result = await settingsRepo.allowMessagesFromEveryone(
                userId.toString()
            );
        } else if (allowMessagesFrom === "followers_only") {
            result = await settingsRepo.allowMessagesFromFollowersOnly(
                userId.toString()
            );
        } else if (allowMessagesFrom === "no_one") {
            result = await settingsRepo.allowMessagesFromNoOne(
                userId.toString()
            );
        } else {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid value for allow_messages_fromx"
            );
        }
        return result;
    }
}

export const userSettingsService = new UserSettingsService();
