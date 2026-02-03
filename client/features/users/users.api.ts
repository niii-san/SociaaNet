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

export const updateUserProfile = async (
    data: Partial<IUserProfile>
): Promise<IUserProfile> => {
    const res = await api.patch("/users/me", data);
    return res.data?.data as IUserProfile;
};
