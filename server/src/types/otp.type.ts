import { Types } from "mongoose";

export interface OtpEntity {
    _id: Types.ObjectId;
    user_id: string;
    email: string;
    otp: string;
    otp_type: "email_verification" | "password_reset";
    has_expired: boolean;
    is_used: boolean;
    expires_at: Date;
}
