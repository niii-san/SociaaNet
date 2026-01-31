export interface UserEntity {
    email_address: string;
    avatar_key: string | null;
    full_name: string;
    username: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    is_disabled: boolean;
}
