import { Types } from "mongoose";

export interface ImageEntity {
    uploader_id: Types.ObjectId;
    chat_id: Types.ObjectId | null;
    image_key: string;
    image_id: string;
    visibility: "public" | "followers" | "chat_only";
    is_deleted: boolean;
    deleted_at: Date | null;
}
