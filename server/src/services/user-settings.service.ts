import mongoose, { Types } from "mongoose";
import { EnablePrivateAccountDto, DisablePrivateAccountDto } from "../dtos";
import { settingsRepo, activityRepo } from "../repositories";
import { ActivityVerb } from "../types";

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
}

export const userSettingsService = new UserSettingsService();
