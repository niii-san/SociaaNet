import { api } from "@/lib/axios-instance";
import { IUser, IUserProfile } from "@/types";

export const getCurrentUser = async (): Promise<IUser> => {
    const res = await api.get("/users/me");
    const userData = res.data?.data as IUser;
    return userData;
};

export const getUserProfileByUsername = async (
    username: string
): Promise<IUserProfile> => {
    const res = await api.get(`/users/profile/${username}`);
    return res.data?.data as IUserProfile;
};

export const updateUsername = async (username: string): Promise<{ username: string; _id: string }> => {
    const res = await api.patch("/users/me/username", { username });
    return res.data?.data;
};

export const updateBio = async (bio: string): Promise<void> => {
    await api.patch("/users/me/bio", { bio });
};

export const updateFullName = async (full_name: string): Promise<void> => {
    await api.patch("/users/me/fullname", { full_name });
};
