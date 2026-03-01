export type MessageRequestStatus = "none" | "pending" | "accepted" | "rejected";

export interface ChatParticipant {
    user_id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
}

export interface ChatConversation {
    conversation_id: string;
    _id: string;
    type: "direct" | "group";
    group_name?: string;
    group_avatar_key?: string;
    group_admin?: string;
    participants: ChatParticipant[];
    last_message: {
        _id: string;
        content: string;
        message_type: "text" | "image" | "video" | "mixed" | "shared_post" | "shared_reel";
        is_deleted: boolean;
        created_at: string;
        sender: {
            user_id: string;
            username: string;
            full_name: string;
        };
    } | null;
    last_message_at: string;
    created_at: string;
    unread_count: number;
    request_status: MessageRequestStatus;
    created_by?: string;
}

export interface MessageReaction {
    user_id: string;
    emoji: string;
    created_at: string;
}

export interface MessageReadReceipt {
    user_id: string;
    read_at: string;
}

export interface SharedPostData {
    post_id: string;
    caption: string;
    media_urls: string[];
    likes_count: number;
    comments_count: number;
    is_deleted: boolean;
    created_at: string;
    author: {
        user_id: string;
        username: string;
        full_name: string;
        avatar_url: string | null;
    };
}

export interface SharedReelData {
    reel_id: string;
    caption: string;
    thumbnail_url: string | null;
    video_url: string | null;
    likes_count: number;
    comments_count: number;
    views_count: number;
    is_deleted: boolean;
    created_at: string;
    author: {
        user_id: string;
        username: string;
        full_name: string;
        avatar_url: string | null;
    };
}

export interface ChatMessage {
    _id: string;
    message_id: string;
    conversation_id: string;
    content: string;
    message_type: "text" | "image" | "video" | "mixed" | "shared_post" | "shared_reel";
    media_urls: string[];
    shared_post: SharedPostData | null;
    shared_reel: SharedReelData | null;
    is_deleted: boolean;
    reactions: MessageReaction[];
    read_by: MessageReadReceipt[];
    created_at: string;
    sender: ChatParticipant;
    reply_to: {
        message_id: string;
        content: string;
        message_type: string;
        is_deleted: boolean;
        sender: {
            user_id: string;
            username: string;
            full_name: string;
        };
    } | null;
    tempId?: string;
}

export interface ChatFriend {
    user_id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
    avatar_key?: string;
}
