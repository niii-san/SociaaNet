import { Types } from "mongoose";
import { UserSettingsEntity } from "../types";

export const defaultUserSettings: UserSettingsEntity = {
    user_id: "" as unknown as Types.ObjectId,
    privacy: {
        private_account: false,
        allow_messages_from: "everyone",
        allow_comments_from: "everyone",
        allow_mentions_from: "everyone",
        show_online_status: true,
        show_last_seen: true,
        blocked_users: []
    },
    notifications: {
        likes: true,
        comments: true,
        mentions: true,
        follows: true,
        messages: true
    },
    appearance: {
        theme: "system"
    },
    feed: {
        mode: "algorithmic",
        show_sensitive_content: true
    },
    security: {
        login_alerts: true,
        sessions: []
    }
};
