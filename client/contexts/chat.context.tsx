"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useRef
} from "react";
import { io, Socket } from "socket.io-client";
import { ChatConversation, ChatMessage } from "@/types";
import {
    getConversations,
    getUnreadCount,
    getMessageRequests as fetchMessageRequests,
    getRequestCount as fetchRequestCount
} from "@/features/chat/chat.api";
import { useAuth } from "./auth.context";

interface ChatContextType {
    socket: Socket | null;
    isConnected: boolean;
    conversations: ChatConversation[];
    messageRequests: ChatConversation[];
    requestCount: number;
    unreadTotal: number;
    activeConversationId: string | null;
    setActiveConversationId: (id: string | null) => void;
    refreshConversations: () => Promise<void>;
    refreshUnreadCount: () => Promise<void>;
    refreshMessageRequests: () => Promise<void>;
    sendMessage: (data: {
        conversationId: string;
        content?: string;
        messageType?: "text" | "image" | "video" | "mixed";
        mediaKeys?: string[];
        replyTo?: string;
        tempId?: string;
    }) => void;
    joinConversation: (conversationId: string) => void;
    leaveConversation: (conversationId: string) => void;
    startTyping: (conversationId: string) => void;
    stopTyping: (conversationId: string) => void;
    reactToMessage: (
        messageId: string,
        conversationId: string,
        emoji: string
    ) => void;
    unreactToMessage: (
        messageId: string,
        conversationId: string
    ) => void;
    deleteMessage: (
        messageId: string,
        conversationId: string
    ) => void;
    markAsRead: (conversationId: string) => void;
    onlineUsers: Set<string>;

    // Event listeners
    onNewMessage: (
        cb: (message: ChatMessage) => void
    ) => () => void;
    onTypingStart: (
        cb: (data: { conversationId: string; userId: string }) => void
    ) => () => void;
    onTypingStop: (
        cb: (data: { conversationId: string; userId: string }) => void
    ) => () => void;
    onMessagesRead: (
        cb: (data: { conversationId: string; userId: string }) => void
    ) => () => void;
    onMessageReacted: (
        cb: (data: {
            messageId: string;
            conversationId: string;
            userId: string;
            emoji: string;
        }) => void
    ) => () => void;
    onMessageUnreacted: (
        cb: (data: {
            messageId: string;
            conversationId: string;
            userId: string;
        }) => void
    ) => () => void;
    onMessageDeleted: (
        cb: (data: {
            messageId: string;
            conversationId: string;
        }) => void
    ) => () => void;
    onConversationDeleted: (
        cb: (data: { conversationId: string }) => void
    ) => () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, isLoading, data: user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [messageRequests, setMessageRequests] = useState<ChatConversation[]>([]);
    const [requestCount, setRequestCount] = useState(0);
    const [unreadTotal, setUnreadTotal] = useState(0);
    const [activeConversationId, setActiveConversationId] = useState<
        string | null
    >(null);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const listenersRef = useRef<Map<string, Set<Function>>>(new Map());
    const socketRef = useRef<Socket | null>(null);

