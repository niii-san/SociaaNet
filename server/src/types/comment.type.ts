import { Types } from "mongoose";

export interface CommentEntity {
    _id: Types.ObjectId;
    author: Types.ObjectId;
    target_id: Types.ObjectId;
    target_type: "post" | "reel";
    content: string;
    parent_comment_id?: Types.ObjectId;
    likes_count: number;
    is_deleted: boolean;
    created_at: Date;
}
