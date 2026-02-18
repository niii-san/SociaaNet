export interface IUser {
    user_id: string;
    full_name: string;
    username: string;
    is_private_account: boolean;
    is_email_verified: boolean;
    email_address?: string;
    avatar_url: string | null;
    created_at: string;
}

export interface IUserProfile {
    user_id: string;
    full_name: string;
    username: string;
    is_private_account: boolean;
    followers_count: number;
    following_count: number;
    bio: string;
    avatar_url: string;
    created_at: string;
}

export interface IUserSettings {}
