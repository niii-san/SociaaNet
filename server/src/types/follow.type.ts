import { Types } from "mongoose";

export interface FollowEntity {
    _id: Types.ObjectId;
    follower: Types.ObjectId;
    following: Types.ObjectId;
    status: "pending" | "accepted" | "rejected";
    is_removed: boolean;
    removed_at: Date | null;
    removed_by: Types.ObjectId | null;
    accepted_at: Date | null;
    rejected_at: Date | null;
    followed_at: Date;
    updated_at: Date;
}
