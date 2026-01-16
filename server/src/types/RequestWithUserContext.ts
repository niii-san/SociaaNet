import { Request } from "express";
import { ISafeUser } from "./user.type";
export interface RequestWithUserContext extends Request {
    user: ISafeUser;
}
