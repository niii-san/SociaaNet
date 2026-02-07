import { Types } from "mongoose";

export interface SessionEntity {
    session_id: string;
    user_id: Types.ObjectId;
    ip: string;
    last_activity: Date;
    device: string;
    has_expired: boolean;
    is_deleted: boolean;
    is_revoked:boolean;
    expires_at: Date;
}
