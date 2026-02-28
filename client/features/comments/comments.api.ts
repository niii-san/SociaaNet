import { api } from "@/lib/axios-instance";

// Types
export interface CommentAuthor {
    user_id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
}

export interface CommentData {
    comment_id: string;
    author: CommentAuthor;
    content: string;
    is_author: boolean;
    is_comment_author: boolean;
    likes_count: number;
    is_liked_by_current_user: boolean;
    created_at: string;
    replies_count?: number;
    replies?: CommentData[];
    has_more_replies?: boolean;
}

export interface GetCommentsResponse {
    status_code: number;
    success: boolean;
    message: string;
    data: {
        comments: CommentData[];
        total: number;
        page: number;
        limit: number;
        has_more: boolean;
    };
}

export interface GetRepliesResponse {
    status_code: number;
    success: boolean;
    message: string;
    data: {
        replies: CommentData[];
        total: number;
        page: number;
        limit: number;
        has_more: boolean;
    };
}

export interface AddCommentResponse {
    status_code: number;
    success: boolean;
    message: string;
    data: CommentData;
}

export interface DeleteCommentResponse {
    status_code: number;
    success: boolean;
    message: string;
    data: {
        comment_id: string;
    };
}

export interface LikeCommentResponse {
    status_code: number;
    success: boolean;
    message: string;
    data: {
        like_id?: string;
        comment_id: string;
        likes_count: number;
    };
}

// API Functions

// Get comments for a post
export const getPostComments = async (
    postId: string,
    page: number = 1,
    limit: number = 20
): Promise<GetCommentsResponse["data"]> => {
    const response = await api.get(
        `/posts/${postId}/comments?page=${page}&limit=${limit}`
    );
    return response.data?.data;
};

// Get comments for a reel
export const getReelComments = async (
    reelId: string,
    page: number = 1,
    limit: number = 20
): Promise<GetCommentsResponse["data"]> => {
    const response = await api.get(
        `/reels/${reelId}/comments?page=${page}&limit=${limit}`
    );
    return response.data?.data;
};

// Add a comment to a post
export const addPostComment = async (
    postId: string,
    content: string
): Promise<CommentData> => {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data?.data;
};

// Add a comment to a reel
export const addReelComment = async (
    reelId: string,
    content: string
): Promise<CommentData> => {
    const response = await api.post(`/reels/${reelId}/comments`, { content });
    return response.data?.data;
};

// Reply to a comment
export const replyToComment = async (
    commentId: string,
    content: string
): Promise<CommentData> => {
    const response = await api.post(`/comments/${commentId}/reply`, {
        content
    });
    return response.data?.data;
};

// Get replies for a comment
export const getCommentReplies = async (
    commentId: string,
    page: number = 1,
    limit: number = 10
): Promise<GetRepliesResponse["data"]> => {
    const response = await api.get(
        `/comments/${commentId}/replies?page=${page}&limit=${limit}`
    );
    return response.data?.data;
};

// Delete a comment
export const deleteComment = async (
    commentId: string
): Promise<DeleteCommentResponse["data"]> => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data?.data;
};

// Like a comment
export const likeComment = async (
    commentId: string
): Promise<LikeCommentResponse["data"]> => {
    const response = await api.post(`/comments/${commentId}/like`);
    return response.data?.data;
};

// Unlike a comment
export const unlikeComment = async (
    commentId: string
): Promise<LikeCommentResponse["data"]> => {
    const response = await api.delete(`/comments/${commentId}/like`);
    return response.data?.data;
};
