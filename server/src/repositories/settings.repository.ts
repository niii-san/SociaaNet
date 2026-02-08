import mongoose from "mongoose";
import { ErrorCodes } from "../constants/error-code";
import { User, UserSettings } from "../models";

interface ISettingsRepository {
    // Privacy Settings
    enablePrivateAccount(
        userId: string
    ): Promise<{ is_private_account: boolean }>;
    disablePrivateAccount(
        userId: string
    ): Promise<{ is_private_account: boolean }>;

    allowMessageRequestsFromEveryone(
        userId: string
    ): Promise<{ allow_messages_from: string }>;
    allowMessageRequestsFromFollowersOnly(
        userId: string
    ): Promise<{ allow_messages_from: string }>;
    allowMessageRequestsFromNoOne(
        userId: string
    ): Promise<{ allow_messages_from: string }>;

    allowCommentsFromEveryone(
        userId: string
    ): Promise<{ allow_comments_from: string }>;
    allowCommentsFromFollowersOnly(
        userId: string
    ): Promise<{ allow_comments_from: string }>;
    allowCommentsFromNoOne(
        userId: string
    ): Promise<{ allow_comments_from: string }>;

    allowMentionsFromEveryone(
        userId: string
    ): Promise<{ allow_mentions_from: string }>;
    allowMentionsFromFollowersOnly(
        userId: string
    ): Promise<{ allow_mentions_from: string }>;
    allowMentionsFromNoOne(
        userId: string
    ): Promise<{ allow_mentions_from: string }>;

    setShowOnlineStatus(
        userId: string,
        show: boolean
    ): Promise<{ show_online_status: boolean }>;
    setShowLastSeen(userId: string, show: boolean): Promise<void>; // TODO: REMOVE ShowLastSeen

    blockUser(
        userId: string,
        blockedUserId: string
    ): Promise<{
        blocked_user: {
            user_id: string;
            username: string;
            full_name: string;
            avatar_key: string;
        };
    }>;
    unblockUser(
        userId: string,
        blockedUserId: string
    ): Promise<{ unblocked_user_id: string }>;

    // Notification Settings
    setLikesNotifications(
        userId: string,
        enabled: boolean
    ): Promise<{ likes: boolean }>;
    setCommentsNotifications(
        userId: string,
        enabled: boolean
    ): Promise<{ comments: boolean }>;
    setMentionsNotifications(
        userId: string,
        enabled: boolean
    ): Promise<{ mentions: boolean }>;
    setFollowsNotifications(
        userId: string,
        enabled: boolean
    ): Promise<{ follows: boolean }>;
    setMessagesNotifications(
        userId: string,
        enabled: boolean
    ): Promise<{ messages: boolean }>;

    // Appearance Settings
    setThemeMode(
        userId: string,
        mode: "light" | "dark" | "system"
    ): Promise<{ theme: string }>;

    // Feed Settings
    setFeedMode(
        userId: string,
        mode: "algorithmic" | "chronological"
    ): Promise<{ mode: string }>;
    setShowSensitiveContent(
        userId: string,
        show: boolean
    ): Promise<{ show_sensitive_content: boolean }>;

    // Security Settings
    setLoginAlerts(
        userId: string,
        enabled: boolean
    ): Promise<{ login_alerts: boolean }>;
}

class SettingsRepository implements ISettingsRepository {
    // Privacy Settings
    async enablePrivateAccount(
        userId: string
    ): Promise<{ is_private_account: boolean }> {
        const session = await mongoose.startSession();

        try {
            let updated = false;

            await session.withTransaction(async () => {
                const settingsRes = await UserSettings.updateOne(
                    { user_id: userId },
                    { $set: { "privacy.private_account": true } },
                    { session }
                );

                if (
                    settingsRes.modifiedCount === 0 &&
                    settingsRes.matchedCount === 0
                ) {
                    throw new Error(
                        "Invariant violation: UserSettings document not found for user_id: " +
                        userId
                    );
                }

                await User.updateOne(
                    {
                        _id: userId
                    },
                    {
                        $set: {
                            is_private_account: true
                        }
                    },
                    { session }
                );

                updated = settingsRes.modifiedCount > 0;
            });
            return { is_private_account: true };
        } finally {
            await session.endSession();
        }
    }

