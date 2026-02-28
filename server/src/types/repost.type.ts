import { Types } from "mongoose";

export interface RepostEntity {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    target_id: Types.ObjectId;
    target_type: "post" | "reel";
    created_at: Date;
}
