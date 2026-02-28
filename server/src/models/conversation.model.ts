import mongoose from "mongoose";
import { ConversationEntity } from "../types";

const conversationSchema = new mongoose.Schema<ConversationEntity>(
    {
        type: {
            type: String,
            enum: ["direct", "group"],
            required: true
        },
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ],
        group_name: {
            type: String,
            default: null
        },
        group_avatar_key: {
            type: String,
            default: null
        },
        group_admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        last_message: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null
        },
        last_message_at: {
            type: Date,
            default: null
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        deleted_by: [
            {
                user_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                deleted_at: {
                    type: Date,
                    default: Date.now
                },
                _id: false
            }
        ]
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ last_message_at: -1 });

export const Conversation = mongoose.model("Conversation", conversationSchema);
export type ConversationDocument =
    mongoose.HydratedDocument<ConversationEntity>;
