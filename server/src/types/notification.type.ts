import { Types } from "mongoose";

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

export interface NotificationEntity {
    _id: Types.ObjectId;
    recipient: Types.ObjectId;
    sender: Types.ObjectId;
    type: NotificationType;
    target_id?: Types.ObjectId;
    target_type?: "post" | "reel" | "comment" | "user";
    content?: string;
    is_read: boolean;
    created_at: Date;
    updated_at: Date;
}
