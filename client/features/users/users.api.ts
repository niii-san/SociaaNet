import { api } from "@/lib/axios-instance";
import { IUser } from "@/types";

export const getCurrentUser = async (): Promise<IUser> => {
    const res = await api.get("/users/me");
    const userData = res.data?.data as IUser;
    return userData;
};
