export type NotificationType =
    | "follow"
    | "follow_request"
    | "follow_request_accepted"
    | "like_post"
    | "like_reel"
    | "like_comment"
    | "comment_post"
    | "comment_reel"
    | "reply_comment"
    | "repost_post"
    | "repost_reel"
    | "mention"
    | "mod_post_removed"
    | "mod_reel_removed"
    | "mod_account_disabled"
    | "mod_account_enabled"
    | "mod_warning";

export interface NotificationSender {
    user_id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
}

export interface AppNotification {
    _id: string;
    type: NotificationType;
    target_id: string | null;
    target_type: "post" | "reel" | "comment" | "user" | null;
    content: string | null;
    is_read: boolean;
    created_at: string;
    sender: NotificationSender;
}

export interface NotificationsResponse {
    notifications: AppNotification[];
    total: number;
    hasMore: boolean;
    page: number;
}
