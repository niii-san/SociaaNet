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
export interface PostDetail {
    post_id: string;
    author_id: string;
    media_urls: string[];
    caption: string;
    is_post_author: boolean;
    is_post_liked_by_current_user: boolean;
    likes_count: number;
    comments_count: number;
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
    author_id: string;
    video_url: string;
    caption: string;
    hashtags: string[];
    is_reel_author: boolean;
    is_reel_liked_by_current_user: boolean;
    likes_count: number;
    comments_count: number;
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
