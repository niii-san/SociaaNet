import { ReelEntity } from "../types";
import mongoose from "mongoose";

const reelSchema = new mongoose.Schema<ReelEntity>(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        caption: { type: String, default: "" },
        hashtags: { type: [String], default: [] },
        likes_count: { type: Number, default: 0 },
        comments_count: { type: Number, default: 0 },
        reposts_count: { type: Number, default: 0 },
        views_count: { type: Number, default: 0 },
        is_deleted: { type: Boolean, default: false },
        visibility: {
            type: String,
            enum: ["public", "private", "followers"],
            default: "public"
        },
        is_sensitive_content: { type: Boolean, default: false },
        is_removed_by_moderator: { type: Boolean, default: false },
        media_key: { type: String, required: true },
        thumbnail_key: { type: String, required: true },
        duration_seconds: { type: Number, required: true }
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Reel = mongoose.model<ReelEntity>("Reel", reelSchema);
export type ReelDocument = mongoose.HydratedDocument<ReelEntity>;
