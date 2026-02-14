import mongoose, { Types } from "mongoose";
import {
    EnablePrivateAccountDto,
    DisablePrivateAccountDto,
    AllowMessagesFromDto,
    AllowCommentsFromDto,
    AllowMentionsFromDto
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
            verb: ActivityVerb.privacy_settings_updated,
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
            verb: ActivityVerb.privacy_settings_updated,
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
            await activityRepo.createActivity({
                verb: ActivityVerb.privacy_settings_updated,
                actor: {
                    user_id: userId
                },
                target: {
                    user_id: userId
                },
                metadata: {
                    allow_messages_from: allowMessagesFrom
                },
                visibility: "private"
            });
        } else if (allowMessagesFrom === "followers_only") {
            result = await settingsRepo.allowMessagesFromFollowersOnly(
                userId.toString()
            );

            await activityRepo.createActivity({
                verb: ActivityVerb.privacy_settings_updated,
                actor: {
                    user_id: userId
                },
                target: {
                    user_id: userId
                },
                metadata: {
                    allow_messages_from: allowMessagesFrom
                },
                visibility: "private"
            });
        } else if (allowMessagesFrom === "no_one") {
            result = await settingsRepo.allowMessagesFromNoOne(
                userId.toString()
            );
            await activityRepo.createActivity({
                verb: ActivityVerb.privacy_settings_updated,
                actor: {
                    user_id: userId
                },
                target: {
                    user_id: userId
                },
                metadata: {
                    allow_messages_from: allowMessagesFrom
                },
                visibility: "private"
            });
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

    async allowCommentsFrom(dto: AllowCommentsFromDto) {
        const userId = new Types.ObjectId(dto.userId);
        const allowCommentsFrom = dto.allowCommentsFrom;

        const allowedValues = ["everyone", "followers_only", "no_one"];
        let result;

        if (!allowedValues.includes(allowCommentsFrom)) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid value for allow_comments_from"
            );
        }

        if (allowCommentsFrom === "everyone") {
            result = await settingsRepo.allowCommentsFromEveryone(
                userId.toString()
            );
            await activityRepo.createActivity({
                verb: ActivityVerb.privacy_settings_updated,
                actor: {
                    user_id: userId
                },
                target: {
                    user_id: userId
                },
                metadata: {
                    allow_comments_from: allowCommentsFrom
                },
                visibility: "private"
            });
        } else if (allowCommentsFrom === "followers_only") {
            result = await settingsRepo.allowCommentsFromFollowersOnly(
                userId.toString()
            );

            await activityRepo.createActivity({
                verb: ActivityVerb.privacy_settings_updated,
                actor: {
                    user_id: userId
                },
                target: {
                    user_id: userId
                },
                metadata: {
                    allow_comments_from: allowCommentsFrom
                },
                visibility: "private"
            });
        } else if (allowCommentsFrom === "no_one") {
            result = await settingsRepo.allowCommentsFromNoOne(
                userId.toString()
            );
            await activityRepo.createActivity({
                verb: ActivityVerb.privacy_settings_updated,
                actor: {
                    user_id: userId
                },
                target: {
                    user_id: userId
                },
                metadata: {
                    allow_comments_from: allowCommentsFrom
                },
                visibility: "private"
            });
        } else {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid value for allow_comments_from"
            );
        }

        return result;
    }

    async allowMentionsFrom(dto: AllowMentionsFromDto) {
        const userId = new Types.ObjectId(dto.userId);
        const allowMentionsFrom = dto.allowMentionsFrom;

        const allowedValues = ["everyone", "followers_only", "no_one"];
        let result;

        if (!allowedValues.includes(allowMentionsFrom)) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid value for allow_mentions_from"
            );
        }

        if (allowMentionsFrom === "everyone") {
            result = await settingsRepo.allowMentionsFromEveryone(
                userId.toString()
            );
            await activityRepo.createActivity({
                verb: ActivityVerb.privacy_settings_updated,
                actor: {
                    user_id: userId
                },
                target: {
                    user_id: userId
                },
                metadata: {
                    allow_mentions_from: allowMentionsFrom
                },
                visibility: "private"
            });
        } else if (allowMentionsFrom === "followers_only") {
            result = await settingsRepo.allowMentionsFromFollowersOnly(
                userId.toString()
            );
            await activityRepo.createActivity({
                verb: ActivityVerb.privacy_settings_updated,
                actor: {
                    user_id: userId
                },
                target: {
                    user_id: userId
                },
                metadata: {
                    allow_mentions_from: allowMentionsFrom
                },
                visibility: "private"
            });
        } else if (allowMentionsFrom === "no_one") {
            result = await settingsRepo.allowMentionsFromNoOne(
                userId.toString()
            );
            await activityRepo.createActivity({
                verb: ActivityVerb.privacy_settings_updated,
                actor: {
                    user_id: userId
                },
                target: {
                    user_id: userId
                },
                metadata: {
                    allow_mentions_from: allowMentionsFrom
                },
                visibility: "private"
            });
        } else {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid value for allow_mentions_from"
            );
        }

        return result;
    }
}

export const userSettingsService = new UserSettingsService();
