import { Types } from "mongoose";

export interface ReelEntity {
    _id: Types.ObjectId;
    author: Types.ObjectId;
    caption: string;
    hashtags: string[];
    likes_count: number;
    comments_count: number;
    views_count: number;
    is_deleted: boolean;
    visibility: "public" | "private" | "followers";
    is_sensitive_content: boolean;
    is_removed_by_moderator: boolean;
    media_key: string;
    thumbnail_key: string;
    duration_seconds: number;
    created_at: Date;
    updated_at: Date;
}
