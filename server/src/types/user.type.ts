export interface UserEntity {
    email_address: string;
    avatar_key: string | null;
    full_name: string;
    username: string;
    bio: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    role: "user" | "moderator" | "system_admin";
    is_disabled: boolean;
}
