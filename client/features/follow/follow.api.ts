import { api } from "@/lib/axios-instance";
import {
    FollowResponse,
    FollowRequestsResponse,
    FollowingRequestsResponse,
    FollowersResponse,
} from "@/types";

// Follow a user
export const followUser = async (followeeId: string): Promise<FollowResponse> => {
    const response = await api.post(`/users/me/${followeeId}/follow`);
    return response.data;
};

// Unfollow a user
export const unfollowUser = async (followeeId: string): Promise<void> => {
    await api.delete(`/users/me/${followeeId}/follow`);
};

// Cancel follow request
export const cancelFollowRequest = async (followeeId: string): Promise<void> => {
    await api.delete(`/users/me/${followeeId}/follow-request/cancel`);
};

// Get following requests (users you've requested to follow)
export const getFollowingRequests = async (): Promise<FollowingRequestsResponse> => {
    const response = await api.get(`/users/me/following-requests`);
    console.log("Following requests response:", response.data);
    return response.data;
};

// Get followers
export const getFollowers = async (userId: string): Promise<FollowersResponse> => {
    const response = await api.get(`/users/${userId}/followers`);
    return response.data;
};

// Get following
export const getFollowing = async (userId: string): Promise<FollowersResponse> => {
    const response = await api.get(`/users/${userId}/following`);
    return response.data;
};

// Get follow requests (people who want to follow you)
export const getFollowRequests = async (): Promise<FollowRequestsResponse> => {
    const response = await api.get(`/users/me/follow-requests`);
    return response.data;
};

// Accept follow request
export const acceptFollowRequest = async (followerId: string): Promise<FollowResponse> => {
    const response = await api.patch(`/users/me/${followerId}/follow-request`);
    return response.data;
};

// Reject follow request
export const rejectFollowRequest = async (followerId: string): Promise<FollowResponse> => {
    const response = await api.delete(`/users/me/${followerId}/follow-request`);
    return response.data;
};
