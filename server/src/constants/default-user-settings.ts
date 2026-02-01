import { UserSettingsEntity } from "../types";

export const defaultUserSettings: UserSettingsEntity = {
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
        hide_sensitive_content: false,
        hide_nsfw_content: false
    },
    security: {
        login_alerts: true,
        active_session: []
    }
};
