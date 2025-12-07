import { Types } from "mongoose";

export interface ISession {
  session_id: string;
  user_id: Types.ObjectId;
  expires_at: Date;
}
