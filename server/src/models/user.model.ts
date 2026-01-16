import mongoose from "mongoose";

import { UserSchema } from "../types";

const userSchema = new mongoose.Schema<UserSchema>(
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
        password: {
            type: String,
            required: true
        }
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const User = mongoose.model("User", userSchema);

export interface IUser extends UserSchema, mongoose.Document {
    _id: mongoose.Types.ObjectId;
}
