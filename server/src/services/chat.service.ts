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

        // Check for existing conversation first
        const existing = await chatRepo.findDirectConversation(
            userId,
            targetUserId
        );
        if (existing) {
            // If it was rejected, check if the original sender is trying again
            if (existing.request_status === "rejected") {
                if (existing.created_by.toString() === userId) {
                    throw new HttpError(
                        403,
                        false,
                        ErrorCodes.FORBIDDEN,
                        "Your message request was declined"
                    );
                }
                // The recipient is now initiating — auto-accept
                await chatRepo.updateRequestStatus(
                    existing._id.toString(),
                    "accepted"
                );
            }
            // Return the formatted version with participant details
            return chatRepo.getFormattedConversationById(existing._id.toString());
        }

        // No existing conversation — check if messaging is allowed
        const { allowed, isRequest } = await chatRepo.canMessageUser(
            userId,
            targetUserId
        );

        if (!allowed) {
            throw new HttpError(
                403,
                false,
                ErrorCodes.FORBIDDEN,
                "This user does not allow messages from you"
            );
        }

        // Create new conversation
        const conversation = await chatRepo.createConversation({
            type: "direct",
            participants: [userId, targetUserId],
            created_by: userId
        });

        // If it's a message request (not friends), set status to pending
        if (isRequest) {
            await chatRepo.updateRequestStatus(
                conversation._id.toString(),
                "pending"
            );
        }

        // Return the formatted version with participant details
        return chatRepo.getFormattedConversationById(conversation._id.toString());
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

    // Get a single formatted conversation by ID with permission check
    async getFormattedConversation(conversationId: string, userId: string) {
        // First verify user is a participant
        const raw = await chatRepo.getConversationById(conversationId);
        if (!raw) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Conversation not found"
            );
        }

        const isParticipant = raw.participants.some(
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

        return chatRepo.getFormattedConversationById(conversationId);
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
        const conversation = await this.getConversation(data.conversationId, data.senderId);

        // Check message request status
        if (conversation.request_status === "rejected") {
            throw new HttpError(
                403,
                false,
                ErrorCodes.FORBIDDEN,
                "This message request was declined"
            );
        }

        if (conversation.request_status === "pending") {
            // Only the sender (creator) can send messages while pending
            if (conversation.created_by.toString() !== data.senderId) {
                throw new HttpError(
                    403,
                    false,
                    ErrorCodes.FORBIDDEN,
                    "Accept the message request before replying"
                );
            }
        }

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
        return chatRepo.getMessages(conversationId, userId, page, limit);
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

    // Get reactions for a message
    async getMessageReactions(messageId: string) {
        return chatRepo.getMessageReactions(messageId);
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

    // Delete a conversation (soft delete for requesting user only)
    async deleteConversation(conversationId: string, userId: string) {
        const conv = await chatRepo.getConversationById(conversationId);
        if (!conv) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Conversation not found"
            );
        }

        // Check if user is a participant
        const isParticipant = conv.participants.some(
            (p) => p.toString() === userId
        );
        if (!isParticipant) {
            throw new HttpError(
                403,
                false,
                ErrorCodes.FORBIDDEN,
                "You are not a participant of this conversation"
            );
        }

        const deleted = await chatRepo.deleteConversation(conversationId, userId);
        if (!deleted) {
            throw new HttpError(
                500,
                false,
                ErrorCodes.SERVER_ERROR,
                "Failed to delete conversation"
            );
        }

        return true;
    }

    // Get pending message requests for a user
    async getMessageRequests(userId: string) {
        return chatRepo.getMessageRequests(userId);
    }

    // Get count of pending message requests
    async getRequestCount(userId: string) {
        return chatRepo.getRequestCount(userId);
    }

    // Accept a message request
    async acceptMessageRequest(conversationId: string, userId: string) {
        const conv = await chatRepo.getConversationById(conversationId);
        if (!conv) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Conversation not found"
            );
        }

        if (conv.request_status !== "pending") {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "This is not a pending message request"
            );
        }

        // Only the recipient (non-creator) can accept
        if (conv.created_by.toString() === userId) {
            throw new HttpError(
                403,
                false,
                ErrorCodes.FORBIDDEN,
                "You cannot accept your own message request"
            );
        }

        const isParticipant = conv.participants.some(
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

        return chatRepo.updateRequestStatus(conversationId, "accepted");
    }

    // Reject a message request
    async rejectMessageRequest(conversationId: string, userId: string) {
        const conv = await chatRepo.getConversationById(conversationId);
        if (!conv) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Conversation not found"
            );
        }

        if (conv.request_status !== "pending") {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "This is not a pending message request"
            );
        }

        // Only the recipient (non-creator) can reject
        if (conv.created_by.toString() === userId) {
            throw new HttpError(
                403,
                false,
                ErrorCodes.FORBIDDEN,
                "You cannot reject your own message request"
            );
        }

        const isParticipant = conv.participants.some(
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

        return chatRepo.updateRequestStatus(conversationId, "rejected");
    }
}

export const chatService = new ChatService();
