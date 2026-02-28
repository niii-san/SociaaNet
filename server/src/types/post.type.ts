import { Types } from "mongoose";

export interface PostEntity {
    _id: Types.ObjectId;
    author: Types.ObjectId;
    caption: string;
    hashtags: string[];
    likes_count: number;
    comments_count: number;
    reposts_count: number;
    is_deleted: boolean;
    visibility: "public" | "private" | "followers";
    is_sensitive_content: boolean;
    is_removed_by_moderator: boolean;
    media_keys: string[];
    deleted_at: Date | null;
    created_at: Date;
    updated_at: Date;
}
