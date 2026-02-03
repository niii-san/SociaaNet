import { Types } from "mongoose";

type PrivacyVisibility = "everyone" | "followers_only" | "no_one";

type BlockedUser = {
    user_id: Types.ObjectId;
    username: string;
    full_name: string;
    avatar_key: string;
};

interface PrivacySettings {
    private_account: boolean;
    allow_messages_from: PrivacyVisibility;
    allow_comments_from: PrivacyVisibility;
    allow_mentions_from: PrivacyVisibility;
    show_online_status: boolean;
    show_last_seen: boolean;
    blocked_users: BlockedUser[];
}

interface NotificationSettings {
    likes: boolean;
    comments: boolean;
    mentions: boolean;
    follows: boolean;
    messages: boolean;
}

type ThemeMode = "light" | "dark" | "system";
interface AppearanceSettings {
    theme: ThemeMode;
}

type FeedMode = "algorithmic" | "chronological";
interface FeedSettings {
    mode: FeedMode;
    show_sensitive_content: boolean;
}

interface SecuritySettings {
    login_alerts: boolean;
    active_session: {
        device: string;
        ip: string;
        last_activity: Date;
    }[];
}

export interface UserSettingsEntity {
    user_id: Types.ObjectId;
    privacy: PrivacySettings;
    notifications: NotificationSettings;
    appearance: AppearanceSettings;
    feed: FeedSettings;
    security: SecuritySettings;
}
