import { Request } from "express";
import { IUserSafe } from "./user.type";
export interface RequestWithUserContext extends Request {
  user: IUserSafe;
}
