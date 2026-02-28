import { notificationRepo } from "../repositories";
import { NotificationType } from "../types";
import { UserSettings } from "../models";
import { HttpError } from "../utils";
import { ErrorCodes } from "../constants/error-code";

// Maps notification types to the settings key that controls them
const typeToSettingsKey: Record<NotificationType, string> = {
    follow: "follows",
    follow_request: "follows",
    follow_request_accepted: "follows",
    like_post: "likes",
    like_reel: "likes",
    like_comment: "likes",
    comment_post: "comments",
    comment_reel: "comments",
    reply_comment: "comments",
    repost_post: "likes", // group reposts under likes setting
    repost_reel: "likes",
    mention: "mentions"
};

class NotificationService {
    /**
     * Create a notification and emit it via socket.
     * Respects user notification preferences.
     * Skips if sender === recipient (no self-notifications).
     */
    async notify(data: {
        recipientId: string;
        senderId: string;
        type: NotificationType;
        targetId?: string;
        targetType?: "post" | "reel" | "comment" | "user";
        content?: string;
    }) {
        // Don't notify yourself
        if (data.recipientId === data.senderId) return null;

        // Check recipient's notification preferences
        const settingsKey = typeToSettingsKey[data.type];
        if (settingsKey) {
            const settings = await UserSettings.findOne(
                { user_id: data.recipientId },
                { [`notifications.${settingsKey}`]: 1 }
            ).lean() as any;

            if (settings?.notifications?.[settingsKey] === false) {
                return null; // User has this notification type disabled
            }
        }

        // Create the notification
        const notification = await notificationRepo.createNotification({
            recipient: data.recipientId,
            sender: data.senderId,
            type: data.type,
            target_id: data.targetId,
            target_type: data.targetType,
            content: data.content
        });

        if (!notification) return null; // Duplicate, silently skip

        // Emit via socket for real-time delivery
        try {
            const { getIO } = require("../socket");
            const io = getIO();

            // Get unread count for the badge
            const unreadCount = await notificationRepo.getUnreadCount(
                data.recipientId
            );

            // Fetch sender details for the real-time notification
            const populated = await notificationRepo.getNotifications(
                data.recipientId,
                1,
                1
            );

            if (populated.notifications.length > 0) {
                io.to(`user:${data.recipientId}`).emit("notification:new", {
                    notification: populated.notifications[0],
                    unreadCount
                });
            }
        } catch {
            // Socket not initialized, skip real-time delivery
        }

        return notification;
    }

    // Remove a notification when an action is undone (unlike, unfollow, etc.)
    async removeNotification(data: {
        senderId: string;
        recipientId: string;
        type: NotificationType;
        targetId?: string;
    }) {
        await notificationRepo.removeByEvent({
            sender: data.senderId,
            recipient: data.recipientId,
            type: data.type,
            target_id: data.targetId
        });

        // Emit updated count
        try {
            const { getIO } = require("../socket");
            const io = getIO();
            const unreadCount = await notificationRepo.getUnreadCount(
                data.recipientId
            );
            io.to(`user:${data.recipientId}`).emit("notification:count", {
                unreadCount
            });
        } catch {
            // Socket not initialized
        }
    }

    // Get paginated notifications for a user
    async getNotifications(userId: string, page: number = 1, limit: number = 30) {
        return notificationRepo.getNotifications(userId, page, limit);
    }

    // Get unread count
    async getUnreadCount(userId: string) {
        return notificationRepo.getUnreadCount(userId);
    }

    // Mark all as read
    async markAllAsRead(userId: string) {
        await notificationRepo.markAllAsRead(userId);
    }

    // Mark single notification as read
    async markAsRead(notificationId: string, userId: string) {
        return notificationRepo.markAsRead(notificationId, userId);
    }

    // Delete a notification
    async deleteNotification(notificationId: string, userId: string) {
        const deleted = await notificationRepo.deleteNotification(
            notificationId,
            userId
        );
        if (!deleted) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Notification not found"
            );
        }
    }

    // Clear all notifications
    async clearAll(userId: string) {
        await notificationRepo.clearAll(userId);
    }
}

export const notificationService = new NotificationService();
