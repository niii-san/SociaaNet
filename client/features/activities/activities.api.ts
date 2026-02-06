import { api } from "@/lib/axios-instance";
import { Activity } from "@/types";

export const getUserActivities = async (): Promise<Activity[]> => {
    const res = await api.get("/users/me/activities");
    return res.data?.data as Activity[];
};
