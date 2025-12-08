import { Request } from "express";
import { IUser } from "./user.type";
export interface RequestWithUserContext extends Request {
  user: Omit<IUser, "password">;
}
