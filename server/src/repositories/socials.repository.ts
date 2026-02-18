

import mongoose from "mongoose";
import { ErrorCodes } from "../constants/error-code";
import { User, UserSettings } from "../models";

interface ISocialsRepository {

}

class SocialsRepository implements ISocialsRepository {
}

export const socialsRepo = new SocialsRepository();
