import { WatchHistoryEntity } from "../types";
import mongoose from "mongoose";

const watchHistorySchema = new mongoose.Schema<WatchHistoryEntity>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        target_id: { type: mongoose.Schema.Types.ObjectId, required: true },
        target_type: { type: String, enum: ["post", "reel"], required: true }
    },
    { timestamps: { createdAt: "created_at", updatedAt: false } }
);

// Ensure one view per user per target
watchHistorySchema.index(
    { user: 1, target_id: 1, target_type: 1 },
    { unique: true }
);

export const WatchHistory = mongoose.model<WatchHistoryEntity>(
    "WatchHistory",
    watchHistorySchema
);
export type WatchHistoryDocument =
    mongoose.HydratedDocument<WatchHistoryEntity>;
