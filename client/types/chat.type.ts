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
        message_type: "text" | "image" | "video" | "mixed";
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

export interface ChatMessage {
    _id: string;
    message_id: string;
    conversation_id: string;
    content: string;
    message_type: "text" | "image" | "video" | "mixed";
    media_urls: string[];
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
