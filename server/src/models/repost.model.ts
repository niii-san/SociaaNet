import { RepostEntity } from "../types";
import mongoose from "mongoose";

const repostSchema = new mongoose.Schema<RepostEntity>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        target_id: { type: mongoose.Schema.Types.ObjectId, required: true },
        target_type: {
            type: String,
            enum: ["post", "reel"],
            required: true
        }
    },
    { timestamps: { createdAt: "created_at", updatedAt: false } }
);

// A user can only repost a target once
repostSchema.index({ user: 1, target_id: 1, target_type: 1 }, { unique: true });

export const Repost = mongoose.model<RepostEntity>("Repost", repostSchema);
export type RepostDocument = mongoose.HydratedDocument<RepostEntity>;
