"use client";

import { useState, useEffect } from "react";
import { getFollowRequests, acceptFollowRequest, rejectFollowRequest } from "@/features/follow/follow.api";
import { FollowRequest } from "@/types";
import { MiniLoader } from "@/components/ui/mini-loader";
import { Button } from "@/components/ui/button";
import { UserPlus, X, Check } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function FollowRequestsPage() {
    const [requests, setRequests] = useState<FollowRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    usePageTitle("Follow Requests");

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await getFollowRequests();
            setRequests(response.data);
        } catch (error) {
            console.error("Failed to fetch follow requests:", error);
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (followerId: string) => {
        setActionLoading(followerId);
        try {
            await acceptFollowRequest(followerId);
            toast.success("Follow request accepted");
            await fetchRequests();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to accept request");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (followerId: string) => {
        setActionLoading(followerId);
        try {
            await rejectFollowRequest(followerId);
            toast.success("Follow request rejected");
            await fetchRequests();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to reject request");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <MiniLoader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
                <div className="flex items-center gap-3">
                    <UserPlus className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-bold">Follow Requests</h1>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                    {requests.length} {requests.length === 1 ? "request" : "requests"}
                </p>
            </header>

            <div className="container max-w-2xl mx-auto px-4 py-6">
                {requests.length > 0 ? (
                    <div className="space-y-3">
                        {requests.map((request) => {
                            const isLocalhost = request.follower.avatar_url?.includes('localhost');
                            const isProcessing = actionLoading === request.follower.user_id;

                            return (
                                <div
                                    key={request.request_id}
                                    className="flex items-center gap-3 p-4 rounded-lg border bg-card"
                                >
                                    <Link
                                        href={`/u/${request.follower.username}`}
                                        className="flex items-center gap-3 flex-1 min-w-0"
                                    >
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0">
                                            {isLocalhost || !request.follower.avatar_url ? (
                                                <img
                                                    src={request.follower.avatar_url || "/images/defaultAvatar.svg"}
                                                    alt={request.follower.fullname}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <img
                                                    src={request.follower.avatar_url}
                                                    alt={request.follower.fullname}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate">
                                                {request.follower.fullname}
                                            </p>
                                            <p className="text-sm text-muted-foreground truncate">
                                                @{request.follower.username}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(request.followed_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </Link>
                                    <div className="flex gap-2 shrink-0">
                                        <Button
                                            onClick={() => handleAccept(request.follower.user_id)}
                                            disabled={isProcessing}
                                            size="sm"
                                            className="gap-1"
                                        >
                                            <Check className="w-4 h-4" />
                                            Accept
                                        </Button>
                                        <Button
                                            onClick={() => handleReject(request.follower.user_id)}
                                            disabled={isProcessing}
                                            variant="outline"
                                            size="sm"
                                            className="gap-1"
                                        >
                                            <X className="w-4 h-4" />
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <UserPlus className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Follow Requests</h3>
                        <p className="text-muted-foreground">
                            You don't have any pending follow requests
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
