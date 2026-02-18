import { api } from "@/lib/axios-instance";
import { SearchUsersResponse } from "@/types";

export const searchUsers = async (query: string, page: number = 1): Promise<SearchUsersResponse> => {
    const response = await api.get(`/users/search`, {
        params: { query, page }
    });
    return response.data;
};
