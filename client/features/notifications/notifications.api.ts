import { api } from "@/lib/axios-instance";
import { NotificationsResponse } from "@/types";

// Get notifications (paginated)
export async function getNotifications(
    page: number = 1,
    limit: number = 30
): Promise<NotificationsResponse> {
    const res = await api.get(
        `/notifications?page=${page}&limit=${limit}`
    );
    return res.data.data;
}

// Get unread notification count
export async function getUnreadNotificationCount(): Promise<number> {
    const res = await api.get("/notifications/unread-count");
    return res.data.data.count;
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(): Promise<void> {
    await api.post("/notifications/mark-read");
}

// Mark single notification as read
export async function markNotificationAsRead(
    notificationId: string
): Promise<void> {
    await api.post(`/notifications/${notificationId}/read`);
}

// Delete a notification
export async function deleteNotification(
    notificationId: string
): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
}

// Clear all notifications
export async function clearAllNotifications(): Promise<void> {
    await api.delete("/notifications");
}
