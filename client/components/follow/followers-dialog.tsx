"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getFollowers, removeFollower } from "@/features/follow/follow.api";
import { FollowUser } from "@/types";
import { MiniLoader } from "@/components/ui/mini-loader";
import { UserListItem } from "./user-list-item";
import { Users, X } from "lucide-react";
import { useAuth } from "@/contexts";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

interface FollowersDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
    username: string;
}

export function FollowersDialog({ open, onOpenChange, userId, username }: FollowersDialogProps) {
    const [followers, setFollowers] = useState<FollowUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const { data: currentUser } = useAuth();
    const isOwnProfile = currentUser?.user_id === userId;

    useEffect(() => {
        if (open && userId) {
            fetchFollowers();
        }
    }, [open, userId]);

    const fetchFollowers = async () => {
        setLoading(true);
        try {
            const response = await getFollowers(userId);
            setFollowers(response.data);
        } catch (error) {
            console.error("Failed to fetch followers:", error);
            setFollowers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFollower = async (followerId: string) => {
        setRemovingId(followerId);
        try {
            await removeFollower(followerId);
            toast.success("Follower removed");
            // Remove from local state
            setFollowers(prev => prev.filter(f => f.user_id !== followerId));
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to remove follower");
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-0 gap-0 max-h-[80vh] flex flex-col">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="text-center">Followers</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <MiniLoader />
                        </div>
                    ) : followers.length > 0 ? (
                        <div className="p-2">
                            {followers.map((user) => (
                                <div key={user.user_id} className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <UserListItem
                                            user={user}
                                            onFollowChange={fetchFollowers}
                                            onNavigate={() => onOpenChange(false)}
                                            showFollowButton={!isOwnProfile}
                                        />
                                    </div>
                                    {isOwnProfile && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                                            onClick={() => handleRemoveFollower(user.user_id)}
                                            disabled={removingId === user.user_id}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 px-4">
                            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                            <p className="text-muted-foreground">No followers yet</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
