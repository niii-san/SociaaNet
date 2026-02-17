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
        is_private_account: {
            type: Boolean,
            default: false
        },
        is_email_verified: {
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
        },
        role: {
            type: String,
            enum: ["user", "moderator", "system_admin"],
            default: "user"
        }
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

userSchema.index({ username: 1, full_name: 1 });

export const User = mongoose.model("User", userSchema);
export type UserDocument = mongoose.HydratedDocument<UserEntity>;
