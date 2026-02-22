export interface FollowUser {
    user_id: string;
    username: string;
    fullname: string;
    avatar_url: string | null;
    is_following?: boolean;
    is_followed_by?: boolean;
}

export interface FollowRequest {
    request_id: string;
    follower: FollowUser;
    following: string;
    status: "pending" | "accepted" | "rejected";
    followed_at: string;
}

export interface FollowingRequest {
    request_id: string;
    follower: FollowUser;
    following: string;
    status: "pending";
    followed_at: string;
}

export interface FollowResponse {
    status_code: number;
    success: boolean;
    message: string;
    data: {
        followerId: string;
        followeeId: string;
        is_follow_request?: boolean;
    };
}

export interface FollowRequestsResponse {
    status_code: number;
    success: boolean;
    message: string;
    data: FollowRequest[];
}

export interface FollowingRequestsResponse {
    status_code: number;
    success: boolean;
    message: string;
    data: FollowingRequest[];
}

export interface FollowersResponse {
    status_code: number;
    success: boolean;
    message: string;
    data: FollowUser[];
}
