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

export interface IPost {
    post_id: string;
    media_urls: string[];
    caption: string;
    comments_count: number;
    likes_count: number;
    comments: any[];
    hashtags: string[];
    created_at: string;
}

export interface IReel {
    reel_id: string;
    media_url: string;
    thumbnail_url: string;
    caption: string;
    hashtags: string[];
    views_count: number;
    likes_count: number;
    comments_count: number;
    comments: any[];
    duration_seconds: number;
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
    avatar_url: string | null;
    created_at: string;
    posts_count: number;
    reels_count: number;
    posts: IPost[];
    reels: IReel[];
    is_own_profile: boolean;
    is_following: boolean;
}

export interface IUserSettings {}
