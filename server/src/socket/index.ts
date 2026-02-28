import { Server as SocketIOServer, Socket } from "socket.io";
import http from "http";
import mongoose from "mongoose";
import { Session, User, UserSettings } from "../models";
import { chatService } from "../services";
import { chatRepo } from "../repositories";

// Map userId -> Set of socketIds
const onlineUsers = new Map<string, Set<string>>();

let ioInstance: SocketIOServer | null = null;

export function getIO(): SocketIOServer {
    if (!ioInstance) {
        throw new Error("Socket.IO not initialized");
    }
    return ioInstance;
}

export function setupSocketIO(httpServer: http.Server): SocketIOServer {
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true
        },
        transports: ["websocket", "polling"]
    });

    ioInstance = io;

    // Auth middleware - validate session cookie
    io.use(async (socket, next) => {
        try {
            const sessionId =
                socket.handshake.auth?.sessionId ||
                parseCookie(socket.handshake.headers.cookie || "", "session_id");

            if (!sessionId) {
                return next(new Error("Authentication required"));
            }

            // Use session_id field, NOT _id
            const session = await Session.findOne({ session_id: sessionId }).lean();
            if (
                !session ||
                session.has_expired ||
                session.is_deleted ||
                session.is_revoked
            ) {
                return next(new Error("Invalid session"));
            }

            const now = new Date();
            if (new Date(session.expires_at) < now) {
                return next(new Error("Session expired"));
            }

            (socket as any).userId = session.user_id.toString();
            next();
        } catch {
            next(new Error("Authentication failed"));
        }
    });

    io.on("connection", async (socket: Socket) => {
        const userId = (socket as any).userId as string;

        // Update last_active_at on connect
        await User.findByIdAndUpdate(userId, {
            last_active_at: new Date(),
            is_online: true
        });

        // Track online status
        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Set());
        }
        onlineUsers.get(userId)!.add(socket.id);

        // Join user's personal room for targeted events
        socket.join(`user:${userId}`);

        // Only broadcast online status if user has show_activity_status enabled
        const settings = await UserSettings.findOne(
            { user_id: userId },
            { "privacy.show_activity_status": 1 }
        ).lean();
        const showActivity = settings?.privacy?.show_activity_status !== false;

        if (showActivity) {
            socket.broadcast.emit("user:online", { userId });
        }

        // === Join conversation rooms ===
        socket.on("conversation:join", async (conversationId: string) => {
            try {
                await chatService.getConversation(conversationId, userId);
                socket.join(`conversation:${conversationId}`);

                // Mark as read when joining
                await chatService.markAsRead(conversationId, userId);
                io.to(`conversation:${conversationId}`).emit("messages:read", {
                    conversationId,
                    userId
                });
                // Update unread count for user
                const unreadCount = await chatRepo.getUnreadCount(userId);
                io.to(`user:${userId}`).emit("unread:update", {
                    total: unreadCount
                });
            } catch {
                socket.emit("error", { message: "Cannot join conversation" });
            }
        });

        socket.on("conversation:leave", (conversationId: string) => {
            socket.leave(`conversation:${conversationId}`);
        });

        // === Send message ===
        socket.on(
            "message:send",
            async (data: {
                conversationId: string;
                content?: string;
                messageType?: "text" | "image" | "video" | "mixed";
                mediaUrls?: string[];
                mediaKeys?: string[];
                replyTo?: string;
                tempId?: string;
            }) => {
                try {
                    const message = await chatService.sendMessage({
                        conversationId: data.conversationId,
                        senderId: userId,
                        content: data.content,
                        messageType: data.messageType || "text",
                        mediaUrls: data.mediaUrls,
                        mediaKeys: data.mediaKeys,
                        replyTo: data.replyTo
                    });

                    // Fetch full message with sender info
                    const messages = await chatService.getMessages(
                        data.conversationId,
                        userId,
                        1,
                        1
                    );
                    const fullMessage = messages.messages[messages.messages.length - 1];

                    // Emit to all in conversation
                    io.to(`conversation:${data.conversationId}`).emit(
                        "message:new",
                        {
                            ...fullMessage,
                            tempId: data.tempId
                        }
                    );

                    // Also notify the conversation list update for participants not in the room
                    const conv = await chatRepo.getConversationById(
                        data.conversationId
                    );
                    if (conv) {
                        // Send unread count update to each other participant
                        for (const pid of conv.participants) {
                            const pidStr = pid.toString();
                            if (pidStr !== userId) {
                                io.to(`user:${pidStr}`).emit(
                                    "conversation:updated",
                                    {
                                        conversationId: data.conversationId
                                    }
                                );
                                // Send real-time unread count
                                const unreadCount =
                                    await chatRepo.getUnreadCount(pidStr);
                                io.to(`user:${pidStr}`).emit(
                                    "unread:update",
                                    {
                                        total: unreadCount
                                    }
                                );
                            }
                        }
                    }
                } catch (err: any) {
                    socket.emit("error", {
                        message: err.message || "Failed to send message"
                    });
                }
            }
        );

        // === Typing indicators ===
        socket.on(
            "typing:start",
            (data: { conversationId: string }) => {
                socket
                    .to(`conversation:${data.conversationId}`)
                    .emit("typing:start", {
                        conversationId: data.conversationId,
                        userId
                    });
            }
        );

        socket.on(
            "typing:stop",
            (data: { conversationId: string }) => {
                socket
                    .to(`conversation:${data.conversationId}`)
                    .emit("typing:stop", {
                        conversationId: data.conversationId,
                        userId
                    });
            }
        );

        // === Read receipts ===
        socket.on(
            "messages:read",
            async (data: { conversationId: string }) => {
                try {
                    await chatService.markAsRead(
                        data.conversationId,
                        userId
                    );
                    io.to(`conversation:${data.conversationId}`).emit(
                        "messages:read",
                        {
                            conversationId: data.conversationId,
                            userId
                        }
                    );
                    // Update unread count for the reader
                    const unreadCount =
                        await chatRepo.getUnreadCount(userId);
                    io.to(`user:${userId}`).emit("unread:update", {
                        total: unreadCount
                    });
                } catch {
                    // silently ignore
                }
            }
        );

        // === Reactions ===
        socket.on(
            "message:react",
            async (data: {
                messageId: string;
                conversationId: string;
                emoji: string;
            }) => {
                try {
                    await chatService.reactToMessage(
                        data.messageId,
                        userId,
                        data.emoji
                    );
                    io.to(`conversation:${data.conversationId}`).emit(
                        "message:reacted",
                        {
                            messageId: data.messageId,
                            conversationId: data.conversationId,
                            userId,
                            emoji: data.emoji
                        }
                    );
                } catch {
                    socket.emit("error", {
                        message: "Failed to react"
                    });
                }
            }
        );

        socket.on(
            "message:unreact",
            async (data: {
                messageId: string;
                conversationId: string;
            }) => {
                try {
                    await chatService.removeReaction(
                        data.messageId,
                        userId
                    );
                    io.to(`conversation:${data.conversationId}`).emit(
                        "message:unreacted",
                        {
                            messageId: data.messageId,
                            conversationId: data.conversationId,
                            userId
                        }
                    );
                } catch {
                    socket.emit("error", {
                        message: "Failed to remove reaction"
                    });
                }
            }
        );

        // === Delete message ===
        socket.on(
            "message:delete",
            async (data: {
                messageId: string;
                conversationId: string;
            }) => {
                try {
                    await chatService.deleteMessage(
                        data.messageId,
                        userId
                    );
                    io.to(`conversation:${data.conversationId}`).emit(
                        "message:deleted",
                        {
                            messageId: data.messageId,
                            conversationId: data.conversationId
                        }
                    );
                } catch {
                    socket.emit("error", {
                        message: "Failed to delete message"
                    });
                }
            }
        );

        // === Online status check ===
        socket.on(
            "user:check-online",
            async (data: { userIds: string[] }) => {
                const statuses: Record<string, boolean> = {};

                // Check if the requesting user has their own activity status on
                const requesterSettings = await UserSettings.findOne(
                    { user_id: userId },
                    { "privacy.show_activity_status": 1 }
                ).lean();
                const requesterShowActivity =
                    (requesterSettings as any)?.privacy
                        ?.show_activity_status !== false;

                // If requester has activity off, return all as offline
                if (!requesterShowActivity) {
                    data.userIds.forEach((uid) => {
                        statuses[uid] = false;
                    });
                    socket.emit("user:online-status", statuses);
                    return;
                }

                // Batch check activity settings
                const settingsList = await UserSettings.find(
                    {
                        user_id: {
                            $in: data.userIds.map(
                                (id) => new mongoose.Types.ObjectId(id)
                            )
                        }
                    },
                    { user_id: 1, "privacy.show_activity_status": 1 }
                ).lean();

                const settingsMap = new Map<string, boolean>();
                settingsList.forEach((s: any) => {
                    settingsMap.set(
                        s.user_id.toString(),
                        s.privacy?.show_activity_status !== false
                    );
                });

                data.userIds.forEach((uid) => {
                    const isOnline =
                        onlineUsers.has(uid) &&
                        onlineUsers.get(uid)!.size > 0;
                    const showStatus = settingsMap.get(uid) !== false;
                    statuses[uid] = isOnline && showStatus;
                });
                socket.emit("user:online-status", statuses);
            }
        );

        // === Disconnect ===
        socket.on("disconnect", async () => {
            const userSockets = onlineUsers.get(userId);
            if (userSockets) {
                userSockets.delete(socket.id);
                if (userSockets.size === 0) {
                    onlineUsers.delete(userId);

                    // Update last_active_at on last socket disconnect
                    await User.findByIdAndUpdate(userId, {
                        last_active_at: new Date(),
                        is_online: false
                    });

                    // Only broadcast offline if user has show_activity_status enabled
                    const settings = await UserSettings.findOne(
                        { user_id: userId },
                        { "privacy.show_activity_status": 1 }
                    ).lean();
                    const showActivity =
                        settings?.privacy?.show_activity_status !== false;

                    if (showActivity) {
                        socket.broadcast.emit("user:offline", { userId });
                    }
                }
            }
        });
    });

    return io;
}

function parseCookie(cookieStr: string, name: string): string | null {
    const match = cookieStr.match(
        new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
}
