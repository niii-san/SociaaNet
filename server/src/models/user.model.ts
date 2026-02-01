import mongoose from "mongoose";

import { UserEntity } from "../types";

const userSchema = new mongoose.Schema<UserEntity>(
    {
        email_address: {
            type: String,
            required: true
        },
        full_name: String,
        username: {
            type: String,
            required: true
        },
        is_disabled: {
            type: Boolean,
            default: false
        },
        bio: {
            type: String,
            default: ""
        },
        password: {
            type: String,
            required: true
        },
        avatar_key: {
            type: String,
            default: null
        }
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const User = mongoose.model("User", userSchema);
export type UserDocument = mongoose.HydratedDocument<UserEntity>;
