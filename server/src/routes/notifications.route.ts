import { Router } from "express";
import { authenticate } from "../middlewares";
import {
    getNotificationsController,
    getUnreadCountController,
    markAllAsReadController,
    markAsReadController,
    deleteNotificationController,
    clearAllNotificationsController
} from "../controllers/notification/notification.controller";

export const notificationsRouter = Router();

notificationsRouter.use(authenticate);

// Get notifications (paginated)
notificationsRouter.get("/", getNotificationsController);

// Get unread count
notificationsRouter.get("/unread-count", getUnreadCountController);

// Mark all as read
notificationsRouter.post("/mark-read", markAllAsReadController);

// Mark single as read
notificationsRouter.post("/:notificationId/read", markAsReadController);

// Delete single notification
notificationsRouter.delete("/:notificationId", deleteNotificationController);

// Clear all notifications
notificationsRouter.delete("/", clearAllNotificationsController);
