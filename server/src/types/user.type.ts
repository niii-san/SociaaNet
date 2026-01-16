export interface UserSchema {
  email_address: string;
  full_name: string;
  username: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  is_disabled: boolean;
}

export type ISafeUser = Omit<UserSchema,"password" | "is_disabled">
