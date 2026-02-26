import { Types } from "mongoose";

export interface CommentEntity {
    _id: Types.ObjectId;
    author: Types.ObjectId;
    target_id: Types.ObjectId;
    target_type: "post" | "reel";
    content: string;
    parent_comment_id?: Types.ObjectId;
    is_deleted: boolean;
}