    async disablePrivateAccount(
        userId: string
    ): Promise<{ is_private_account: boolean }> {
        const session = await mongoose.startSession();

        try {
            let updated = false;

            await session.withTransaction(async () => {
                const settingsRes = await UserSettings.updateOne(
                    {
                        user_id: userId
                    },
                    {
                        $set: {
                            "privacy.private_account": false
                        }
                    },
                    { session }
                );

                if (
                    settingsRes.modifiedCount === 0 &&
                    settingsRes.matchedCount === 0
                ) {
                    throw new Error(
                        "Invariant violation: UserSettings document not found for user_id: " +
                        userId
                    );
                }

                await User.updateOne(
                    { _id: userId },
                    {
                        $set: {
                            is_private_account: false
                        }
                    },
                    { session }
                );

                updated = settingsRes.modifiedCount > 0;
            });

            return { is_private_account: false };
        } finally {
            await session.endSession();
        }
    }

    async allowMessageRequestsFromEveryone(
        userId: string
    ): Promise<{ allow_messages_from: string }> {
        throw new Error("Method not implemented.");
    }

    async allowMessageRequestsFromFollowersOnly(
        userId: string
    ): Promise<{ allow_messages_from: string }> {
        throw new Error("Method not implemented.");
    }

    async allowMessageRequestsFromNoOne(
        userId: string
    ): Promise<{ allow_messages_from: string }> {
        throw new Error("Method not implemented.");
    }

    async allowCommentsFromEveryone(
        userId: string
    ): Promise<{ allow_comments_from: string }> {
        throw new Error("Method not implemented.");
    }

    async allowCommentsFromFollowersOnly(
        userId: string
    ): Promise<{ allow_comments_from: string }> {
        throw new Error("Method not implemented.");
    }

    async allowCommentsFromNoOne(
        userId: string
    ): Promise<{ allow_comments_from: string }> {
        throw new Error("Method not implemented.");
    }

    async allowMentionsFromEveryone(
        userId: string
    ): Promise<{ allow_mentions_from: string }> {
        throw new Error("Method not implemented.");
    }

    async allowMentionsFromFollowersOnly(
        userId: string
    ): Promise<{ allow_mentions_from: string }> {
        throw new Error("Method not implemented.");
    }

    async allowMentionsFromNoOne(
        userId: string
    ): Promise<{ allow_mentions_from: string }> {
        throw new Error("Method not implemented.");
    }

    async setShowOnlineStatus(
        userId: string,
        show: boolean
    ): Promise<{ show_online_status: boolean }> {
        throw new Error("Method not implemented.");
    }

    async setShowLastSeen(userId: string, show: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async blockUser(
        userId: string,
        blockedUserId: string
    ): Promise<{
        blocked_user: {
            user_id: string;
            username: string;
            full_name: string;
            avatar_key: string;
        };
    }> {
        throw new Error("Method not implemented.");
    }

    async unblockUser(
        userId: string,
        blockedUserId: string
    ): Promise<{ unblocked_user_id: string }> {
        throw new Error("Method not implemented.");
    }

    // Notification Settings
    async setLikesNotifications(
        userId: string,
        enabled: boolean
    ): Promise<{ likes: boolean }> {
        throw new Error("Method not implemented.");
    }

    async setCommentsNotifications(
        userId: string,
        enabled: boolean
    ): Promise<{ comments: boolean }> {
        throw new Error("Method not implemented.");
    }

    async setMentionsNotifications(
        userId: string,
        enabled: boolean
    ): Promise<{ mentions: boolean }> {
        throw new Error("Method not implemented.");
    }

    async setFollowsNotifications(
        userId: string,
        enabled: boolean
    ): Promise<{ follows: boolean }> {
        throw new Error("Method not implemented.");
    }

    async setMessagesNotifications(
        userId: string,
        enabled: boolean
    ): Promise<{ messages: boolean }> {
        throw new Error("Method not implemented.");
    }

    // Appearance Settings

    async setThemeMode(
        userId: string,
        mode: "light" | "dark" | "system"
    ): Promise<{ theme: string }> {
        throw new Error("Method not implemented.");
    }

    // Feed Settings
    async setFeedMode(
        userId: string,
        mode: "algorithmic" | "chronological"
    ): Promise<{ mode: string }> {
        throw new Error("Method not implemented.");
    }

    async setShowSensitiveContent(
        userId: string,
        show: boolean
    ): Promise<{ show_sensitive_content: boolean }> {
        throw new Error("Method not implemented.");
    }

    // Security Settings
    async setLoginAlerts(
        userId: string,
        enabled: boolean
    ): Promise<{ login_alerts: boolean }> {
        throw new Error("Method not implemented.");
    }
}

export const settingsRepo = new SettingsRepository();
