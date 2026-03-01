import { api } from "@/lib/axios-instance";

export interface ModDashboardStats {
    total_users: number;
    active_users: number;
    disabled_users: number;
    moderators: number;
    total_posts: number;
    removed_posts: number;
    total_reels: number;
    removed_reels: number;
    total_comments: number;
}

export interface ModUser {
    user_id: string;
    _id: string;
    full_name: string;
    username: string;
    email_address: string;
    role: "user" | "moderator" | "system_admin";
    is_disabled: boolean;
    is_private_account: boolean;
    avatar_url: string | null;
    followers_count: number;
    following_count: number;
    bio: string;
    created_at: string;
}

export interface ModPost {
    post_id: string;
    caption: string;
    hashtags: string[];
    likes_count: number;
    comments_count: number;
    is_removed_by_moderator: boolean;
    visibility: string;
    created_at: string;
    author: {
        user_id: string;
        username: string;
        full_name: string;
        avatar_url: string | null;
    } | null;
}

export interface ModReel {
    reel_id: string;
    caption: string;
    thumbnail_url: string | null;
    hashtags: string[];
    likes_count: number;
    comments_count: number;
    views_count: number;
    is_removed_by_moderator: boolean;
    visibility: string;
    duration_seconds: number;
    created_at: string;
    author: {
        user_id: string;
        username: string;
        full_name: string;
        avatar_url: string | null;
    } | null;
}

export interface Pagination {
    current_page: number;
    total_pages: number;
    total_count: number;
    has_next_page: boolean;
}

// Dashboard
export async function getDashboardStats(): Promise<ModDashboardStats> {
    const res = await api.get("/moderators/dashboard/stats");
    return res.data.data;
}

// Users
export async function getModUsers(
    page: number = 1,
    limit: number = 20,
    search?: string,
    filter?: string
): Promise<{ users: ModUser[]; pagination: Pagination }> {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (search) params.set("search", search);
    if (filter) params.set("filter", filter);

    const res = await api.get(`/moderators/users?${params.toString()}`);
    return { users: res.data.data, pagination: res.data.pagination };
}

export async function disableUser(userId: string): Promise<void> {
    await api.patch(`/moderators/users/${userId}/disable`);
}

export async function enableUser(userId: string): Promise<void> {
    await api.patch(`/moderators/users/${userId}/enable`);
}

// Posts
export async function getModPosts(
    page: number = 1,
    limit: number = 20,
    filter?: string
): Promise<{ posts: ModPost[]; pagination: Pagination }> {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (filter) params.set("filter", filter);

    const res = await api.get(`/moderators/posts?${params.toString()}`);
    return { posts: res.data.data, pagination: res.data.pagination };
}

export async function removePost(postId: string): Promise<void> {
    await api.patch(`/moderators/posts/${postId}/remove`);
}

export async function restorePost(postId: string): Promise<void> {
    await api.patch(`/moderators/posts/${postId}/restore`);
}

// Reels
export async function getModReels(
    page: number = 1,
    limit: number = 20,
    filter?: string
): Promise<{ reels: ModReel[]; pagination: Pagination }> {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (filter) params.set("filter", filter);

    const res = await api.get(`/moderators/reels?${params.toString()}`);
    return { reels: res.data.data, pagination: res.data.pagination };
}

export async function removeReel(reelId: string): Promise<void> {
    await api.patch(`/moderators/reels/${reelId}/remove`);
}

export async function restoreReel(reelId: string): Promise<void> {
    await api.patch(`/moderators/reels/${reelId}/restore`);
}

// Comments
export async function removeComment(commentId: string): Promise<void> {
    await api.delete(`/moderators/comments/${commentId}`);
}
