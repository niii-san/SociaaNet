import { FollowEntity } from "../types";

import mongoose from "mongoose";

const followSchema = new mongoose.Schema<FollowEntity>(
    {
        follower: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        following: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending"
        },
        is_removed: {
            type: Boolean,
            default: false
        },
        removed_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        removed_at: {
            type: Date,
            default: null
        },
        accepted_at: {
            type: Date,
            default: null
        },
        rejected_at: {
            type: Date,
            default: null
        }
    },
    { timestamps: { createdAt: "followed_at", updatedAt: "updated_at" } }
);

followSchema.index({ follower: 1, following: 1 }, { unique: true });

export const Follow = mongoose.model("Follow", followSchema);
export type FollowDocument = mongoose.HydratedDocument<FollowEntity>;
