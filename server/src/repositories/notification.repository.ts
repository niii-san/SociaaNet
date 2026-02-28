import mongoose from "mongoose";
import { Notification } from "../models";
import { NotificationType } from "../types";
import { convertImageKeyToImageUrl } from "../utils";

class NotificationRepository {
    // Create a notification (silently ignores duplicates)
    async createNotification(data: {
        recipient: string;
        sender: string;
        type: NotificationType;
        target_id?: string;
        target_type?: "post" | "reel" | "comment" | "user";
        content?: string;
    }) {
        try {
            const notification = new Notification({
                recipient: new mongoose.Types.ObjectId(data.recipient),
                sender: new mongoose.Types.ObjectId(data.sender),
                type: data.type,
                target_id: data.target_id
                    ? new mongoose.Types.ObjectId(data.target_id)
                    : null,
                target_type: data.target_type || null,
                content: data.content || null
            });
            return notification.save();
        } catch (err: any) {
            // Silently ignore duplicate key errors (same notification already exists)
            if (err.code === 11000) return null;
            throw err;
        }
    }

    // Get notifications for a user with pagination and sender details
    async getNotifications(
        userId: string,
        page: number = 1,
        limit: number = 30
    ) {
        const skip = (page - 1) * limit;
        const userOid = new mongoose.Types.ObjectId(userId);

        const [notifications, total] = await Promise.all([
            Notification.aggregate([
                { $match: { recipient: userOid } },
                { $sort: { created_at: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "users",
                        localField: "sender",
                        foreignField: "_id",
                        as: "sender_data"
                    }
                },
                {
                    $unwind: {
                        path: "$sender_data",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        type: 1,
                        target_id: 1,
                        target_type: 1,
                        content: 1,
                        is_read: 1,
                        created_at: 1,
                        sender: {
                            user_id: "$sender_data._id",
                            username: "$sender_data.username",
                            full_name: "$sender_data.full_name",
                            avatar_key: "$sender_data.avatar_key"
                        }
                    }
                }
            ]),
            Notification.countDocuments({ recipient: userOid })
        ]);

        // Convert avatar keys to URLs
        const formatted = notifications.map((n) => ({
            ...n,
            sender: {
                ...n.sender,
                avatar_url: n.sender.avatar_key
                    ? convertImageKeyToImageUrl(n.sender.avatar_key)
                    : null
            }
        }));

        return {
            notifications: formatted,
            total,
            hasMore: skip + limit < total,
            page
        };
    }

    // Get unread notification count
    async getUnreadCount(userId: string): Promise<number> {
        return Notification.countDocuments({
            recipient: new mongoose.Types.ObjectId(userId),
            is_read: false
        });
    }

    // Mark all notifications as read for a user
    async markAllAsRead(userId: string): Promise<void> {
        await Notification.updateMany(
            {
                recipient: new mongoose.Types.ObjectId(userId),
                is_read: false
            },
            { $set: { is_read: true } }
        );
    }

    // Mark specific notification as read
    async markAsRead(
        notificationId: string,
        userId: string
    ): Promise<boolean> {
        const result = await Notification.updateOne(
            {
                _id: new mongoose.Types.ObjectId(notificationId),
                recipient: new mongoose.Types.ObjectId(userId)
            },
            { $set: { is_read: true } }
        );
        return result.modifiedCount > 0;
    }

    // Delete a notification
    async deleteNotification(
        notificationId: string,
        userId: string
    ): Promise<boolean> {
        const result = await Notification.deleteOne({
            _id: new mongoose.Types.ObjectId(notificationId),
            recipient: new mongoose.Types.ObjectId(userId)
        });
        return result.deletedCount > 0;
    }

    // Remove a notification by event (e.g., when unliking a post)
    async removeByEvent(data: {
        sender: string;
        recipient: string;
        type: NotificationType;
        target_id?: string;
    }): Promise<void> {
        const query: any = {
            sender: new mongoose.Types.ObjectId(data.sender),
            recipient: new mongoose.Types.ObjectId(data.recipient),
            type: data.type
        };
        if (data.target_id) {
            query.target_id = new mongoose.Types.ObjectId(data.target_id);
        }
        await Notification.deleteOne(query);
    }

    // Clear all notifications for a user
    async clearAll(userId: string): Promise<void> {
        await Notification.deleteMany({
            recipient: new mongoose.Types.ObjectId(userId)
        });
    }
}

export const notificationRepo = new NotificationRepository();
