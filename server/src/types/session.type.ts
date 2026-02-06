import { Types } from "mongoose";

export interface SessionEntity {
    session_id: string;
    user_id: Types.ObjectId;
    ip: string;
    last_activity: Date;
    device: string;
    is_expired: boolean;
    expires_at: Date;
}
