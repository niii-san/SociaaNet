import { Types } from "mongoose";

export interface UserEntity {
    _id: Types.ObjectId;
    email_address: string;
    avatar_key: string | null;
    full_name: string;
    username: string;
    is_private_account: boolean;
    is_email_verified: boolean;
    followers_count: number;
    following_count: number;
    bio: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    role: "user" | "moderator" | "system_admin";
    is_disabled: boolean;
    last_active_at: Date | null;
    is_online: boolean;
}
