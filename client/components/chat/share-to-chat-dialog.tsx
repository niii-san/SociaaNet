"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, Loader2, Check } from "lucide-react";
import { ChatConversation } from "@/types";
import { getConversations } from "@/features/chat/chat.api";
import { useChat } from "@/contexts/chat.context";
import { useAuth } from "@/contexts/auth.context";
import { toast } from "sonner";

interface ShareToChatDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    postId?: string;
    reelId?: string;
}

export function ShareToChatDialog({
    open,
    onOpenChange,
    postId,
    reelId
}: ShareToChatDialogProps) {
    const { sendMessage } = useChat();
    const { data: currentUser } = useAuth();
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sentTo, setSentTo] = useState<Set<string>>(new Set());
    const [sending, setSending] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setLoading(true);
            setSentTo(new Set());
            setSearchQuery("");
            getConversations()
                .then(setConversations)
                .catch(() => toast.error("Failed to load conversations"))
                .finally(() => setLoading(false));
        }
    }, [open]);

    const filteredConversations = conversations.filter((conv) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        // Search by participant names or group name
        if (conv.group_name && conv.group_name.toLowerCase().includes(q))
            return true;
        return conv.participants.some(
            (p) =>
                p.full_name.toLowerCase().includes(q) ||
                p.username.toLowerCase().includes(q)
        );
    });

    const handleShare = async (conversationId: string) => {
        setSending(conversationId);
        try {
            sendMessage({
                conversationId,
                messageType: postId ? "shared_post" : "shared_reel",
                sharedPostId: postId,
                sharedReelId: reelId,
                tempId: `share-${Date.now()}`
            });
            setSentTo((prev) => new Set(prev).add(conversationId));
            toast.success("Shared successfully");
        } catch {
            toast.error("Failed to share");
        } finally {
            setSending(null);
        }
    };

    const getConversationDisplayName = (conv: ChatConversation) => {
        if (conv.group_name) return conv.group_name;
        // For direct chats, show the other participant
        const other = conv.participants.find(
            (p) => p.user_id !== currentUser?.user_id
        );
        return other?.full_name || "Chat";
    };

    const getConversationAvatar = (conv: ChatConversation) => {
        if (conv.type === "group") return null;
        const other = conv.participants.find(
            (p) => p.user_id !== currentUser?.user_id
        );
        return other?.avatar_url || null;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Share {postId ? "Post" : "Reel"} to Chat
                    </DialogTitle>
                </DialogHeader>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search conversations..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="max-h-80 overflow-y-auto space-y-1">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <p className="text-center text-muted-foreground text-sm py-8">
                            No conversations found
                        </p>
                    ) : (
                        filteredConversations.map((conv) => {
                            const isSent = sentTo.has(conv.conversation_id);
                            const isSending =
                                sending === conv.conversation_id;

                            return (
                                <div
                                    key={conv.conversation_id}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={
                                                getConversationAvatar(conv) ||
                                                undefined
                                            }
                                        />
                                        <AvatarFallback>
                                            {getConversationDisplayName(
                                                conv
                                            )[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {getConversationDisplayName(conv)}
                                        </p>
                                        {conv.type === "group" && (
                                            <p className="text-xs text-muted-foreground">
                                                {conv.participants.length}{" "}
                                                members
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        size="sm"
                                        variant={isSent ? "outline" : "default"}
                                        disabled={isSent || isSending}
                                        onClick={() =>
                                            handleShare(conv.conversation_id)
                                        }
                                        className="shrink-0"
                                    >
                                        {isSending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : isSent ? (
                                            <>
                                                <Check className="h-4 w-4 mr-1" />
                                                Sent
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4 mr-1" />
                                                Send
                                            </>
                                        )}
                                    </Button>
                                </div>
                            );
                        })
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
