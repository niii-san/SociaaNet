import { Types } from "mongoose";

Types;
export interface WatchHistoryEntity {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    target_id: Types.ObjectId;
    target_type: "post" | "reel";
    watch_duration: number;
    completed: boolean;
    created_at: Date;
}
