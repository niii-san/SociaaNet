import { Types } from "mongoose";

export enum ActivityVerb {
    // Social
    followed = "followed",
    unfollowed = "unfollowed",
    follow_request_sent = "follow_request_sent",
    follow_request_accepted = "follow_request_accepted",

    // Content
    post_created = "post_created",
    post_deleted = "post_deleted",
    reel_created = "reel_created",
    reel_deleted = "reel_deleted",
    repost_created = "repost_created",
    repost_deleted = "repost_deleted",

    // Interaction
    post_liked = "post_liked",
    post_unliked = "post_unliked",
    comment_created = "comment_created",
    comment_deleted = "comment_deleted",
    repost_liked = "repost_liked",
    repost_unliked = "repost_unliked",

    // Profile
    username_updated = "username_updated",
    bio_updated = "bio_updated",
    full_name_updated = "full_name_updated",
    avatar_updated = "avatar_updated",

    // Privacy
    privacy_settings_updated = "privacy_settings_updated",

    // Moderation
    account_reported = "account_reported",

    // Account
    email_verified = "email_verified",
    password_changed = "password_changed",
    logged_in = "logged_in"
}

interface ActivityActor {
    user_id: Types.ObjectId;
}

interface ActivityTarget {
    user_id?: Types.ObjectId;
    post_id?: Types.ObjectId;
    reel_id?: Types.ObjectId;
    comment_id?: Types.ObjectId;
}

export interface ActivityEntity {
    verb: ActivityVerb;
    actor: ActivityActor;
    target?: ActivityTarget;
    metadata?: Record<string, any>;
    visibility: "public" | "private" | "system";
    created_at: Date;
}
