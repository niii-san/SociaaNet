import { api } from "@/lib/axios-instance";

// Like History
export interface LikedPost {
    post_id: string;
    caption: string;
    media_url: string | null;
    likes_count: number;
    comments_count: number;
}

export interface LikedReel {
    reel_id: string;
    caption: string;
    thumbnail_url: string;
    likes_count: number;
    comments_count: number;
    views_count: number;
}

export interface LikeHistoryItem {
    type: "post" | "reel";
    liked_at: string;
    post?: LikedPost;
    reel?: LikedReel;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export const getLikeHistory = async (
    page: number = 1,
    limit: number = 20
): Promise<PaginatedResponse<LikeHistoryItem>> => {
    const res = await api.get(`/users/me/history/likes?page=${page}&limit=${limit}`);
    return res.data?.data as PaginatedResponse<LikeHistoryItem>;
};

// Comment History
export interface CommentHistoryItem {
    comment_id: string;
    content: string;
    target_type: "post" | "reel";
    target_id: string;
    likes_count: number;
    created_at: string;
    target: {
        caption: string;
        media_url: string | null;
    } | null;
}

export const getCommentHistory = async (
    page: number = 1,
    limit: number = 20
): Promise<PaginatedResponse<CommentHistoryItem>> => {
    const res = await api.get(`/users/me/history/comments?page=${page}&limit=${limit}`);
    return res.data?.data as PaginatedResponse<CommentHistoryItem>;
};

// Watch History
export interface WatchHistoryItem {
    type: "post" | "reel";
    viewed_at: string;
    post?: LikedPost;
    reel?: LikedReel;
}

export const getWatchHistory = async (
    page: number = 1,
    limit: number = 20
): Promise<PaginatedResponse<WatchHistoryItem>> => {
    const res = await api.get(`/users/me/history/watches?page=${page}&limit=${limit}`);
    return res.data?.data as PaginatedResponse<WatchHistoryItem>;
};

// Repost History
export interface RepostedPost {
    post_id: string;
    caption: string;
    media_url: string | null;
    likes_count: number;
    comments_count: number;
    reposts_count: number;
}

export interface RepostedReel {
    reel_id: string;
    caption: string;
    thumbnail_url: string;
    likes_count: number;
    comments_count: number;
    views_count: number;
    reposts_count: number;
}

export interface RepostHistoryItem {
    type: "post" | "reel";
    reposted_at: string;
    post?: RepostedPost;
    reel?: RepostedReel;
}

export const getRepostHistory = async (
    page: number = 1,
    limit: number = 20
): Promise<PaginatedResponse<RepostHistoryItem>> => {
    const res = await api.get(`/users/me/history/reposts?page=${page}&limit=${limit}`);
    return res.data?.data as PaginatedResponse<RepostHistoryItem>;
};

// Saved Items
export interface SavedPost {
    post_id: string;
    caption: string;
    media_url: string | null;
    likes_count: number;
    comments_count: number;
}

export interface SavedReel {
    reel_id: string;
    caption: string;
    thumbnail_url: string;
    likes_count: number;
    comments_count: number;
    views_count: number;
}

export interface SavedHistoryItem {
    type: "post" | "reel";
    saved_at: string;
    post?: SavedPost;
    reel?: SavedReel;
}

export const getSavedItems = async (
    page: number = 1,
    limit: number = 20
): Promise<PaginatedResponse<SavedHistoryItem>> => {
    const res = await api.get(`/users/me/saved?page=${page}&limit=${limit}`);
    return res.data?.data as PaginatedResponse<SavedHistoryItem>;
};
