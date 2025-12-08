export interface IUser {
  email_address: string;
  full_name: string;
  username: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  is_disabled: boolean;
}

export interface IUserSafe {
  email_address: string;
  full_name: string;
  username: string;
  created_at: Date;
  updated_at: Date;
  is_disabled: boolean;
}
