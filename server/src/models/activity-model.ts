import mongoose from "mongoose";
import { ActivityEntity, ActivityVerb } from "../types";

const activitySchema = new mongoose.Schema<ActivityEntity>(
    {
        verb: {
            type: String,
            enum: Object.values(ActivityVerb),
            required: true
        },
        actor: {
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        },
        target: {
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            post_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post"
            },
            reel_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Reel"
            },
            comment_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        },
        metadata: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
            default: {}
        },
        visibility: {
            type: String,
            enum: ["public", "private", "system"],
            required: true
        }
    },
    { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export const Activity = mongoose.model<ActivityEntity>(
    "Activity",
    activitySchema
);
export type ActivityDocument = mongoose.HydratedDocument<ActivityEntity>;
