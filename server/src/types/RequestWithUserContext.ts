import { Request } from "express";
import { IUser } from "../models";

export interface RequestWithUserContext extends Request {
    user: IUser;
}
