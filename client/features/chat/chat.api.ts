import { api } from "@/lib/axios-instance";
import { ChatConversation, ChatMessage, ChatFriend } from "@/types";

// Get all conversations
export async function getConversations(): Promise<ChatConversation[]> {
    const res = await api.get("/chat/conversations");
    return res.data.data;
}

// Create or get direct conversation
export async function getOrCreateDirectConversation(
    targetUserId: string
): Promise<any> {
    const res = await api.post("/chat/conversations/direct", {
        target_user_id: targetUserId
    });
    return res.data.data;
}

// Create group conversation
export async function createGroupConversation(
    participantIds: string[],
    groupName: string
): Promise<any> {
    const res = await api.post("/chat/conversations/group", {
        participant_ids: participantIds,
        group_name: groupName
    });
    return res.data.data;
}

// Get messages for a conversation
export async function getMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 50
): Promise<{ messages: ChatMessage[]; total: number; hasMore: boolean }> {
    const res = await api.get(
        `/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
    );
    return res.data.data;
}

// Send a message via REST (fallback)
export async function sendMessageREST(
    conversationId: string,
    data: {
        content?: string;
        message_type?: string;
        media_urls?: string[];
        media_keys?: string[];
        reply_to?: string;
    }
): Promise<ChatMessage> {
    const res = await api.post(
        `/chat/conversations/${conversationId}/messages`,
        data
    );
    return res.data.data;
}

// Mark conversation as read
export async function markAsRead(conversationId: string): Promise<void> {
    await api.post(`/chat/conversations/${conversationId}/read`);
}

// React to a message
export async function reactToMessage(
    messageId: string,
    emoji: string
): Promise<void> {
    await api.post(`/chat/messages/${messageId}/react`, { emoji });
}

// Remove reaction
export async function removeReaction(messageId: string): Promise<void> {
    await api.delete(`/chat/messages/${messageId}/react`);
}

// Delete a message
export async function deleteMessage(messageId: string): Promise<void> {
    await api.delete(`/chat/messages/${messageId}`);
}

// Get unread count
export async function getUnreadCount(): Promise<number> {
    const res = await api.get("/chat/unread-count");
    return res.data.data.count;
}

// Add participant to group
export async function addParticipant(
    conversationId: string,
    userId: string
): Promise<void> {
    await api.post(
        `/chat/conversations/${conversationId}/participants`,
        { user_id: userId }
    );
}

// Remove participant from group
export async function removeParticipant(
    conversationId: string,
    userId: string
): Promise<void> {
    await api.delete(
        `/chat/conversations/${conversationId}/participants/${userId}`
    );
}

// Update group name
export async function updateGroupName(
    conversationId: string,
    name: string
): Promise<void> {
    await api.patch(`/chat/conversations/${conversationId}/name`, {
        name
    });
}

// Get friends list
export async function getFriends(): Promise<ChatFriend[]> {
    const res = await api.get("/chat/friends");
    return res.data.data;
}

// Upload chat media (images/videos)
export async function uploadChatMedia(
    files: File[]
): Promise<{ urls: string[]; keys: string[] }> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const res = await api.post("/chat/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });

    return {
        urls: res.data.data.urls,
        keys: res.data.data.keys
    };
}
