export interface IUser {
    user_id: string;
    full_name: string;
    username: string;
    is_private_account: boolean;
    is_email_verified: boolean;
    email_address?: string;
    avatar_url: string | null;
    role: "user" | "moderator" | "system_admin";
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

export interface IRepost {
    repost_id: string;
    type: "post" | "reel";
    reposted_at: string;
    post?: {
        post_id: string;
        caption: string;
        media_urls: string[];
        likes_count: number;
        comments_count: number;
        reposts_count: number;
    };
    reel?: {
        reel_id: string;
        caption: string;
        thumbnail_url: string;
        media_url: string;
        likes_count: number;
        comments_count: number;
        views_count: number;
        reposts_count: number;
        duration_seconds: number;
    };
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
    reposts_count: number;
    posts: IPost[];
    reels: IReel[];
    reposts: IRepost[];
    is_own_profile: boolean;
    is_following: boolean;
}

export interface IUserSettings {}
