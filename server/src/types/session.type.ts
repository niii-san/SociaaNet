import { Types } from "mongoose";

export interface ISession {
  session_id: string;
  user_id: Types.ObjectId;
  is_expired: boolean;
  expires_at: Date;
}
