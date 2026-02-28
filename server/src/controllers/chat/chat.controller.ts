import { Response } from "express";
import { RequestWithUserContext } from "../../types";
import { asyncHandler, HttpSuccess } from "../../utils";
import { chatService } from "../../services";
import { User, UserSettings } from "../../models";

// GET /api/v1/chat/conversations
export const getConversationsController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const conversations = await chatService.getUserConversations(
            req.user._id.toString()
        );
        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Conversations fetched",
                    conversations
                )
            );
    }
);

// POST /api/v1/chat/conversations/direct
export const createDirectConversationController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { target_user_id } = req.body;
        const conversation =
            await chatService.getOrCreateDirectConversation(
                req.user._id.toString(),
                target_user_id
            );
        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "Conversation ready", conversation)
            );
    }
);

// POST /api/v1/chat/conversations/group
export const createGroupConversationController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { participant_ids, group_name } = req.body;
        const conversation = await chatService.createGroupConversation(
            req.user._id.toString(),
            participant_ids,
            group_name
        );
        return res
            .status(201)
            .json(
                new HttpSuccess(
                    201,
                    true,
                    "Group created",
                    conversation
                )
            );
    }
);

// GET /api/v1/chat/conversations/:conversationId/messages
export const getMessagesController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { conversationId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;

        const result = await chatService.getMessages(
            conversationId,
            req.user._id.toString(),
            page,
            limit
        );

        return res
            .status(200)
            .json(new HttpSuccess(200, true, "Messages fetched", result));
    }
);

// POST /api/v1/chat/conversations/:conversationId/messages
export const sendMessageController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { conversationId } = req.params;
        const { content, message_type, media_urls, media_keys, reply_to } =
            req.body;

        const message = await chatService.sendMessage({
            conversationId,
            senderId: req.user._id.toString(),
            content,
            messageType: message_type || "text",
            mediaUrls: media_urls,
            mediaKeys: media_keys,
            replyTo: reply_to
        });

        return res
            .status(201)
            .json(new HttpSuccess(201, true, "Message sent", message));
    }
);

// POST /api/v1/chat/messages/:messageId/react
export const reactToMessageController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { messageId } = req.params;
        const { emoji } = req.body;

        const message = await chatService.reactToMessage(
            messageId,
            req.user._id.toString(),
            emoji
        );

        return res
            .status(200)
            .json(new HttpSuccess(200, true, "Reaction added", message));
    }
);

// DELETE /api/v1/chat/messages/:messageId/react
export const removeReactionController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { messageId } = req.params;

        const message = await chatService.removeReaction(
            messageId,
            req.user._id.toString()
        );

        return res
            .status(200)
            .json(new HttpSuccess(200, true, "Reaction removed", message));
    }
);

// POST /api/v1/chat/conversations/:conversationId/read
export const markAsReadController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { conversationId } = req.params;

        await chatService.markAsRead(
            conversationId,
            req.user._id.toString()
        );

        return res
            .status(200)
            .json(new HttpSuccess(200, true, "Marked as read", null));
    }
);

// DELETE /api/v1/chat/messages/:messageId
export const deleteMessageController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { messageId } = req.params;

        await chatService.deleteMessage(
            messageId,
            req.user._id.toString()
        );

        return res
            .status(200)
            .json(new HttpSuccess(200, true, "Message deleted", null));
    }
);

// GET /api/v1/chat/unread-count
export const getUnreadCountController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const count = await chatService.getUnreadCount(
            req.user._id.toString()
        );

        return res
            .status(200)
            .json(new HttpSuccess(200, true, "Unread count", { count }));
    }
);

// POST /api/v1/chat/conversations/:conversationId/participants
export const addParticipantController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { conversationId } = req.params;
        const { user_id } = req.body;

        const conversation = await chatService.addParticipant(
            conversationId,
            req.user._id.toString(),
            user_id
        );

        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "Participant added", conversation)
            );
    }
);

// DELETE /api/v1/chat/conversations/:conversationId/participants/:userId
export const removeParticipantController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { conversationId, userId } = req.params;

        const conversation = await chatService.removeParticipant(
            conversationId,
            req.user._id.toString(),
            userId
        );

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Participant removed",
                    conversation
                )
            );
    }
);

// PATCH /api/v1/chat/conversations/:conversationId/name
export const updateGroupNameController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { conversationId } = req.params;
        const { name } = req.body;

        const conversation = await chatService.updateGroupName(
            conversationId,
            req.user._id.toString(),
            name
        );

        return res
            .status(200)
            .json(
                new HttpSuccess(
                    200,
                    true,
                    "Group name updated",
                    conversation
                )
            );
    }
);

// GET /api/v1/chat/friends
export const getFriendsController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const friends = await chatService.getFriends(
            req.user._id.toString()
        );

        return res
            .status(200)
            .json(new HttpSuccess(200, true, "Friends fetched", friends));
    }
);

// POST /api/v1/chat/users/activity - Get activity status for given user IDs
export const getUsersActivityController = asyncHandler(
    async (req: RequestWithUserContext, res: Response) => {
        const { user_ids } = req.body;
        if (!user_ids || !Array.isArray(user_ids)) {
            return res
                .status(400)
                .json(new HttpSuccess(400, false, "user_ids required", null));
        }

        // Fetch users and their settings
        const [users, settings] = await Promise.all([
            User.find(
                { _id: { $in: user_ids } },
                { _id: 1, last_active_at: 1, is_online: 1 }
            ).lean(),
            UserSettings.find(
                { user_id: { $in: user_ids } },
                { user_id: 1, "privacy.show_activity_status": 1 }
            ).lean()
        ]);

        const settingsMap = new Map<string, boolean>();
        settings.forEach((s: any) => {
            settingsMap.set(
                s.user_id.toString(),
                s.privacy?.show_activity_status !== false
            );
        });

        const activity: Record<
            string,
            {
                is_online: boolean;
                last_active_at: string | null;
                show_activity_status: boolean;
            }
        > = {};

        users.forEach((u: any) => {
            const uid = u._id.toString();
            const showActivity = settingsMap.get(uid) !== false;
            activity[uid] = {
                is_online: showActivity ? !!u.is_online : false,
                last_active_at: showActivity
                    ? u.last_active_at?.toISOString() || null
                    : null,
                show_activity_status: showActivity
            };
        });

        return res
            .status(200)
            .json(
                new HttpSuccess(200, true, "Activity status fetched", activity)
            );
    }
);
