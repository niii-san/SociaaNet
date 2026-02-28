import { ImageMetaDataEntity } from "../types";

import mongoose from "mongoose";

const imageMetaDataSchema = new mongoose.Schema<ImageMetaDataEntity>(
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

        post_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: null
        },

        image_id: {
            type: String,
            required: true,
            unique: true
        },
        visibility: {
            type: String,
            enum: ["public", "followers", "private", "chat_only"],
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

export type ImageMetaDataDocument =
    mongoose.HydratedDocument<ImageMetaDataEntity>;
export const ImageMetaData = mongoose.model<ImageMetaDataEntity>(
    "ImageMetaData",
    imageMetaDataSchema
);
