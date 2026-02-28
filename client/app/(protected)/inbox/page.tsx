"use client";

import { useState } from "react";
import { useAuth } from "@/contexts";
import { useChat } from "@/contexts/chat.context";
import { ChatConversation } from "@/types";
import { Mail, Plus, Users, Search, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { NewChatDialog } from "@/components/chat/new-chat-dialog";

function getConversationName(
    conv: ChatConversation,
    currentUserId: string
): string {
    if (conv.type === "group") return conv.group_name || "Group Chat";
    const other = conv.participants.find((p) => p.user_id !== currentUserId);
    return other?.full_name || "Unknown User";
}

function getConversationAvatar(
    conv: ChatConversation,
    currentUserId: string
): string | null {
    if (conv.type === "group") return null;
    const other = conv.participants.find((p) => p.user_id !== currentUserId);
    return other?.avatar_url || null;
}

function formatTime(dateStr: string): string {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getLastMessagePreview(conv: ChatConversation): string {
    if (!conv.last_message) return "No messages yet";
    if (conv.last_message.is_deleted) return "Message deleted";
    if (conv.last_message.message_type === "image") return "📷 Photo";
    if (conv.last_message.message_type === "video") return "🎥 Video";
    if (conv.last_message.message_type === "mixed") return "📎 Media";
    return conv.last_message.content || "No messages yet";
}

export default function Page() {
    const { data: currentUser } = useAuth();
    const { conversations, onlineUsers } = useChat();
    const [searchQuery, setSearchQuery] = useState("");
    const [showNewChat, setShowNewChat] = useState(false);

    const filteredConversations = conversations.filter((conv) => {
        if (!searchQuery) return true;
        const name = getConversationName(
            conv,
            currentUser?.user_id || ""
        ).toLowerCase();
        return name.includes(searchQuery.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <Mail className="w-6 h-6 text-primary" />
                        <h1 className="text-2xl font-bold">Inbox</h1>
                    </div>
                    <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => setShowNewChat(true)}
                    >
                        <Plus className="w-4 h-4" />
                        New Chat
                    </Button>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </header>

            {/* Conversations List */}
            <div className="divide-y divide-border">
                {filteredConversations.length === 0 ? (
                    <div className="text-center py-16">
                        <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            {searchQuery
                                ? "No conversations found"
                                : "No conversations yet"}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            {searchQuery
                                ? "Try a different search"
                                : "Start chatting with your friends!"}
                        </p>
                        {!searchQuery && (
                            <Button
                                className="gap-2"
                                onClick={() => setShowNewChat(true)}
                            >
                                <Plus className="w-4 h-4" />
                                Start a conversation
                            </Button>
                        )}
                    </div>
                ) : (
                    filteredConversations.map((conv) => {
                        const name = getConversationName(
                            conv,
                            currentUser?.user_id || ""
                        );
                        const avatar = getConversationAvatar(
                            conv,
                            currentUser?.user_id || ""
                        );
                        const otherUser = conv.participants.find(
                            (p) => p.user_id !== currentUser?.user_id
                        );
                        const isOnline =
                            conv.type === "direct" &&
                            otherUser &&
                            onlineUsers.has(otherUser.user_id);

                        return (
                            <Link
                                key={conv.conversation_id}
                                href={`/inbox/${conv.conversation_id}`}
                                className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
                            >
                                <div className="relative shrink-0">
                                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                        {avatar ? (
                                            <img
                                                src={avatar}
                                                alt={name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : conv.type === "group" ? (
                                            <Users className="w-6 h-6 text-muted-foreground" />
                                        ) : (
                                            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                                                <span className="text-primary font-bold text-lg">
                                                    {name[0]?.toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {isOnline && (
                                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="font-semibold truncate">
                                            {name}
                                        </h3>
                                        <span className="text-xs text-muted-foreground shrink-0">
                                            {formatTime(
                                                conv.last_message?.created_at ||
                                                    conv.last_message_at
                                            )}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                                        {conv.type === "group" &&
                                        conv.last_message?.sender
                                            ? `${conv.last_message.sender.full_name}: `
                                            : ""}
                                        {getLastMessagePreview(conv)}
                                    </p>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>

            <NewChatDialog
                open={showNewChat}
                onOpenChange={setShowNewChat}
            />
        </div>
    );
}
