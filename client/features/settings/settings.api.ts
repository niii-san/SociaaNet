import { api } from "@/lib/axios-instance";
import { UserSettings } from "@/types";

export const getUserSettings = async (): Promise<UserSettings> => {
    const res = await api.get("/users/me/settings");
    return res.data?.data as UserSettings;
};

export const updatePrivacySettings = async (
    data: Partial<UserSettings["privacy"]>
): Promise<void> => {
    await api.patch("/users/me/settings/privacy", data);
};

export const updateNotificationSettings = async (
    data: Partial<UserSettings["notifications"]>
): Promise<void> => {
    await api.patch("/users/me/settings/notifications", data);
};

export const updateAppearanceSettings = async (
    data: Partial<UserSettings["appearance"]>
): Promise<void> => {
    await api.patch("/users/me/settings/appearance", data);
};

export const updateFeedSettings = async (
    data: Partial<UserSettings["feed"]>
): Promise<void> => {
    await api.patch("/users/me/settings/feed", data);
};

export const updateSecuritySettings = async (
    data: Partial<UserSettings["security"]>
): Promise<void> => {
    await api.patch("/users/me/settings/security", data);
};

export const logoutSession = async (sessionIndex: number): Promise<void> => {
    await api.post("/auth/logout-session", { session_index: sessionIndex });
};

export const logoutAllSessions = async (): Promise<void> => {
    await api.post("/auth/logout-all-sessions");
};
