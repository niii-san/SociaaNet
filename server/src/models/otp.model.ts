import { OtpEntity } from "../types";
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema<OtpEntity>(
    {
        email: {
            type: String,
            required: true
        },
        user_id: {
            type: String,
            required: true
        },
        otp: {
            type: String,
            required: true
        },
        otp_type: {
            type: String,
            enum: ["email_verification", "password_reset"],
            required: true
        },
        has_expired: {
            type: Boolean,
            required: true,
            default: false
        },
        is_used: {
            type: Boolean,
            required: true,
            default: false
        },
        expires_at: {
            type: Date,
            required: true
        }
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
// otpSchema.pre<OtpEntity>("findOne", async function(doc) {
//     if (!doc) return;
//
//     const now = new Date();
//
//     if (doc.expires_at < now && !doc.has_expired) {
//         doc.has_expired = true;
//         await doc.save();
//     }
// });

export type OtpDocument = mongoose.HydratedDocument<OtpEntity>;
export const Otp = mongoose.model<OtpEntity>("Otp", otpSchema);
