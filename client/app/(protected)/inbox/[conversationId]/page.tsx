"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts";
import { useChat } from "@/contexts/chat.context";
import { ChatConversation, ChatMessage } from "@/types";
import { getMessages } from "@/features/chat/chat.api";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { MessageBubble } from "@/components/chat/message-bubble";
import { GroupInfoDialog } from "@/components/chat/group-info-dialog";
import { Loader2, MessageCircle, Check, X, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    acceptMessageRequest,
    rejectMessageRequest
} from "@/features/chat/chat.api";

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const conversationId = params.conversationId as string;
    const { data: currentUser } = useAuth();
    const {
        conversations,
        messageRequests,
        joinConversation,
        leaveConversation,
        sendMessage,
        startTyping,
        stopTyping,
        reactToMessage,
        unreactToMessage,
        deleteMessage,
        markAsRead,
        onNewMessage,
        onTypingStart,
        onTypingStop,
        onMessagesRead,
        onMessageReacted,
        onMessageUnreacted,
        onMessageDeleted,
        onConversationDeleted,
        refreshConversations,
        refreshMessageRequests
    } = useChat();

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
    const [showInfo, setShowInfo] = useState(false);
    const [respondingToRequest, setRespondingToRequest] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const isInitialLoad = useRef(true);

    // Check both conversations and messageRequests for the current conversation
    const conversation = conversations.find(
        (c) => c.conversation_id === conversationId || c._id === conversationId
    ) || messageRequests.find(
        (c) => c.conversation_id === conversationId || c._id === conversationId
    );

    const isPendingRequest =
        conversation?.request_status === "pending" &&
        conversation?.created_by !== currentUser?.user_id;

    const isSenderPending =
        conversation?.request_status === "pending" &&
        conversation?.created_by === currentUser?.user_id;

    // Join conversation on mount
    useEffect(() => {
        if (conversationId) {
            joinConversation(conversationId);
            markAsRead(conversationId);
        }
        return () => {
            if (conversationId) {
                leaveConversation(conversationId);
            }
        };
    }, [conversationId]);

    // Load messages
    useEffect(() => {
        loadMessages();
    }, [conversationId]);

    const loadMessages = async () => {
        setLoading(true);
        try {
            const data = await getMessages(conversationId, 1, 50);
            setMessages(data.messages);
            setHasMore(data.hasMore);
            setPage(1);
            isInitialLoad.current = true;
        } catch {
            toast.error("Failed to load messages");
        } finally {
            setLoading(false);
        }
    };

    // Scroll to bottom on initial load & new messages
    useEffect(() => {
        if (isInitialLoad.current && messages.length > 0) {
            scrollToBottom();
            isInitialLoad.current = false;
        }
    }, [messages, loading]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    };

    // Load older messages
    const loadOlderMessages = async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        const nextPage = page + 1;
        try {
            const container = messagesContainerRef.current;
            const scrollHeightBefore = container?.scrollHeight || 0;

            const data = await getMessages(conversationId, nextPage, 50);
            setMessages((prev) => [...data.messages, ...prev]);
            setHasMore(data.hasMore);
            setPage(nextPage);

            // Preserve scroll position
            requestAnimationFrame(() => {
                if (container) {
                    const scrollHeightAfter = container.scrollHeight;
                    container.scrollTop =
                        scrollHeightAfter - scrollHeightBefore;
                }
            });
        } catch {
            toast.error("Failed to load more messages");
        } finally {
            setLoadingMore(false);
        }
    };

    // Handle scroll for infinite loading
    const handleScroll = () => {
        const container = messagesContainerRef.current;
        if (!container) return;
        if (container.scrollTop < 100 && hasMore && !loadingMore) {
            loadOlderMessages();
        }
    };

    // Socket event listeners
    useEffect(() => {
        const unsubNewMessage = onNewMessage((message: ChatMessage) => {
            if (message.conversation_id === conversationId) {
                setMessages((prev) => {
                    // Avoid duplicates
                    if (prev.some((m) => m._id === message._id)) return prev;
                    return [...prev, message];
                });
                // Auto-scroll if near bottom
                const container = messagesContainerRef.current;
                if (container) {
                    const isNearBottom =
                        container.scrollHeight -
                            container.scrollTop -
                            container.clientHeight <
                        150;
                    if (
                        isNearBottom ||
                        message.sender.user_id === currentUser?.user_id
                    ) {
                        requestAnimationFrame(() => scrollToBottom());
                    }
                }
                // Mark as read
                markAsRead(conversationId);
            }
        });

        const unsubTypingStart = onTypingStart(
            (data: { conversationId: string; userId: string }) => {
                if (data.conversationId === conversationId) {
                    setTypingUsers((prev) => new Set([...prev, data.userId]));
                }
            }
        );

        const unsubTypingStop = onTypingStop(
            (data: { conversationId: string; userId: string }) => {
                if (data.conversationId === conversationId) {
                    setTypingUsers((prev) => {
                        const next = new Set(prev);
                        next.delete(data.userId);
                        return next;
                    });
                }
            }
        );

        const unsubRead = onMessagesRead(
            (data: { conversationId: string; userId: string }) => {
                if (data.conversationId === conversationId) {
                    setMessages((prev) =>
                        prev.map((m) => ({
                            ...m,
                            read_by: [
                                ...m.read_by,
                                ...(m.read_by.some(
                                    (r) => r.user_id === data.userId
                                )
                                    ? []
                                    : [
                                          {
                                              user_id: data.userId,
                                              read_at: new Date().toISOString()
                                          }
                                      ])
                            ]
                        }))
                    );
                }
            }
        );

        const unsubReacted = onMessageReacted(
            (data: {
                messageId: string;
                conversationId: string;
                userId: string;
                emoji: string;
            }) => {
                if (data.conversationId === conversationId) {
                    setMessages((prev) =>
                        prev.map((m) => {
                            if (m._id !== data.messageId) return m;
                            const filtered = m.reactions.filter(
                                (r) => r.user_id !== data.userId
                            );
                            return {
                                ...m,
                                reactions: [
                                    ...filtered,
                                    {
                                        user_id: data.userId,
                                        emoji: data.emoji,
                                        created_at: new Date().toISOString()
                                    }
                                ]
                            };
                        })
                    );
                }
            }
        );

        const unsubUnreacted = onMessageUnreacted(
            (data: {
                messageId: string;
                conversationId: string;
                userId: string;
            }) => {
                if (data.conversationId === conversationId) {
                    setMessages((prev) =>
                        prev.map((m) => {
                            if (m._id !== data.messageId) return m;
                            return {
                                ...m,
                                reactions: m.reactions.filter(
                                    (r) => r.user_id !== data.userId
                                )
                            };
                        })
                    );
                }
            }
        );

        const unsubDeleted = onMessageDeleted(
            (data: { messageId: string; conversationId: string }) => {
                if (data.conversationId === conversationId) {
                    setMessages((prev) =>
                        prev.map((m) =>
                            m._id === data.messageId
                                ? { ...m, is_deleted: true, content: "" }
                                : m
                        )
                    );
                }
            }
        );

        const unsubConvDeleted = onConversationDeleted(
            (data: { conversationId: string }) => {
                if (data.conversationId === conversationId) {
                    toast.info("This conversation was deleted");
                    router.push("/inbox");
                }
            }
        );

        return () => {
            unsubNewMessage();
            unsubTypingStart();
            unsubTypingStop();
            unsubRead();
            unsubReacted();
            unsubUnreacted();
            unsubDeleted();
            unsubConvDeleted();
        };
    }, [conversationId, currentUser?.user_id]);

    const handleAcceptRequest = async () => {
        try {
            setRespondingToRequest(true);
            await acceptMessageRequest(conversationId);
            toast.success("Message request accepted");
            await Promise.all([refreshConversations(), refreshMessageRequests()]);
        } catch {
            toast.error("Failed to accept request");
        } finally {
            setRespondingToRequest(false);
        }
    };

    const handleRejectRequest = async () => {
        try {
            setRespondingToRequest(true);
            await rejectMessageRequest(conversationId);
            toast.success("Message request rejected");
            await refreshMessageRequests();
            router.push("/inbox");
        } catch {
            toast.error("Failed to reject request");
        } finally {
            setRespondingToRequest(false);
        }
    };

    const handleSend = (data: {
        content?: string;
        messageType?: "text" | "image" | "video" | "mixed";
        mediaUrls?: string[];
        mediaKeys?: string[];
        replyTo?: string;
    }) => {
        const tempId = `temp-${Date.now()}`;
        sendMessage({
            conversationId,
            ...data,
            tempId
        });
    };

    const handleReact = (messageId: string, emoji: string) => {
        reactToMessage(messageId, conversationId, emoji);
        // Optimistic update
        setMessages((prev) =>
            prev.map((m) => {
                if (m._id !== messageId) return m;
                const filtered = m.reactions.filter(
                    (r) => r.user_id !== currentUser?.user_id
                );
                return {
                    ...m,
                    reactions: [
                        ...filtered,
                        {
                            user_id: currentUser?.user_id || "",
                            emoji,
                            created_at: new Date().toISOString()
                        }
                    ]
                };
            })
        );
    };

    const handleUnreact = (messageId: string) => {
        unreactToMessage(messageId, conversationId);
        // Optimistic update
        setMessages((prev) =>
            prev.map((m) => {
                if (m._id !== messageId) return m;
                return {
                    ...m,
                    reactions: m.reactions.filter(
                        (r) => r.user_id !== currentUser?.user_id
                    )
                };
            })
        );
    };

    const handleDelete = (messageId: string) => {
        deleteMessage(messageId, conversationId);
        // Optimistic update
        setMessages((prev) =>
            prev.map((m) =>
                m._id === messageId
                    ? { ...m, is_deleted: true, content: "" }
                    : m
            )
        );
    };

    // Date separators
    const getDateLabel = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return "Today";
        if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year:
                date.getFullYear() !== today.getFullYear()
                    ? "numeric"
                    : undefined
        });
    };

    const shouldShowDateSeparator = (index: number) => {
        if (index === 0) return true;
        const curr = new Date(messages[index].created_at).toDateString();
        const prev = new Date(messages[index - 1].created_at).toDateString();
        return curr !== prev;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="h-screen bg-background flex flex-col">
            {/* Header */}
            {conversation && (
                <ChatHeader
                    conversation={conversation}
                    typingUsers={typingUsers}
                    onInfoClick={() => setShowInfo(true)}
                />
            )}

            {/* Messages */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto py-2"
            >
                {/* Load more indicator */}
                {loadingMore && (
                    <div className="flex justify-center py-3">
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                )}

                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <MessageCircle className="w-12 h-12 text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground">
                            No messages yet. Say hi! 👋
                        </p>
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <div key={msg._id || msg.tempId || i}>
                            {shouldShowDateSeparator(i) && (
                                <div className="flex items-center gap-3 px-4 py-3">
                                    <div className="flex-1 h-px bg-border" />
                                    <span className="text-xs text-muted-foreground font-medium">
                                        {getDateLabel(msg.created_at)}
                                    </span>
                                    <div className="flex-1 h-px bg-border" />
                                </div>
                            )}
                            <MessageBubble
                                message={msg}
                                isGroup={conversation?.type === "group"}
                                onReply={setReplyTo}
                                onReact={handleReact}
                                onUnreact={handleUnreact}
                                onDelete={handleDelete}
                            />
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Request Banner or Input */}
            {isPendingRequest ? (
                <div className="border-t border-border bg-muted/30 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldAlert className="w-5 h-5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                                {conversation?.participants.find(
                                    (p) => p.user_id !== currentUser?.user_id
                                )?.full_name || "This user"}
                            </span>{" "}
                            wants to send you a message
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={handleRejectRequest}
                            disabled={respondingToRequest}
                        >
                            {respondingToRequest ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <X className="w-4 h-4" />
                            )}
                            Reject
                        </Button>
                        <Button
                            className="flex-1 gap-1.5"
                            onClick={handleAcceptRequest}
                            disabled={respondingToRequest}
                        >
                            {respondingToRequest ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Check className="w-4 h-4" />
                            )}
                            Accept
                        </Button>
                    </div>
                </div>
            ) : isSenderPending ? (
                <div className="border-t border-border bg-muted/30 p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        Waiting for{" "}
                        <span className="font-medium text-foreground">
                            {conversation?.participants.find(
                                (p) => p.user_id !== currentUser?.user_id
                            )?.full_name || "this user"}
                        </span>{" "}
                        to accept your message request
                    </p>
                </div>
            ) : (
                <ChatInput
                    onSend={handleSend}
                    replyTo={replyTo}
                    onCancelReply={() => setReplyTo(null)}
                    onTypingStart={() => startTyping(conversationId)}
                    onTypingStop={() => stopTyping(conversationId)}
                />
            )}

            {/* Group Info / Chat Info Dialog */}
            {conversation && (
                <GroupInfoDialog
                    open={showInfo}
                    onOpenChange={setShowInfo}
                    conversation={conversation}
                    onConversationUpdate={() => {
                        refreshConversations();
                    }}
                />
            )}
        </div>
    );
}
