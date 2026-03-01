import mongoose from "mongoose";
import { ReportEntity } from "../types/report.type";

const reportSchema = new mongoose.Schema<ReportEntity>(
    {
        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        target_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        target_type: {
            type: String,
            enum: ["post", "reel", "comment", "user"],
            required: true
        },
        reason: {
            type: String,
            enum: [
                "spam",
                "harassment",
                "hate_speech",
                "violence",
                "nudity",
                "false_information",
                "intellectual_property",
                "self_harm",
                "other"
            ],
            required: true
        },
        description: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            enum: ["pending", "reviewed", "resolved", "dismissed"],
            default: "pending"
        },
        reviewed_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        reviewed_at: {
            type: Date,
            default: null
        },
        moderator_note: {
            type: String,
            default: null
        }
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    }
);

// Index for efficient queries
reportSchema.index({ status: 1, created_at: -1 });
reportSchema.index({ target_id: 1, target_type: 1 });
// Prevent duplicate reports from same user on same target
reportSchema.index(
    { reporter: 1, target_id: 1, target_type: 1 },
    { unique: true }
);

export const Report = mongoose.model<ReportEntity>("Report", reportSchema);
export type ReportDocument = mongoose.HydratedDocument<ReportEntity>;
