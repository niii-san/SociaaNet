import { api } from "@/lib/axios-instance";

// ─── Types ────────────────────────────────────────────────

export interface FeedAuthor {
    user_id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
    is_online: boolean;
}

export interface FeedPost {
    type: "post";
    post_id: string;
    author: FeedAuthor;
    media_urls: string[];
    caption: string;
    hashtags: string[];
    likes_count: number;
    comments_count: number;
    reposts_count: number;
    is_liked: boolean;
    is_reposted: boolean;
    is_saved: boolean;
    is_seen: boolean;
    is_own_post: boolean;
    visibility: string;
    created_at: string;
}

export interface FeedReel {
    type: "reel";
    reel_id: string;
    author: FeedAuthor;
    video_url: string;
    thumbnail_url: string;
    caption: string;
    hashtags: string[];
    likes_count: number;
    comments_count: number;
    reposts_count: number;
    views_count: number;
    duration_seconds: number;
    is_liked: boolean;
    is_reposted: boolean;
    is_saved: boolean;
    is_own_reel: boolean;
    visibility: string;
    created_at: string;
}

export interface ExplorePost {
    type: "post";
    post_id: string;
    author: FeedAuthor;
    media_urls: string[];
    caption: string;
    hashtags: string[];
    likes_count: number;
    comments_count: number;
    reposts_count: number;
    is_liked: boolean;
    is_saved: boolean;
    visibility: string;
    created_at: string;
}

export interface ExploreReel {
    type: "reel";
    reel_id: string;
    author: FeedAuthor;
    thumbnail_url: string;
    video_url: string;
    caption: string;
    hashtags: string[];
    likes_count: number;
    comments_count: number;
    reposts_count: number;
    views_count: number;
    duration_seconds: number;
    is_liked: boolean;
    is_saved: boolean;
    created_at: string;
}

export type ExploreItem = ExplorePost | ExploreReel;

export interface SuggestedUser {
    user_id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
    bio: string;
    followers_count: number;
}

// ─── Response types ───────────────────────────────────────

export interface HomeFeedResponse {
    posts: FeedPost[];
    caught_up_at_index: number | null;
    show_caught_up_divider: boolean;
    is_fallback: boolean;
    page: number;
    limit: number;
    total: number;
    total_unseen: number;
    has_more: boolean;
}

export interface ExploreResponse {
    items: ExploreItem[];
    page: number;
    limit: number;
    total: number;
    has_more: boolean;
}

export interface ReelsFeedResponse {
    reels: FeedReel[];
    page: number;
    limit: number;
    total: number;
    unseen_count: number;
    has_more: boolean;
}

// ─── API functions ────────────────────────────────────────

export const getHomeFeed = async (
    page: number = 1,
    limit: number = 10
): Promise<HomeFeedResponse> => {
    const response = await api.get("/feed/home", {
        params: { page, limit }
    });
    return response.data?.data as HomeFeedResponse;
};

export const getExplore = async (
    page: number = 1,
    limit: number = 20
): Promise<ExploreResponse> => {
    const response = await api.get("/feed/explore", {
        params: { page, limit }
    });
    return response.data?.data as ExploreResponse;
};

export const getReelsFeed = async (
    page: number = 1,
    limit: number = 10
): Promise<ReelsFeedResponse> => {
    const response = await api.get("/feed/reels", {
        params: { page, limit }
    });
    return response.data?.data as ReelsFeedResponse;
};

export const getSuggestedUsers = async (
    limit: number = 5
): Promise<SuggestedUser[]> => {
    const response = await api.get("/feed/suggested-users", {
        params: { limit }
    });
    return response.data?.data as SuggestedUser[];
};
