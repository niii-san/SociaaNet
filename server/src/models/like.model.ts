import { LikeEntity } from "../types";
import mongoose from "mongoose";

const likeSchema = new mongoose.Schema<LikeEntity>(
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

export const Like = mongoose.model<LikeEntity>("Like", likeSchema);
export type LikeDocument = mongoose.HydratedDocument<LikeEntity>;
