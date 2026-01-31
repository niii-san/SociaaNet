import { ImageEntity } from "../types";

import mongoose from "mongoose";

const imageSchema = new mongoose.Schema<ImageEntity>(
    {
        uploader_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        chat_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            default: null
        },
        image_key: {
            type: String,
            required: true
        },
        image_id: {
            type: String,
            required: true,
            unique: true
        },
        visibility: {
            type: String,
            enum: ["public", "followers", "chat_only"],
            required: true
        },
        is_deleted: {
            type: Boolean,
            required: true,
            default: false
        },
        deleted_at: {
            type: Date,
            default: null
        }
    },
    { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export type ImageDocument = mongoose.HydratedDocument<ImageEntity>;
export const Image = mongoose.model<ImageEntity>("Image", imageSchema);
