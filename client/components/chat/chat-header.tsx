"use client";

import { useState, useEffect } from "react";
import { ChatConversation, ChatParticipant } from "@/types";
import { useAuth } from "@/contexts";
import { useChat } from "@/contexts/chat.context";
import { ArrowLeft, Users, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getUsersActivity } from "@/features/chat/chat.api";

interface ChatHeaderProps {
    conversation: ChatConversation;
    typingUsers: Set<string>;
    onInfoClick: () => void;
}

function formatLastActive(dateStr: string | null): string {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Active just now";
    if (diffMins < 60) return `Active ${diffMins}m ago`;
    if (diffHours < 24) return `Active ${diffHours}h ago`;
    if (diffDays < 7) return `Active ${diffDays}d ago`;
    return `Active ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

export function ChatHeader({
    conversation,
    typingUsers,
    onInfoClick
}: ChatHeaderProps) {
    const router = useRouter();
    const { data: currentUser } = useAuth();
    const { onlineUsers } = useChat();

    const [activityData, setActivityData] = useState<Record<
        string,
        {
            is_online: boolean;
            last_active_at: string | null;
            show_activity_status: boolean;
        }
    >>({});

    const isGroup = conversation.type === "group";
    const otherUser = !isGroup
        ? conversation.participants.find(
              (p) => p.user_id !== currentUser?.user_id
          )
        : null;
    const name = isGroup
        ? conversation.group_name || "Group Chat"
        : otherUser?.full_name || "Unknown";
    const avatar = !isGroup ? otherUser?.avatar_url : null;

    // Fetch activity status for other user in DMs
    useEffect(() => {
        if (!otherUser) return;
        getUsersActivity([otherUser.user_id])
            .then((data) => setActivityData(data))
            .catch(() => {});
    }, [otherUser?.user_id]);

    const otherActivity = otherUser
        ? activityData[otherUser.user_id]
        : null;
    const isOnline = otherActivity?.is_online ||
        (otherUser ? onlineUsers.has(otherUser.user_id) : false);
    const showActivity = otherActivity?.show_activity_status !== false;

    const getTypingText = () => {
        if (typingUsers.size === 0) return null;
        const participants = conversation.participants.filter(
            (p) =>
                typingUsers.has(p.user_id) &&
                p.user_id !== currentUser?.user_id
        );
        if (participants.length === 0) return null;
        if (participants.length === 1)
            return `${participants[0].full_name} is typing...`;
        return `${participants.length} people typing...`;
    };

    const typingText = getTypingText();

    const getStatusText = () => {
        if (typingText) return null; // typing takes priority
        if (!showActivity) return "";
        if (isOnline) return "Active now";
        if (otherActivity?.last_active_at) {
            return formatLastActive(otherActivity.last_active_at);
        }
        return "";
    };

    const statusText = getStatusText();

    return (
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-3 py-3">
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => router.push("/inbox")}
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>

                <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {avatar ? (
                            <img
                                src={avatar}
                                alt={name}
                                className="w-full h-full object-cover"
                            />
                        ) : isGroup ? (
                            <Users className="w-5 h-5 text-muted-foreground" />
                        ) : (
                            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                                <span className="text-primary font-bold">
                                    {name[0]?.toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                    {!isGroup && isOnline && showActivity && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-sm truncate">{name}</h2>
                    {typingText ? (
                        <p className="text-xs text-primary animate-pulse truncate">
                            {typingText}
                        </p>
                    ) : isGroup ? (
                        <p className="text-xs text-muted-foreground">
                            {conversation.participants.length} members
                        </p>
                    ) : statusText ? (
                        <p className={`text-xs ${isOnline ? "text-green-500" : "text-muted-foreground"}`}>
                            {statusText}
                        </p>
                    ) : null}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={onInfoClick}
                >
                    <Info className="w-5 h-5" />
                </Button>
            </div>
        </header>
    );
}
