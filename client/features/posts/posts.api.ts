import { api } from "@/lib/axios-instance";

export interface CreatePostRequest {
    caption: string;
    visibility: "public" | "private" | "followers";
    images: File[];
}

export interface Post {
    post_id: string;
    image_urls: string[];
    caption: string;
    hashtags: string[];
    visibility: string;
    created_at: string;
    likes_count: number;
    comments_count: number;
}

export interface CreatePostResponse {
    status_code: number;
    success: boolean;
    message: string;
    data: Post;
}

export interface CreateReelRequest {
    caption: string;
    visibility: "public" | "private" | "followers";
    video: File;
}

export interface Reel {
    reel_id: string;
    video_url: string;
    thumbnail_url: string;
    caption: string;
    hashtags: string[];
    visibility: string;
    duration_seconds: number;
    created_at: string;
    likes_count: number;
    views_count: number;
    comments_count: number;
}

export interface CreateReelResponse {
    status_code: number;
    success: boolean;
    message: string;
    data: Reel;
}

// Create a new post
export const createPost = async (
    data: CreatePostRequest
): Promise<CreatePostResponse> => {
    const formData = new FormData();
    
    formData.append("caption", data.caption);
    formData.append("visibility", data.visibility);
    
    // Append all images
    data.images.forEach((image) => {
        formData.append("images", image);
    });

    const response = await api.post("/media/post", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    
    return response.data;
};

// Create a new reel
export const createReel = async (
    data: CreateReelRequest
): Promise<CreateReelResponse> => {
    const formData = new FormData();
    
    formData.append("caption", data.caption);
    formData.append("visibility", data.visibility);
    formData.append("video", data.video);

    const response = await api.post("/media/reel", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    
    return response.data;
};

// Get post by ID
export interface Author {
    user_id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
}

export interface PostDetail {
    post_id: string;
    author: Author;
    media_urls: string[];
    caption: string;
    is_post_author: boolean;
    is_post_liked_by_current_user: boolean;
    is_post_reposted_by_current_user: boolean;
    likes_count: number;
    comments_count: number;
    reposts_count: number;
    comments: any[];
    hashtags: string[];
    visibility: "public" | "private" | "followers";
    created_at: string;
}

export interface GetPostResponse {
    status_code: number;
    success: boolean;
    message: string;
    data: PostDetail;
}

export const getPostById = async (postId: string): Promise<PostDetail> => {
    const response = await api.get(`/posts/${postId}`);
    return response.data?.data as PostDetail;
};

// Update post visibility
export interface UpdatePostVisibilityRequest {
    visibility: "public" | "private" | "followers";
}

export const updatePostVisibility = async (
    postId: string,
    visibility: "public" | "private" | "followers"
): Promise<void> => {
    await api.patch(`/posts/${postId}/visibility`, { visibility });
};

// Get reel by ID
export interface ReelDetail {
    reel_id: string;
    author: Author;
    video_url: string;
    caption: string;
    hashtags: string[];
    is_reel_author: boolean;
    is_reel_liked_by_current_user: boolean;
    is_reel_reposted_by_current_user: boolean;
    likes_count: number;
    comments_count: number;
    reposts_count: number;
    views_count: number;
    comments: any[];
    visibility: "public" | "private" | "followers";
    created_at: string;
}

export interface GetReelResponse {
    status_code: number;
    success: boolean;
    message: string;
    data: ReelDetail;
}

export const getReelById = async (reelId: string): Promise<ReelDetail> => {
    const response = await api.get(`/reels/${reelId}`);
    return response.data?.data as ReelDetail;
};

// Update reel visibility
export const updateReelVisibility = async (
    reelId: string,
    visibility: "public" | "private" | "followers"
): Promise<void> => {
    await api.patch(`/reels/${reelId}/visibility`, { visibility });
};

// Like / Unlike interfaces
export interface LikeResponse {
    status_code: number;
    success: boolean;
    message: string;
    data: {
        like_id?: string;
        target_id: string;
        target_type: "post" | "reel";
        likes_count: number;
    };
}

// Like a post
export const likePost = async (postId: string): Promise<LikeResponse> => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
};

// Unlike a post
export const unlikePost = async (postId: string): Promise<LikeResponse> => {
    const response = await api.delete(`/posts/${postId}/like`);
    return response.data;
};

// Like a reel
export const likeReel = async (reelId: string): Promise<LikeResponse> => {
    const response = await api.post(`/reels/${reelId}/like`);
    return response.data;
};

// Unlike a reel
export const unlikeReel = async (reelId: string): Promise<LikeResponse> => {
    const response = await api.delete(`/reels/${reelId}/like`);
    return response.data;
};

// View tracking
export interface ViewResponse {
    status_code: number;
    success: boolean;
    message: string;
    data: {
        target_id: string;
        target_type: "post" | "reel";
        is_new_view: boolean;
        views_count?: number;
    };
}

// Record a post view (silent, for history/algo tracking)
export const viewPost = async (postId: string): Promise<ViewResponse> => {
    const response = await api.post(`/posts/${postId}/view`);
    return response.data;
};

// Record a reel view (increments view count on first view)
export const viewReel = async (reelId: string): Promise<ViewResponse> => {
    const response = await api.post(`/reels/${reelId}/view`);
    return response.data;
};

// Repost interfaces
export interface RepostResponse {
    status_code: number;
    success: boolean;
    message: string;
    data: {
        repost_id?: string;
        target_id: string;
        target_type: "post" | "reel";
        reposts_count: number;
    };
}

// Repost a post
export const repostPost = async (postId: string): Promise<RepostResponse> => {
    const response = await api.post(`/posts/${postId}/repost`);
    return response.data;
};

// Unrepost a post
export const unrepostPost = async (postId: string): Promise<RepostResponse> => {
    const response = await api.delete(`/posts/${postId}/repost`);
    return response.data;
};

// Repost a reel
export const repostReel = async (reelId: string): Promise<RepostResponse> => {
    const response = await api.post(`/reels/${reelId}/repost`);
    return response.data;
};

// Unrepost a reel
export const unrepostReel = async (reelId: string): Promise<RepostResponse> => {
    const response = await api.delete(`/reels/${reelId}/repost`);
    return response.data;
};
