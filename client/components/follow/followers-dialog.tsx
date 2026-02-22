"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getFollowers } from "@/features/follow/follow.api";
import { FollowUser } from "@/types";
import { MiniLoader } from "@/components/ui/mini-loader";
import { UserListItem } from "./user-list-item";
import { Users } from "lucide-react";

interface FollowersDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
    username: string;
}

export function FollowersDialog({ open, onOpenChange, userId, username }: FollowersDialogProps) {
    const [followers, setFollowers] = useState<FollowUser[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && userId) {
            fetchFollowers();
        } else if (!open) {
            // Reset state when dialog closes
            setFollowers([]);
        }
    }, [open, userId]);

    const fetchFollowers = async () => {
        setLoading(true);
        try {
            console.log("Fetching followers for userId:", userId);
            const response = await getFollowers(userId);
            console.log("Followers response:", response);
            setFollowers(response.data);
        } catch (error) {
            console.error("Failed to fetch followers:", error);
            setFollowers([]);
        } finally {
            setLoading(false);
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
                                <UserListItem
                                    key={user.user_id}
                                    user={user}
                                    onFollowChange={fetchFollowers}
                                    onNavigate={() => onOpenChange(false)}
                                />
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