    // Socket connection — wait until auth is fully loaded and user is logged in
    useEffect(() => {
        if (isLoading) return; // wait for auth to finish
        if (!isLoggedIn || !user) return;

        const s = io("http://localhost:8000", {
            withCredentials: true,
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 10000
        });

        socketRef.current = s;

        s.on("connect", () => {
            setIsConnected(true);
        });

        s.on("disconnect", () => {
            setIsConnected(false);
        });

        s.on("reconnect", () => {
            setIsConnected(true);
            // Re-fetch data after reconnection
            refreshConversations();
            refreshUnreadCount();
        });

        // Online/offline tracking
        s.on("user:online", ({ userId }: { userId: string }) => {
            setOnlineUsers((prev) => new Set([...prev, userId]));
        });

        s.on("user:offline", ({ userId }: { userId: string }) => {
            setOnlineUsers((prev) => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
        });

        // New message
        s.on("message:new", (message: ChatMessage) => {
            emitEvent("message:new", message);
            refreshConversations();
        });

        // Typing
        s.on(
            "typing:start",
            (data: { conversationId: string; userId: string }) => {
                emitEvent("typing:start", data);
            }
        );

        s.on(
            "typing:stop",
            (data: { conversationId: string; userId: string }) => {
                emitEvent("typing:stop", data);
            }
        );

        // Read receipts
        s.on(
            "messages:read",
            (data: { conversationId: string; userId: string }) => {
                emitEvent("messages:read", data);
            }
        );

        // Reactions
        s.on("message:reacted", (data: any) => {
            emitEvent("message:reacted", data);
        });

        s.on("message:unreacted", (data: any) => {
            emitEvent("message:unreacted", data);
        });

        // Deleted message
        s.on("message:deleted", (data: any) => {
            emitEvent("message:deleted", data);
        });

        // Conversation deleted
        s.on("conversation:deleted", (data: { conversationId: string }) => {
            emitEvent("conversation:deleted", data);
            // Remove from local state
            setConversations((prev) =>
                prev.filter((c) => c.conversation_id !== data.conversationId)
            );
            refreshUnreadCount();
        });

        // Conversation updated (new message in another conversation)
        s.on("conversation:updated", () => {
            refreshConversations();
        });

        // Real-time unread count from server
        s.on("unread:update", (data: { total: number }) => {
            setUnreadTotal(data.total);
        });

        // Message request events
        s.on("message-request:new", () => {
            refreshMessageRequests();
        });

        s.on("message-request:accepted", () => {
            refreshConversations();
            refreshMessageRequests();
        });

        setSocket(s);

        return () => {
            s.disconnect();
            socketRef.current = null;
            setSocket(null);
            setIsConnected(false);
        };
    }, [isLoading, isLoggedIn, user?.user_id]);

    // Load conversations on connect
    useEffect(() => {
        if (isConnected) {
            refreshConversations();
            refreshUnreadCount();
            refreshMessageRequests();
        }
    }, [isConnected]);

    const emitEvent = (event: string, data: any) => {
        const listeners = listenersRef.current.get(event);
        if (listeners) {
            listeners.forEach((cb) => cb(data));
        }
    };

    const addEventListener = (event: string, cb: Function) => {
        if (!listenersRef.current.has(event)) {
            listenersRef.current.set(event, new Set());
        }
        listenersRef.current.get(event)!.add(cb);
        return () => {
            listenersRef.current.get(event)?.delete(cb);
        };
    };

    const refreshConversations = useCallback(async () => {
        try {
            const convs = await getConversations();
            setConversations(convs);
        } catch {
            // silently fail
        }
    }, []);

    const refreshUnreadCount = useCallback(async () => {
        try {
            const count = await getUnreadCount();
            setUnreadTotal(count);
        } catch {
            // silently fail
        }
    }, []);

    const refreshMessageRequests = useCallback(async () => {
        try {
            const [requests, count] = await Promise.all([
                fetchMessageRequests(),
                fetchRequestCount()
            ]);
            setMessageRequests(requests);
            setRequestCount(count);
        } catch {
            // silently fail
        }
    }, []);

    const sendMessage = useCallback(
        (data: {
            conversationId: string;
            content?: string;
            messageType?: "text" | "image" | "video" | "mixed";
            mediaKeys?: string[];
            replyTo?: string;
            tempId?: string;
        }) => {
            if (!socket) return;
            socket.emit("message:send", data);
        },
        [socket]
    );

    const joinConversation = useCallback(
        (conversationId: string) => {
            if (!socket) return;
            socket.emit("conversation:join", conversationId);
        },
        [socket]
    );

    const leaveConversation = useCallback(
        (conversationId: string) => {
            if (!socket) return;
            socket.emit("conversation:leave", conversationId);
        },
        [socket]
    );

    const startTyping = useCallback(
        (conversationId: string) => {
            if (!socket) return;
            socket.emit("typing:start", { conversationId });
        },
        [socket]
    );

    const stopTyping = useCallback(
        (conversationId: string) => {
            if (!socket) return;
            socket.emit("typing:stop", { conversationId });
        },
        [socket]
    );

    const reactToMsg = useCallback(
        (messageId: string, conversationId: string, emoji: string) => {
            if (!socket) return;
            socket.emit("message:react", {
                messageId,
                conversationId,
                emoji
            });
        },
        [socket]
    );

    const unreactToMsg = useCallback(
        (messageId: string, conversationId: string) => {
            if (!socket) return;
            socket.emit("message:unreact", {
                messageId,
                conversationId
            });
        },
        [socket]
    );

    const deleteMsg = useCallback(
        (messageId: string, conversationId: string) => {
            if (!socket) return;
            socket.emit("message:delete", {
                messageId,
                conversationId
            });
        },
        [socket]
    );

    const markRead = useCallback(
        (conversationId: string) => {
            if (!socket) return;
            socket.emit("messages:read", { conversationId });
        },
        [socket]
    );

    return (
        <ChatContext.Provider
            value={{
                socket,
                isConnected,
                conversations,
                messageRequests,
                requestCount,
                unreadTotal,
                activeConversationId,
                setActiveConversationId,
                refreshConversations,
                refreshUnreadCount,
                refreshMessageRequests,
                sendMessage,
                joinConversation,
                leaveConversation,
                startTyping,
                stopTyping,
                reactToMessage: reactToMsg,
                unreactToMessage: unreactToMsg,
                deleteMessage: deleteMsg,
                markAsRead: markRead,
                onlineUsers,
                onNewMessage: (cb) => addEventListener("message:new", cb),
                onTypingStart: (cb) =>
                    addEventListener("typing:start", cb),
                onTypingStop: (cb) =>
                    addEventListener("typing:stop", cb),
                onMessagesRead: (cb) =>
                    addEventListener("messages:read", cb),
                onMessageReacted: (cb) =>
                    addEventListener("message:reacted", cb),
                onMessageUnreacted: (cb) =>
                    addEventListener("message:unreacted", cb),
                onMessageDeleted: (cb) =>
                    addEventListener("message:deleted", cb),
                onConversationDeleted: (cb) =>
                    addEventListener("conversation:deleted", cb)
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const ctx = useContext(ChatContext);
    if (!ctx) {
        throw new Error("useChat must be used within ChatProvider");
    }
    return ctx;
}
