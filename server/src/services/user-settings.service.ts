import { Types } from "mongoose";
import {
    EnablePrivateAccountDto,
    DisablePrivateAccountDto,
    AllowMessagesFromDto,
    AllowCommentsFromDto,
    AllowMentionsFromDto,
    ShowActivityStatusDto,
    SetLikesNotificationDto,
    SetCommentsNotificationDto,
    SetMentionsNotificationDto,
    SetMessagesNotificationDto,
    SetFollowsNotificationDto,
    SetThemeDto
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

    async setShowActivityStatus(dto: ShowActivityStatusDto) {
        const userId = dto.user_id;

        const showActivityStatus = dto.show_activity_status;

        if (typeof showActivityStatus !== "boolean") {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "show_activity_status must be a boolean"
            );
        }

        const result = await settingsRepo.setShowActivityStatus(
            userId,
            showActivityStatus
        );

        await activityRepo.createActivity({
            verb: ActivityVerb.privacy_settings_updated,
            actor: {
                user_id: new Types.ObjectId(userId)
            },
            target: {
                user_id: new Types.ObjectId(userId)
            },
            metadata: {
                show_activity_status: showActivityStatus
            },
            visibility: "private"
        });

        return result;
    }

    async setLikesNotification(dto: SetLikesNotificationDto) {
        const userId = dto.userId;
        const enabled = dto.value;

        if (typeof enabled !== "boolean") {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "likes value must be a boolean"
            );
        }

        const result = await settingsRepo.setLikesNotifications(
            userId,
            enabled
        );

        await activityRepo.createActivity({
            verb: ActivityVerb.notification_settings_updated,
            actor: {
                user_id: new Types.ObjectId(userId)
            },
            target: {
                user_id: new Types.ObjectId(userId)
            },
            metadata: {
                likes_notifications: enabled
            },
            visibility: "private"
        });

        return result;
    }
    async setCommentsNotification(dto: SetCommentsNotificationDto) {
        const userId = dto.userId;
        const enabled = dto.value;

        if (typeof enabled !== "boolean") {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "comments value must be a boolean"
            );
        }

        const result = await settingsRepo.setCommentsNotifications(
            userId,
            enabled
        );

        await activityRepo.createActivity({
            verb: ActivityVerb.notification_settings_updated,
            actor: {
                user_id: new Types.ObjectId(userId)
            },
            target: {
                user_id: new Types.ObjectId(userId)
            },
            metadata: {
                comments_notifications: enabled
            },
            visibility: "private"
        });

        return result;
    }
    async setMentionsNotification(dto: SetMentionsNotificationDto) {
        const userId = dto.userId;
        const enabled = dto.value;

        if (typeof enabled !== "boolean") {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "mentions value must be a boolean"
            );
        }

        const result = await settingsRepo.setMentionsNotifications(
            userId,
            enabled
        );

        await activityRepo.createActivity({
            verb: ActivityVerb.notification_settings_updated,
            actor: {
                user_id: new Types.ObjectId(userId)
            },
            target: {
                user_id: new Types.ObjectId(userId)
            },
            metadata: {
                mentions_notifications: enabled
            },
            visibility: "private"
        });

        return result;
    }
    async setFollowsNotification(dto: SetFollowsNotificationDto) {
        const userId = dto.userId;
        const enabled = dto.value;

        if (typeof enabled !== "boolean") {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "follows value must be a boolean"
            );
        }

        const result = await settingsRepo.setFollowsNotifications(
            userId,
            enabled
        );

        await activityRepo.createActivity({
            verb: ActivityVerb.notification_settings_updated,
            actor: {
                user_id: new Types.ObjectId(userId)
            },
            target: {
                user_id: new Types.ObjectId(userId)
            },
            metadata: {
                follows_notifications: enabled
            },
            visibility: "private"
        });

        return result;
    }
    async setMessagesNotification(dto: SetMessagesNotificationDto) {
        const userId = dto.userId;
        const enabled = dto.value;

        if (typeof enabled !== "boolean") {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "messages value must be a boolean"
            );
        }

        const result = await settingsRepo.setMessagesNotifications(
            userId,
            enabled
        );

        await activityRepo.createActivity({
            verb: ActivityVerb.notification_settings_updated,
            actor: {
                user_id: new Types.ObjectId(userId)
            },
            target: {
                user_id: new Types.ObjectId(userId)
            },
            metadata: {
                messages_notifications: enabled
            },
            visibility: "private"
        });

        return result;
    }

    async setTheme(dto: SetThemeDto) {
        const userId = dto.userId.toString();
        const theme = dto.theme ?? "".trim();
        const allowedValues = ["light", "dark", "system"];

        if (!theme) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Theme value is required"
            );
        }

        if (!allowedValues.includes(theme)) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid theme value. Allowed values are: light, dark, system"
            );
        }

        const res = await settingsRepo.setThemeMode(
            userId,
            theme as "light" | "dark" | "system"
        );

        await activityRepo.createActivity({
            verb: ActivityVerb.appearance_settings_updated,
            actor: {
                user_id: new Types.ObjectId(userId)
            },
            target: {
                user_id: new Types.ObjectId(userId)
            },
            metadata: {
                theme_mode: theme
            },
            visibility: "private"
        });

        return res;
    }
}

export const userSettingsService = new UserSettingsService();
