import { chatRepo } from "../repositories";
import { HttpError } from "../utils";
import { ErrorCodes } from "../constants/error-code";

class ChatService {
    // Start or get existing direct conversation
    async getOrCreateDirectConversation(
        userId: string,
        targetUserId: string
    ) {
        if (userId === targetUserId) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Cannot start a conversation with yourself"
            );
        }

        // Check if users are friends (mutual followers)
        const friends = await chatRepo.areFriends(userId, targetUserId);
        if (!friends) {
            throw new HttpError(
                403,
                false,
                ErrorCodes.FORBIDDEN,
                "You can only message users who follow you back"
            );
        }

        // Check for existing conversation
        const existing = await chatRepo.findDirectConversation(
            userId,
            targetUserId
        );
        if (existing) return existing;

        // Create new
        return chatRepo.createConversation({
            type: "direct",
            participants: [userId, targetUserId],
            created_by: userId
        });
    }

    // Create group conversation
    async createGroupConversation(
        userId: string,
        participantIds: string[],
        groupName: string
    ) {
        if (!groupName || groupName.trim().length === 0) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Group name is required"
            );
        }

        // Include creator in participants
        const allParticipants = [
            ...new Set([userId, ...participantIds])
        ];

        if (allParticipants.length < 2) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Group must have at least 2 members"
            );
        }

        if (allParticipants.length > 20) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Group can have at most 20 members"
            );
        }

        // Check each participant is a friend
        for (const pid of participantIds) {
            if (pid === userId) continue;
            const areFriends = await chatRepo.areFriends(userId, pid);
            if (!areFriends) {
                throw new HttpError(
                    403,
                    false,
                    ErrorCodes.FORBIDDEN,
                    "All group members must be your friends"
                );
            }
        }

        return chatRepo.createConversation({
            type: "group",
            participants: allParticipants,
            created_by: userId,
            group_name: groupName.trim()
        });
    }

    // Get user's conversations
    async getUserConversations(userId: string) {
        return chatRepo.getUserConversations(userId);
    }

    // Get conversation by ID with permission check
    async getConversation(conversationId: string, userId: string) {
        const conversation =
            await chatRepo.getConversationById(conversationId);
        if (!conversation) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Conversation not found"
            );
        }

        const isParticipant = conversation.participants.some(
            (p) => p.toString() === userId
        );
        if (!isParticipant) {
            throw new HttpError(
                403,
                false,
                ErrorCodes.FORBIDDEN,
                "You are not part of this conversation"
            );
        }

        return conversation;
    }

    // Send message
    async sendMessage(data: {
        conversationId: string;
        senderId: string;
        content?: string;
        messageType: "text" | "image" | "video" | "mixed";
        mediaUrls?: string[];
        mediaKeys?: string[];
        replyTo?: string;
    }) {
        // Verify sender is in conversation
        await this.getConversation(data.conversationId, data.senderId);

        if (
            data.messageType === "text" &&
            (!data.content || data.content.trim().length === 0)
        ) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Message content is required"
            );
        }

        return chatRepo.createMessage({
            conversation_id: data.conversationId,
            sender_id: data.senderId,
            content: data.content?.trim(),
            message_type: data.messageType,
            media_urls: data.mediaUrls,
            media_keys: data.mediaKeys,
            reply_to: data.replyTo
        });
    }

    // Get messages
    async getMessages(
        conversationId: string,
        userId: string,
        page: number = 1,
        limit: number = 50
    ) {
        await this.getConversation(conversationId, userId);
        return chatRepo.getMessages(conversationId, page, limit);
    }

    // React to message
    async reactToMessage(
        messageId: string,
        userId: string,
        emoji: string
    ) {
        return chatRepo.addReaction(messageId, userId, emoji);
    }

    // Remove reaction
    async removeReaction(messageId: string, userId: string) {
        return chatRepo.removeReaction(messageId, userId);
    }

    // Mark messages as read
    async markAsRead(conversationId: string, userId: string) {
        await this.getConversation(conversationId, userId);
        return chatRepo.markAsRead(conversationId, userId);
    }

    // Delete message
    async deleteMessage(messageId: string, userId: string) {
        const deleted = await chatRepo.deleteMessage(messageId, userId);
        if (!deleted) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Message not found or you don't have permission"
            );
        }
        return deleted;
    }

    // Get unread count
    async getUnreadCount(userId: string) {
        return chatRepo.getUnreadCount(userId);
    }

    // Add participant to group
    async addParticipant(
        conversationId: string,
        userId: string,
        targetUserId: string
    ) {
        const conv =
            await chatRepo.getConversationById(conversationId);
        if (!conv || conv.type !== "group") {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Group not found"
            );
        }

        if (conv.group_admin?.toString() !== userId) {
            throw new HttpError(
                403,
                false,
                ErrorCodes.FORBIDDEN,
                "Only group admin can add members"
            );
        }

        const count = await chatRepo.getParticipantCount(conversationId);
        if (count >= 20) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Group can have at most 20 members"
            );
        }

        // Check friendship
        const friends = await chatRepo.areFriends(userId, targetUserId);
        if (!friends) {
            throw new HttpError(
                403,
                false,
                ErrorCodes.FORBIDDEN,
                "Can only add friends to the group"
            );
        }

        return chatRepo.addParticipant(conversationId, targetUserId);
    }

    // Remove participant from group
    async removeParticipant(
        conversationId: string,
        userId: string,
        targetUserId: string
    ) {
        const conv =
            await chatRepo.getConversationById(conversationId);
        if (!conv || conv.type !== "group") {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Group not found"
            );
        }

        // Admin can remove anyone, or user can remove themselves
        if (
            conv.group_admin?.toString() !== userId &&
            userId !== targetUserId
        ) {
            throw new HttpError(
                403,
                false,
                ErrorCodes.FORBIDDEN,
                "Only group admin can remove members"
            );
        }

        return chatRepo.removeParticipant(conversationId, targetUserId);
    }

    // Update group name
    async updateGroupName(
        conversationId: string,
        userId: string,
        name: string
    ) {
        const conv =
            await chatRepo.getConversationById(conversationId);
        if (!conv || conv.type !== "group") {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Group not found"
            );
        }

        if (conv.group_admin?.toString() !== userId) {
            throw new HttpError(
                403,
                false,
                ErrorCodes.FORBIDDEN,
                "Only group admin can update group name"
            );
        }

        return chatRepo.updateGroupName(conversationId, name.trim());
    }

    // Get friends list for starting new chats
    async getFriends(userId: string) {
        return chatRepo.getFriends(userId);
    }
}

export const chatService = new ChatService();
