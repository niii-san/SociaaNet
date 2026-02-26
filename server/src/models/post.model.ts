import mongoose, { Document, Schema } from "mongoose";
import { PostEntity } from "../types";

const postSchema = new Schema<PostEntity>(
    {
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        caption: { type: String, default: "" },
        hashtags: { type: [String], default: [] },
        likes_count: { type: Number, default: 0 },
        comments_count: { type: Number, default: 0 },
        is_deleted: { type: Boolean, default: false },
        visibility: {
            type: String,
            enum: ["public", "private", "followers"],
            default: "public"
        },
        is_sensitive_content: { type: Boolean, default: false },
        is_removed_by_moderator: { type: Boolean, default: false },
        deleted_at: { type: Date, default: null },
        media_keys: { type: [String], default: [] }
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Post = mongoose.model<PostEntity>("Post", postSchema);
export type PostDocument = mongoose.HydratedDocument<PostEntity>;
