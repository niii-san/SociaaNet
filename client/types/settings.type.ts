export type PrivacyVisibility = "everyone" | "followers_only" | "no_one";

export type BlockedUser = {
    user_id: string;
    username: string;
    full_name: string;
    avatar_key: string;
};

export interface PrivacySettings {
    private_account: boolean;
    allow_messages_from: PrivacyVisibility;
    allow_comments_from: PrivacyVisibility;
    allow_mentions_from: PrivacyVisibility;
    show_online_status: boolean;
    show_last_seen: boolean;
    blocked_users: BlockedUser[];
}

export interface NotificationSettings {
    likes: boolean;
    comments: boolean;
    mentions: boolean;
    follows: boolean;
    messages: boolean;
}

export type ThemeMode = "light" | "dark" | "system";

export interface AppearanceSettings {
    theme: ThemeMode;
}

export type FeedMode = "algorithmic" | "chronological";

export interface FeedSettings {
    mode: FeedMode;
    show_sensitive_content: boolean;
}

export interface SecuritySettings {
    login_alerts: boolean;
    sessions: {
        device: string;
        ip: string;
        last_activity: string;
        has_expired: boolean;
        is_deleted: boolean;
    }[];
}

export interface UserSettings {
    user_id: string;
    privacy: PrivacySettings;
    notifications: NotificationSettings;
    appearance: AppearanceSettings;
    feed: FeedSettings;
    security: SecuritySettings;
}
