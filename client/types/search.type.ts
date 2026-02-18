export interface SearchUser {
    user_id: string;
    full_name: string;
    username: string;
    is_private_account: boolean;
    avatar_url: string;
}

export interface SearchUsersResponse {
    status_code: number;
    success: boolean;
    message: string;
    data: SearchUser[];
    current_page: number;
    has_next_page: boolean;
}
