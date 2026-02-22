import { useState } from "react";
import { followUser, unfollowUser, cancelFollowRequest } from "@/features/follow/follow.api";
import { useFollow } from "@/contexts";
import { toast } from "sonner";

export const useFollowUser = () => {
    const [loading, setLoading] = useState(false);
    const { refetchFollowingRequests } = useFollow();

    const handleFollow = async (
        followeeId: string,
        isPrivate: boolean,
        onSuccess?: () => void
    ): Promise<boolean> => {
        setLoading(true);
        try {
            const response = await followUser(followeeId);
            if (response.data.is_follow_request) {
                toast.success("Follow request sent");
                await refetchFollowingRequests();
            } else {
                toast.success("Following user");
            }
            onSuccess?.();
            return true;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to follow user");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleUnfollow = async (
        followeeId: string,
        onSuccess?: () => void
    ): Promise<boolean> => {
        setLoading(true);
        try {
            await unfollowUser(followeeId);
            toast.success("Unfollowed user");
            onSuccess?.();
            return true;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to unfollow user");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleCancelRequest = async (
        followeeId: string,
        onSuccess?: () => void
    ): Promise<boolean> => {
        setLoading(true);
        try {
            await cancelFollowRequest(followeeId);
            toast.success("Request cancelled");
            await refetchFollowingRequests();
            onSuccess?.();
            return true;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to cancel request");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleFollow,
        handleUnfollow,
        handleCancelRequest,
        loading,
    };
};
