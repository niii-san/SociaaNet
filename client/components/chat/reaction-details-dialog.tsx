"use client";

import { useState, useEffect } from "react";
import { getMessageReactions } from "@/features/chat/chat.api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface ReactionUser {
    user_id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
    emoji: string;
    created_at: string;
}

interface ReactionDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    messageId: string | null;
}

export function ReactionDetailsDialog({
    open,
    onOpenChange,
    messageId
}: ReactionDetailsDialogProps) {
    const [reactions, setReactions] = useState<ReactionUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("all");

    useEffect(() => {
        if (open && messageId) {
            fetchReactions();
        }
        if (!open) {
            setActiveTab("all");
            setReactions([]);
        }
    }, [open, messageId]);

    const fetchReactions = async () => {
        if (!messageId) return;
        setLoading(true);
        try {
            const data = await getMessageReactions(messageId);
            setReactions(data);
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    };

    // Group reactions by emoji for tab filtering
    const emojiGroups = reactions.reduce(
        (acc, r) => {
            if (!acc[r.emoji]) acc[r.emoji] = [];
            acc[r.emoji].push(r);
            return acc;
        },
        {} as Record<string, ReactionUser[]>
    );

    const filteredReactions =
        activeTab === "all" ? reactions : (emojiGroups[activeTab] || []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm p-0 gap-0">
                <DialogHeader className="p-4 pb-0">
                    <DialogTitle className="text-base font-semibold">
                        Reactions
                    </DialogTitle>
                </DialogHeader>

                {/* Emoji filter tabs */}
                {!loading && reactions.length > 0 && (
                    <div className="flex items-center gap-1 px-4 pt-3 pb-2 overflow-x-auto scrollbar-hide">
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors shrink-0 ${
                                activeTab === "all"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                        >
                            All {reactions.length}
                        </button>
                        {Object.entries(emojiGroups).map(
                            ([emoji, users]) => (
                                <button
                                    key={emoji}
                                    onClick={() => setActiveTab(emoji)}
                                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors shrink-0 ${
                                        activeTab === emoji
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                                    }`}
                                >
                                    <span>{emoji}</span>
                                    <span>{users.length}</span>
                                </button>
                            )
                        )}
                    </div>
                )}

                {/* Separator */}
                <div className="border-b" />

                {/* Reactions list */}
                <div className="max-h-72 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredReactions.length === 0 ? (
                        <div className="flex items-center justify-center py-8">
                            <p className="text-sm text-muted-foreground">
                                No reactions yet
                            </p>
                        </div>
                    ) : (
                        <div className="py-1">
                            {filteredReactions.map((reaction) => (
                                <Link
                                    key={`${reaction.user_id}-${reaction.emoji}`}
                                    href={`/u/${reaction.username}`}
                                    onClick={() => onOpenChange(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors"
                                >
                                    <Avatar className="w-10 h-10">
                                        {reaction.avatar_url ? (
                                            <AvatarImage
                                                src={reaction.avatar_url}
                                                alt={reaction.full_name}
                                            />
                                        ) : null}
                                        <AvatarFallback className="text-xs">
                                            {reaction.full_name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .toUpperCase()
                                                .slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {reaction.full_name}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            @{reaction.username}
                                        </p>
                                    </div>
                                    <span className="text-xl shrink-0">
                                        {reaction.emoji}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
