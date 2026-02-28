import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { notificationService } from "../../services";

// GET /api/v1/notifications
export const getNotificationsController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 30;

        const result = await notificationService.getNotifications(
            req.user._id.toString(),
            page,
            limit
        );

        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "Notifications fetched", result)
            );
    }
);

// GET /api/v1/notifications/unread-count
export const getUnreadCountController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const count = await notificationService.getUnreadCount(
            req.user._id.toString()
        );

        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "Unread count", { count })
            );
    }
);

// POST /api/v1/notifications/mark-read
export const markAllAsReadController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        await notificationService.markAllAsRead(req.user._id.toString());

        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "All notifications marked as read", null)
            );
    }
);

// POST /api/v1/notifications/:notificationId/read
export const markAsReadController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { notificationId } = req.params;
        await notificationService.markAsRead(
            notificationId,
            req.user._id.toString()
        );

        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "Notification marked as read", null)
            );
    }
);

// DELETE /api/v1/notifications/:notificationId
export const deleteNotificationController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { notificationId } = req.params;
        await notificationService.deleteNotification(
            notificationId,
            req.user._id.toString()
        );

        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "Notification deleted", null)
            );
    }
);

// DELETE /api/v1/notifications
export const clearAllNotificationsController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        await notificationService.clearAll(req.user._id.toString());

        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "All notifications cleared", null)
            );
    }
);
