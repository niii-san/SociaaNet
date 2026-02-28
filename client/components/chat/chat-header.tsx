"use client";

import { ChatConversation, ChatParticipant } from "@/types";
import { useAuth } from "@/contexts";
import { useChat } from "@/contexts/chat.context";
import { ArrowLeft, Users, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ChatHeaderProps {
    conversation: ChatConversation;
    typingUsers: Set<string>;
    onInfoClick: () => void;
}

export function ChatHeader({
    conversation,
    typingUsers,
    onInfoClick
}: ChatHeaderProps) {
    const router = useRouter();
    const { data: currentUser } = useAuth();
    const { onlineUsers } = useChat();

    const isGroup = conversation.type === "group";
    const otherUser = !isGroup
        ? conversation.participants.find(
              (p) => p.user_id !== currentUser?.user_id
          )
        : null;
    const isOnline = otherUser ? onlineUsers.has(otherUser.user_id) : false;
    const name = isGroup
        ? conversation.group_name || "Group Chat"
        : otherUser?.full_name || "Unknown";
    const avatar = !isGroup ? otherUser?.avatar_url : null;

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
                    {!isGroup && isOnline && (
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
                    ) : (
                        <p className="text-xs text-muted-foreground">
                            {isOnline ? "Active now" : ""}
                        </p>
                    )}
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
