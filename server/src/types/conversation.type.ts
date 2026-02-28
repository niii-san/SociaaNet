import mongoose from "mongoose";

export interface ConversationDeleteRecord {
    user_id: mongoose.Types.ObjectId;
    deleted_at: Date;
}

export type MessageRequestStatus = "none" | "pending" | "accepted" | "rejected";

export interface ConversationEntity {
    type: "direct" | "group";
    participants: mongoose.Types.ObjectId[];
    group_name?: string;
    group_avatar_key?: string;
    group_admin?: mongoose.Types.ObjectId;
    last_message?: mongoose.Types.ObjectId;
    last_message_at?: Date;
    created_by: mongoose.Types.ObjectId;
    deleted_by: ConversationDeleteRecord[];
    request_status: MessageRequestStatus;
    created_at?: Date;
    updated_at?: Date;
}

export interface MessageEntity {
    conversation_id: mongoose.Types.ObjectId;
    sender_id: mongoose.Types.ObjectId;
    content?: string;
    message_type: "text" | "image" | "video" | "mixed";
    media_urls?: string[];
    media_keys?: string[];
    reply_to?: mongoose.Types.ObjectId;
    reactions: MessageReaction[];
    read_by: MessageReadReceipt[];
    is_deleted: boolean;
    deleted_at?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface MessageReaction {
    user_id: mongoose.Types.ObjectId;
    emoji: string;
    created_at: Date;
}

export interface MessageReadReceipt {
    user_id: mongoose.Types.ObjectId;
    read_at: Date;
}
