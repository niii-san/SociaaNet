import { Types } from "mongoose";

export type ReportReason =
    | "spam"
    | "harassment"
    | "hate_speech"
    | "violence"
    | "nudity"
    | "false_information"
    | "intellectual_property"
    | "self_harm"
    | "other";

export type ReportStatus = "pending" | "reviewed" | "resolved" | "dismissed";

export interface ReportEntity {
    _id: Types.ObjectId;
    reporter: Types.ObjectId;
    target_id: Types.ObjectId;
    target_type: "post" | "reel" | "comment" | "user";
    reason: ReportReason;
    description: string;
    status: ReportStatus;
    reviewed_by?: Types.ObjectId;
    reviewed_at?: Date;
    moderator_note?: string;
    created_at: Date;
    updated_at: Date;
}
