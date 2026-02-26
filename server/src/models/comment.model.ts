import { CommentEntity } from "../types";
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema<CommentEntity>(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        target_id: { type: mongoose.Schema.Types.ObjectId, required: true },
        target_type: { type: String, enum: ["post", "reel"], required: true },
        content: { type: String, required: true },
        parent_comment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null
        },
        is_deleted: { type: Boolean, required: true, default: false }
    },
    { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export const Comment = mongoose.model<CommentEntity>("Comment", commentSchema);
export type CommentDocument = mongoose.HydratedDocument<CommentEntity>;
