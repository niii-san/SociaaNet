import mongoose from "mongoose";
import { NotificationEntity } from "../types/notification.type";

const notificationSchema = new mongoose.Schema<NotificationEntity>(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
            index: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        type: {
            type: String,
            required: true,
            enum: [
                "follow",
                "follow_request",
                "follow_request_accepted",
                "like_post",
                "like_reel",
                "like_comment",
                "comment_post",
                "comment_reel",
                "reply_comment",
                "repost_post",
                "repost_reel",
                "mention"
            ]
        },
        target_id: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        target_type: {
            type: String,
            enum: ["post", "reel", "comment", "user"],
            default: null
        },
        content: {
            type: String,
            default: null
        },
        is_read: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    }
);

// Compound index for efficient queries
notificationSchema.index({ recipient: 1, is_read: 1, created_at: -1 });
notificationSchema.index({ recipient: 1, created_at: -1 });
// Prevent duplicate notifications for same event
notificationSchema.index(
    { recipient: 1, sender: 1, type: 1, target_id: 1 },
    { unique: true, partialFilterExpression: { target_id: { $ne: null } } }
);

export const Notification = mongoose.model("Notification", notificationSchema);
export type NotificationDocument =
    mongoose.HydratedDocument<NotificationEntity>;
