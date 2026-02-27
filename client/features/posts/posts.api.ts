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
