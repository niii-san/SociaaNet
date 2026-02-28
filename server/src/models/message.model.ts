import mongoose from "mongoose";
import { MessageEntity } from "../types";

const messageReactionSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        emoji: {
            type: String,
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
);

const messageReadReceiptSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        read_at: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
);

const messageSchema = new mongoose.Schema<MessageEntity>(
    {
        conversation_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true
        },
        sender_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            default: ""
        },
        message_type: {
            type: String,
            enum: ["text", "image", "video", "mixed"],
            default: "text"
        },
        media_urls: {
            type: [String],
            default: []
        },
        media_keys: {
            type: [String],
            default: []
        },
        reply_to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null
        },
        reactions: {
            type: [messageReactionSchema],
            default: []
        },
        read_by: {
            type: [messageReadReceiptSchema],
            default: []
        },
        is_deleted: {
            type: Boolean,
            default: false
        },
        deleted_at: {
            type: Date,
            default: null
        }
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

messageSchema.index({ conversation_id: 1, created_at: -1 });
messageSchema.index({ sender_id: 1 });

export const Message = mongoose.model("Message", messageSchema);
export type MessageDocument = mongoose.HydratedDocument<MessageEntity>;
