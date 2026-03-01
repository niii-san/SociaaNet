import { Types } from "mongoose";

export type AuditAction =
    | "user_disabled"
    | "user_enabled"
    | "user_warned"
    | "post_removed"
    | "post_restored"
    | "reel_removed"
    | "reel_restored"
    | "comment_removed"
    | "report_reviewed"
    | "report_resolved"
    | "report_dismissed";

export interface AuditLogEntity {
    _id: Types.ObjectId;
    moderator: Types.ObjectId;
    action: AuditAction;
    target_id: Types.ObjectId;
    target_type: "user" | "post" | "reel" | "comment" | "report";
    details?: string;
    created_at: Date;
}
