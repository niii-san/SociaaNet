"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getFollowing } from "@/features/follow/follow.api";
import { FollowUser } from "@/types";
import { MiniLoader } from "@/components/ui/mini-loader";
import { UserListItem } from "./user-list-item";
import { Users } from "lucide-react";

interface FollowingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
    username: string;
}

export function FollowingDialog({ open, onOpenChange, userId, username }: FollowingDialogProps) {
    const [following, setFollowing] = useState<FollowUser[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && userId) {
            fetchFollowing();
        }
    }, [open, userId]);

    const fetchFollowing = async () => {
        setLoading(true);
        try {
            const response = await getFollowing(userId);
            setFollowing(response.data);
        } catch (error) {
            console.error("Failed to fetch following:", error);
            setFollowing([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-0 gap-0 max-h-[80vh] flex flex-col">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="text-center">Following</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <MiniLoader />
                        </div>
                    ) : following.length > 0 ? (
                        <div className="p-2">
                            {following.map((user) => (
                                <UserListItem
                                    key={user.user_id}
                                    user={user}
                                    onFollowChange={fetchFollowing}
                                    onNavigate={() => onOpenChange(false)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 px-4">
                            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                            <p className="text-muted-foreground">Not following anyone yet</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
