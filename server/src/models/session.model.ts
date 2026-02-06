import mongoose from "mongoose";

import { SessionEntity } from "../types";

const sessionSchema = new mongoose.Schema<SessionEntity>(
    {
        session_id: {
            type: String,
            required: true
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        is_expired: {
            type: Boolean,
            required: true,
            default: false
        },
        ip: {
            type: String,
            required: true
        },
        last_activity: {
            type: Date,
            required: true,
            default: Date.now
        },
        device: {
            type: String,
            required: true
        },
        expires_at: {
            type: Date,
            required: true
        }
    },
    { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export const Session = mongoose.model("Session", sessionSchema);
export type SessionDocument = mongoose.HydratedDocument<SessionEntity>;
