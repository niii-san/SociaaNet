import { SavedItemEntity } from "../types";
import mongoose from "mongoose";

const savedItemSchema = new mongoose.Schema<SavedItemEntity>(
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

// A user can only save a target once
savedItemSchema.index({ user: 1, target_id: 1, target_type: 1 }, { unique: true });

export const SavedItem = mongoose.model<SavedItemEntity>("SavedItem", savedItemSchema);
export type SavedItemDocument = mongoose.HydratedDocument<SavedItemEntity>;
