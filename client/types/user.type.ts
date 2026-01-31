export interface IUser {
    _id: string;
    full_name: string;
    username: string;
    email_address?: string;
    avatar_url: string | null;
    created_at: string;
}
