import { Request } from "express";
import { UserDocument } from "../models";

export interface RequestWithUserContext extends Request {
    user: UserDocument;
}
