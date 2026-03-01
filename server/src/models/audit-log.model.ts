import mongoose from "mongoose";
import { AuditLogEntity } from "../types/audit-log.type";

const auditLogSchema = new mongoose.Schema<AuditLogEntity>(
    {
        moderator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        action: {
            type: String,
            enum: [
                "user_disabled",
                "user_enabled",
                "user_warned",
                "post_removed",
                "post_restored",
                "reel_removed",
                "reel_restored",
                "comment_removed",
                "report_reviewed",
                "report_resolved",
                "report_dismissed"
            ],
            required: true
        },
        target_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        target_type: {
            type: String,
            enum: ["user", "post", "reel", "comment", "report"],
            required: true
        },
        details: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: false }
    }
);

auditLogSchema.index({ created_at: -1 });
auditLogSchema.index({ action: 1 });

export type AuditLogDocument = mongoose.Document & AuditLogEntity;
export const AuditLog = mongoose.model<AuditLogEntity>("AuditLog", auditLogSchema);
