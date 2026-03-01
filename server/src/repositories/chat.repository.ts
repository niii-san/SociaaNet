import mongoose from "mongoose";
import {
    Conversation,
    ConversationDocument,
    Message,
    MessageDocument,
    Follow,
    UserSettings
} from "../models";
import { convertImageKeyToImageUrl, convertVideoKeyToVideoUrl, convertThumbnailKeytoThumbnailUrl } from "../utils";
import { MessageRequestStatus } from "../types/conversation.type";

class ChatRepository {
    // Check if two users are mutual followers (friends)
    async areFriends(
        userId1: string,
        userId2: string
    ): Promise<boolean> {
        const [follow1, follow2] = await Promise.all([
            Follow.findOne({
                follower: new mongoose.Types.ObjectId(userId1),
                following: new mongoose.Types.ObjectId(userId2),
                status: "accepted",
                is_removed: false
            }),
            Follow.findOne({
                follower: new mongoose.Types.ObjectId(userId2),
                following: new mongoose.Types.ObjectId(userId1),
                status: "accepted",
                is_removed: false
            })
        ]);
        return !!(follow1 && follow2);
    }

    // Find existing direct conversation between two users
    async findDirectConversation(
        userId1: string,
        userId2: string
    ): Promise<ConversationDocument | null> {
        return Conversation.findOne({
            type: "direct",
            participants: {
                $all: [
                    new mongoose.Types.ObjectId(userId1),
                    new mongoose.Types.ObjectId(userId2)
                ],
                $size: 2
            }
        });
    }

    // Create a new conversation
    async createConversation(data: {
        type: "direct" | "group";
        participants: string[];
        created_by: string;
        group_name?: string;
    }): Promise<ConversationDocument> {
        const conversation = new Conversation({
            type: data.type,
            participants: data.participants.map(
                (id) => new mongoose.Types.ObjectId(id)
            ),
            created_by: new mongoose.Types.ObjectId(data.created_by),
            group_name: data.group_name || null,
            group_admin:
                data.type === "group"
                    ? new mongoose.Types.ObjectId(data.created_by)
                    : null,
            last_message_at: new Date()
        });
        return conversation.save();
    }

    // Get conversation by ID
    async getConversationById(
        conversationId: string
    ): Promise<ConversationDocument | null> {
        return Conversation.findById(conversationId);
    }

    // Get user's conversations with last message and participant info
    async getUserConversations(userId: string): Promise<any[]> {
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const conversations = await Conversation.aggregate([
            {
                $match: {
                    participants: userObjectId,
                    // Exclude rejected requests and pending requests where user is the recipient
                    $or: [
                        { request_status: { $in: ["none", "accepted"] } },
                        { request_status: "pending", created_by: userObjectId },
                        { type: "group" }
                    ]
                }
            },
            // Filter out conversations that user has deleted and no new messages since
            {
                $addFields: {
                    _userDeleteRecord: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: { $ifNull: ["$deleted_by", []] },
                                    as: "d",
                                    cond: { $eq: ["$$d.user_id", userObjectId] }
                                }
                            },
                            0
                        ]
                    }
                }
            },
            {
                $match: {
                    $or: [
                        // User hasn't deleted this conversation
                        { _userDeleteRecord: null },
                        // User deleted but new messages arrived after deletion
                        {
                            $expr: {
                                $gt: ["$last_message_at", "$_userDeleteRecord.deleted_at"]
                            }
                        }
                    ]
                }
            },
            { $sort: { last_message_at: -1 } },
            // Count all unread messages in each conversation
            {
                $lookup: {
                    from: "messages",
                    let: {
                        convId: "$_id",
                        deletedAt: "$_userDeleteRecord.deleted_at"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$conversation_id", "$$convId"] },
                                        { $ne: ["$sender_id", userObjectId] },
                                        {
                                            $not: {
                                                $in: [
                                                    userObjectId,
                                                    {
                                                        $map: {
                                                            input: {
                                                                $ifNull: ["$read_by", []]
                                                            },
                                                            as: "r",
                                                            in: "$$r.user_id"
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        // Only count messages after user's deletion time
                                        {
                                            $or: [
                                                { $eq: [{ $type: "$$deletedAt" }, "missing"] },
                                                { $gt: ["$created_at", "$$deletedAt"] }
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        { $count: "count" }
                    ],
                    as: "unread_messages"
                }
            },
            // Lookup last message
            {
                $lookup: {
                    from: "messages",
                    localField: "last_message",
                    foreignField: "_id",
                    as: "last_message_data"
                }
            },
            { $unwind: { path: "$last_message_data", preserveNullAndEmptyArrays: true } },
            // Lookup participants
            {
                $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "participants_data"
                }
            },
            // Lookup last message sender
            {
                $lookup: {
                    from: "users",
                    localField: "last_message_data.sender_id",
                    foreignField: "_id",
                    as: "last_message_sender"
                }
            },
            {
                $unwind: {
                    path: "$last_message_sender",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    type: 1,
                    group_name: 1,
                    group_avatar_key: 1,
                    group_admin: 1,
                    last_message_at: 1,
                    created_at: 1,
                    request_status: 1,
                    created_by: 1,
                    participants: {
                        $map: {
                            input: "$participants_data",
                            as: "p",
                            in: {
                                user_id: "$$p._id",
                                username: "$$p.username",
                                full_name: "$$p.full_name",
                                avatar_key: "$$p.avatar_key"
                            }
                        }
                    },
                    last_message: {
                        $cond: {
                            if: "$last_message_data",
                            then: {
                                _id: "$last_message_data._id",
                                content: "$last_message_data.content",
                                message_type: "$last_message_data.message_type",
                                is_deleted: "$last_message_data.is_deleted",
                                created_at: "$last_message_data.created_at",
                                sender: {
                                    user_id: "$last_message_sender._id",
                                    username: "$last_message_sender.username",
                                    full_name: "$last_message_sender.full_name"
                                }
                            },
                            else: null
                        }
                    },
                    unread_count: {
                        $ifNull: [
                            { $arrayElemAt: ["$unread_messages.count", 0] },
                            0
                        ]
                    }
                }
            }
        ]);

        // Convert avatar keys to URLs
        return conversations.map((conv) => ({
            ...conv,
            conversation_id: conv._id,
            participants: conv.participants.map((p: any) => ({
                ...p,
                avatar_url: p.avatar_key
                    ? convertImageKeyToImageUrl(p.avatar_key)
                    : null
            }))
        }));
    }

    // Get a single conversation formatted the same way as getUserConversations
    async getFormattedConversationById(conversationId: string): Promise<any | null> {
        const convObjectId = new mongoose.Types.ObjectId(conversationId);

        const results = await Conversation.aggregate([
            { $match: { _id: convObjectId } },
            // Lookup participants
            {
                $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "participants_data"
                }
            },
            // Lookup last message
            {
                $lookup: {
                    from: "messages",
                    localField: "last_message",
                    foreignField: "_id",
                    as: "last_message_data"
                }
            },
            { $unwind: { path: "$last_message_data", preserveNullAndEmptyArrays: true } },
            // Lookup last message sender
            {
                $lookup: {
                    from: "users",
                    localField: "last_message_data.sender_id",
                    foreignField: "_id",
                    as: "last_message_sender"
                }
            },
            {
                $unwind: {
                    path: "$last_message_sender",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    type: 1,
                    group_name: 1,
                    group_avatar_key: 1,
                    group_admin: 1,
                    last_message_at: 1,
                    created_at: 1,
                    request_status: 1,
                    created_by: 1,
                    participants: {
                        $map: {
                            input: "$participants_data",
                            as: "p",
                            in: {
                                user_id: "$$p._id",
                                username: "$$p.username",
                                full_name: "$$p.full_name",
                                avatar_key: "$$p.avatar_key"
                            }
                        }
                    },
                    last_message: {
                        $cond: {
                            if: "$last_message_data",
                            then: {
                                _id: "$last_message_data._id",
                                content: "$last_message_data.content",
                                message_type: "$last_message_data.message_type",
                                is_deleted: "$last_message_data.is_deleted",
                                created_at: "$last_message_data.created_at",
                                sender: {
                                    user_id: "$last_message_sender._id",
                                    username: "$last_message_sender.username",
                                    full_name: "$last_message_sender.full_name"
                                }
                            },
                            else: null
                        }
                    },
                    unread_count: { $literal: 0 }
                }
            }
        ]);

        if (results.length === 0) return null;

        const conv = results[0];
        return {
            ...conv,
            conversation_id: conv._id,
            participants: conv.participants.map((p: any) => ({
                ...p,
                avatar_url: p.avatar_key
                    ? convertImageKeyToImageUrl(p.avatar_key)
                    : null
            }))
        };
    }

    // Create a message
    async createMessage(data: {
        conversation_id: string;
        sender_id: string;
        content?: string;
        message_type: "text" | "image" | "video" | "mixed" | "shared_post" | "shared_reel";
        media_keys?: string[];
        shared_post_id?: string;
        shared_reel_id?: string;
        reply_to?: string;
    }): Promise<MessageDocument> {
        const message = new Message({
            conversation_id: new mongoose.Types.ObjectId(data.conversation_id),
            sender_id: new mongoose.Types.ObjectId(data.sender_id),
            content: data.content || "",
            message_type: data.message_type,
            media_urls: [], // deprecated — kept empty for backward compat
            media_keys: data.media_keys || [],
            shared_post_id: data.shared_post_id
                ? new mongoose.Types.ObjectId(data.shared_post_id)
                : null,
            shared_reel_id: data.shared_reel_id
                ? new mongoose.Types.ObjectId(data.shared_reel_id)
                : null,
            reply_to: data.reply_to
                ? new mongoose.Types.ObjectId(data.reply_to)
                : null,
            read_by: [
                {
                    user_id: new mongoose.Types.ObjectId(data.sender_id),
                    read_at: new Date()
                }
            ]
        });

        const saved = await message.save();

        // Update conversation's last message
        await Conversation.findByIdAndUpdate(data.conversation_id, {
            last_message: saved._id,
            last_message_at: new Date()
        });

        return saved;
    }

    // Get messages for a conversation with pagination
    async getMessages(
        conversationId: string,
        userId: string,
        page: number = 1,
        limit: number = 50
    ): Promise<{ messages: any[]; total: number; hasMore: boolean }> {
        const skip = (page - 1) * limit;
        const convOid = new mongoose.Types.ObjectId(conversationId);

        // Check if user has a deletion record for this conversation
        const deletionTime = await this.getUserDeletionTime(conversationId, userId);

        // Build match filter — only show messages after user's deletion time
        const matchFilter: any = { conversation_id: convOid };
        if (deletionTime) {
            matchFilter.created_at = { $gt: deletionTime };
        }

        const [messages, total] = await Promise.all([
            Message.aggregate([
                {
                    $match: matchFilter
                },
                { $sort: { created_at: -1 } },
                { $skip: skip },
                { $limit: limit },
                // Lookup sender
                {
                    $lookup: {
                        from: "users",
                        localField: "sender_id",
                        foreignField: "_id",
                        as: "sender_data"
                    }
                },
                { $unwind: "$sender_data" },
                // Lookup reply_to message
                {
                    $lookup: {
                        from: "messages",
                        localField: "reply_to",
                        foreignField: "_id",
                        as: "reply_to_data"
                    }
                },
                {
                    $unwind: {
                        path: "$reply_to_data",
                        preserveNullAndEmptyArrays: true
                    }
                },
                // Lookup reply_to sender
                {
                    $lookup: {
                        from: "users",
                        localField: "reply_to_data.sender_id",
                        foreignField: "_id",
                        as: "reply_to_sender"
                    }
                },
                {
                    $unwind: {
                        path: "$reply_to_sender",
                        preserveNullAndEmptyArrays: true
                    }
                },
                // Lookup shared post
                {
                    $lookup: {
                        from: "posts",
                        localField: "shared_post_id",
                        foreignField: "_id",
                        as: "shared_post_data"
                    }
                },
                {
                    $unwind: {
                        path: "$shared_post_data",
                        preserveNullAndEmptyArrays: true
                    }
                },
                // Lookup shared post author
                {
                    $lookup: {
                        from: "users",
                        localField: "shared_post_data.author",
                        foreignField: "_id",
                        as: "shared_post_author"
                    }
                },
                {
                    $unwind: {
                        path: "$shared_post_author",
                        preserveNullAndEmptyArrays: true
                    }
                },
                // Lookup shared reel
                {
                    $lookup: {
                        from: "reels",
                        localField: "shared_reel_id",
                        foreignField: "_id",
                        as: "shared_reel_data"
                    }
                },
                {
                    $unwind: {
                        path: "$shared_reel_data",
                        preserveNullAndEmptyArrays: true
                    }
                },
                // Lookup shared reel author
                {
                    $lookup: {
                        from: "users",
                        localField: "shared_reel_data.author",
                        foreignField: "_id",
                        as: "shared_reel_author"
                    }
                },
                {
                    $unwind: {
                        path: "$shared_reel_author",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        message_id: "$_id",
                        conversation_id: 1,
                        content: 1,
                        message_type: 1,
                        media_keys: 1,
                        media_urls: 1, // backward compat for old messages
                        is_deleted: 1,
                        reactions: 1,
                        read_by: 1,
                        created_at: 1,
                        sender: {
                            user_id: "$sender_data._id",
                            username: "$sender_data.username",
                            full_name: "$sender_data.full_name",
                            avatar_key: "$sender_data.avatar_key"
                        },
                        shared_post: {
                            $cond: {
                                if: "$shared_post_data",
                                then: {
                                    post_id: "$shared_post_data._id",
                                    caption: "$shared_post_data.caption",
                                    media_keys: "$shared_post_data.media_keys",
                                    likes_count: "$shared_post_data.likes_count",
                                    comments_count: "$shared_post_data.comments_count",
                                    is_deleted: "$shared_post_data.is_deleted",
                                    created_at: "$shared_post_data.created_at",
                                    author: {
                                        user_id: "$shared_post_author._id",
                                        username: "$shared_post_author.username",
                                        full_name: "$shared_post_author.full_name",
                                        avatar_key: "$shared_post_author.avatar_key"
                                    }
                                },
                                else: null
                            }
                        },
                        shared_reel: {
                            $cond: {
                                if: "$shared_reel_data",
                                then: {
                                    reel_id: "$shared_reel_data._id",
                                    caption: "$shared_reel_data.caption",
                                    thumbnail_key: "$shared_reel_data.thumbnail_key",
                                    media_key: "$shared_reel_data.media_key",
                                    likes_count: "$shared_reel_data.likes_count",
                                    comments_count: "$shared_reel_data.comments_count",
                                    views_count: "$shared_reel_data.views_count",
                                    is_deleted: "$shared_reel_data.is_deleted",
                                    created_at: "$shared_reel_data.created_at",
                                    author: {
                                        user_id: "$shared_reel_author._id",
                                        username: "$shared_reel_author.username",
                                        full_name: "$shared_reel_author.full_name",
                                        avatar_key: "$shared_reel_author.avatar_key"
                                    }
                                },
                                else: null
                            }
                        },
                        reply_to: {
                            $cond: {
                                if: "$reply_to_data",
                                then: {
                                    message_id: "$reply_to_data._id",
                                    content: "$reply_to_data.content",
                                    message_type:
                                        "$reply_to_data.message_type",
                                    is_deleted: "$reply_to_data.is_deleted",
                                    sender: {
                                        user_id: "$reply_to_sender._id",
                                        username:
                                            "$reply_to_sender.username",
                                        full_name:
                                            "$reply_to_sender.full_name"
                                    }
                                },
                                else: null
                            }
                        }
                    }
                }
            ]),
            Message.countDocuments(matchFilter)
        ]);

        // Convert sender avatar keys and media keys to URLs
        const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv"];
        const processedMessages = messages.map((msg) => {
            const { media_keys, sender_data, reply_to_data, reply_to_sender, ...rest } = msg;

            // Process shared post media keys → URLs
            let sharedPost = msg.shared_post;
            if (sharedPost && !sharedPost.is_deleted) {
                sharedPost = {
                    ...sharedPost,
                    media_urls: (sharedPost.media_keys || []).map((key: string) =>
                        convertImageKeyToImageUrl(key)
                    ),
                    author: {
                        ...sharedPost.author,
                        avatar_url: sharedPost.author?.avatar_key
                            ? convertImageKeyToImageUrl(sharedPost.author.avatar_key)
                            : null
                    }
                };
            }

            // Process shared reel keys → URLs
            let sharedReel = msg.shared_reel;
            if (sharedReel && !sharedReel.is_deleted) {
                sharedReel = {
                    ...sharedReel,
                    thumbnail_url: sharedReel.thumbnail_key
                        ? convertThumbnailKeytoThumbnailUrl(sharedReel.thumbnail_key)
                        : null,
                    video_url: sharedReel.media_key
                        ? convertVideoKeyToVideoUrl(sharedReel.media_key)
                        : null,
                    author: {
                        ...sharedReel.author,
                        avatar_url: sharedReel.author?.avatar_key
                            ? convertImageKeyToImageUrl(sharedReel.author.avatar_key)
                            : null
                    }
                };
            }

            return {
                ...rest,
                shared_post: sharedPost,
                shared_reel: sharedReel,
                media_urls:
                    media_keys && media_keys.length > 0
                        ? media_keys.map((key: string) => {
                              const isVideo = videoExtensions.some((ext) =>
                                  key.toLowerCase().endsWith(ext)
                              );
                              return isVideo
                                  ? convertVideoKeyToVideoUrl(key)
                                  : convertImageKeyToImageUrl(key);
                          })
                        : msg.media_urls || [], // fallback for old messages with hardcoded URLs
                sender: {
                    ...msg.sender,
                    avatar_url: msg.sender.avatar_key
                        ? convertImageKeyToImageUrl(msg.sender.avatar_key)
                        : null
                }
            };
        });

        return {
            messages: processedMessages.reverse(), // return chronological order
            total,
            hasMore: skip + limit < total
        };
    }

    // Add reaction to message
    async addReaction(
        messageId: string,
        userId: string,
        emoji: string
    ): Promise<MessageDocument | null> {
        // Remove existing reaction from same user first, then add new one
        await Message.updateOne(
            { _id: new mongoose.Types.ObjectId(messageId) },
            {
                $pull: {
                    reactions: {
                        user_id: new mongoose.Types.ObjectId(userId)
                    }
                }
            }
        );

        return Message.findByIdAndUpdate(
            messageId,
            {
                $push: {
                    reactions: {
                        user_id: new mongoose.Types.ObjectId(userId),
                        emoji,
                        created_at: new Date()
                    }
                }
            },
            { new: true }
        );
    }

    // Get reactions for a message with populated user data
    async getMessageReactions(messageId: string) {
        const result = await Message.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(messageId) } },
            { $unwind: "$reactions" },
            {
                $lookup: {
                    from: "users",
                    localField: "reactions.user_id",
                    foreignField: "_id",
                    as: "reactor"
                }
            },
            { $unwind: "$reactor" },
            {
                $project: {
                    _id: 0,
                    user_id: "$reactor._id",
                    username: "$reactor.username",
                    full_name: "$reactor.full_name",
                    avatar_key: "$reactor.avatar_key",
                    emoji: "$reactions.emoji",
                    created_at: "$reactions.created_at"
                }
            },
            { $sort: { created_at: -1 } }
        ]);

        return result.map((r) => ({
            user_id: r.user_id,
            username: r.username,
            full_name: r.full_name,
            avatar_url: r.avatar_key
                ? convertImageKeyToImageUrl(r.avatar_key)
                : null,
            emoji: r.emoji,
            created_at: r.created_at
        }));
    }

    // Remove reaction from message
    async removeReaction(
        messageId: string,
        userId: string
    ): Promise<MessageDocument | null> {
        return Message.findByIdAndUpdate(
            messageId,
            {
                $pull: {
                    reactions: {
                        user_id: new mongoose.Types.ObjectId(userId)
                    }
                }
            },
            { new: true }
        );
    }

    // Mark messages as read
    async markAsRead(
        conversationId: string,
        userId: string
    ): Promise<void> {
        await Message.updateMany(
            {
                conversation_id: new mongoose.Types.ObjectId(conversationId),
                "read_by.user_id": {
                    $ne: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $push: {
                    read_by: {
                        user_id: new mongoose.Types.ObjectId(userId),
                        read_at: new Date()
                    }
                }
            }
        );
    }

    // Get unread count for user across all conversations
    async getUnreadCount(userId: string): Promise<number> {
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const result = await Message.aggregate([
            {
                $lookup: {
                    from: "conversations",
                    localField: "conversation_id",
                    foreignField: "_id",
                    as: "conv"
                }
            },
            { $unwind: "$conv" },
            {
                $addFields: {
                    _userDeleteRecord: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: { $ifNull: ["$conv.deleted_by", []] },
                                    as: "d",
                                    cond: { $eq: ["$$d.user_id", userObjectId] }
                                }
                            },
                            0
                        ]
                    }
                }
            },
            {
                $match: {
                    "conv.participants": userObjectId,
                    // Only count unread from accepted/none conversations (not pending requests)
                    "conv.request_status": { $in: ["none", "accepted"] },
                    sender_id: { $ne: userObjectId },
                    "read_by.user_id": { $ne: userObjectId },
                    // Exclude messages from before user's deletion time
                    $or: [
                        { _userDeleteRecord: null },
                        {
                            $expr: {
                                $gt: ["$created_at", "$_userDeleteRecord.deleted_at"]
                            }
                        }
                    ]
                }
            },
            { $count: "total" }
        ]);

        return result[0]?.total || 0;
    }

    // Delete message (soft delete)
    async deleteMessage(
        messageId: string,
        userId: string
    ): Promise<MessageDocument | null> {
        return Message.findOneAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(messageId),
                sender_id: new mongoose.Types.ObjectId(userId)
            },
            {
                is_deleted: true,
                deleted_at: new Date(),
                content: "",
                media_urls: [],
                media_keys: []
            },
            { new: true }
        );
    }

    // Add participant to group
    async addParticipant(
        conversationId: string,
        userId: string
    ): Promise<ConversationDocument | null> {
        return Conversation.findOneAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(conversationId),
                type: "group",
                participants: {
                    $not: {
                        $elemMatch: {
                            $eq: new mongoose.Types.ObjectId(userId)
                        }
                    }
                }
            },
            {
                $push: {
                    participants: new mongoose.Types.ObjectId(userId)
                }
            },
            { new: true }
        );
    }

    // Remove participant from group
    async removeParticipant(
        conversationId: string,
        userId: string
    ): Promise<ConversationDocument | null> {
        return Conversation.findOneAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(conversationId),
                type: "group"
            },
            {
                $pull: {
                    participants: new mongoose.Types.ObjectId(userId)
                }
            },
            { new: true }
        );
    }

    // Update group name
    async updateGroupName(
        conversationId: string,
        name: string
    ): Promise<ConversationDocument | null> {
        return Conversation.findByIdAndUpdate(
            conversationId,
            { group_name: name },
            { new: true }
        );
    }

    // Get participant count
    async getParticipantCount(conversationId: string): Promise<number> {
        const conv = await Conversation.findById(conversationId);
        return conv?.participants.length || 0;
    }

    // Get friends list for a user (mutual followers)
    async getFriends(userId: string): Promise<any[]> {
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Find users where mutual follow exists
        const friends = await Follow.aggregate([
            {
                $match: {
                    follower: userObjectId,
                    status: "accepted",
                    is_removed: false
                }
            },
            // Check if the other person follows back
            {
                $lookup: {
                    from: "follows",
                    let: { followingId: "$following" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$follower", "$$followingId"] },
                                        { $eq: ["$following", userObjectId] },
                                        { $eq: ["$status", "accepted"] },
                                        { $eq: ["$is_removed", false] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "followBack"
                }
            },
            {
                $match: {
                    "followBack.0": { $exists: true }
                }
            },
            // Lookup user data
            {
                $lookup: {
                    from: "users",
                    localField: "following",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    user_id: "$user._id",
                    username: "$user.username",
                    full_name: "$user.full_name",
                    avatar_key: "$user.avatar_key"
                }
            }
        ]);

        return friends.map((f) => ({
            ...f,
            avatar_url: f.avatar_key
                ? convertImageKeyToImageUrl(f.avatar_key)
                : null
        }));
    }
    // Soft delete a conversation for a specific user (with timestamp)
    async deleteConversation(conversationId: string, userId: string): Promise<boolean> {
        const convOid = new mongoose.Types.ObjectId(conversationId);
        const userOid = new mongoose.Types.ObjectId(userId);
        const now = new Date();

        // Remove existing entry for this user first, then add fresh one with new timestamp
        await Conversation.updateOne(
            { _id: convOid },
            { $pull: { deleted_by: { user_id: userOid } } }
        );

        const result = await Conversation.updateOne(
            { _id: convOid },
            { $push: { deleted_by: { user_id: userOid, deleted_at: now } } }
        );
        return result.modifiedCount > 0;
    }

    // Get the deletion timestamp for a specific user in a conversation
    async getUserDeletionTime(conversationId: string, userId: string): Promise<Date | null> {
        const conv = await Conversation.findOne(
            {
                _id: new mongoose.Types.ObjectId(conversationId),
                "deleted_by.user_id": new mongoose.Types.ObjectId(userId)
            },
            { "deleted_by.$": 1 }
        );
        return conv?.deleted_by?.[0]?.deleted_at || null;
    }

    // Update message request status
    async updateRequestStatus(
        conversationId: string,
        status: MessageRequestStatus
    ): Promise<ConversationDocument | null> {
        return Conversation.findByIdAndUpdate(
            conversationId,
            { request_status: status },
            { new: true }
        );
    }

    // Get pending message requests for a user (conversations where they are the recipient)
    async getMessageRequests(userId: string): Promise<any[]> {
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const conversations = await Conversation.aggregate([
            {
                $match: {
                    participants: userObjectId,
                    type: "direct",
                    request_status: "pending",
                    // Only show to the recipient (not the sender)
                    created_by: { $ne: userObjectId }
                }
            },
            { $sort: { created_at: -1 } },
            // Lookup last message
            {
                $lookup: {
                    from: "messages",
                    localField: "last_message",
                    foreignField: "_id",
                    as: "last_message_data"
                }
            },
            { $unwind: { path: "$last_message_data", preserveNullAndEmptyArrays: true } },
            // Lookup participants
            {
                $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "participants_data"
                }
            },
            // Lookup last message sender
            {
                $lookup: {
                    from: "users",
                    localField: "last_message_data.sender_id",
                    foreignField: "_id",
                    as: "last_message_sender"
                }
            },
            {
                $unwind: {
                    path: "$last_message_sender",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    type: 1,
                    last_message_at: 1,
                    created_at: 1,
                    request_status: 1,
                    created_by: 1,
                    participants: {
                        $map: {
                            input: "$participants_data",
                            as: "p",
                            in: {
                                user_id: "$$p._id",
                                username: "$$p.username",
                                full_name: "$$p.full_name",
                                avatar_key: "$$p.avatar_key"
                            }
                        }
                    },
                    last_message: {
                        $cond: {
                            if: "$last_message_data",
                            then: {
                                _id: "$last_message_data._id",
                                content: "$last_message_data.content",
                                message_type: "$last_message_data.message_type",
                                is_deleted: "$last_message_data.is_deleted",
                                created_at: "$last_message_data.created_at",
                                sender: {
                                    user_id: "$last_message_sender._id",
                                    username: "$last_message_sender.username",
                                    full_name: "$last_message_sender.full_name"
                                }
                            },
                            else: null
                        }
                    },
                    unread_count: { $literal: 0 }
                }
            }
        ]);

        return conversations.map((conv) => ({
            ...conv,
            conversation_id: conv._id,
            participants: conv.participants.map((p: any) => ({
                ...p,
                avatar_url: p.avatar_key
                    ? convertImageKeyToImageUrl(p.avatar_key)
                    : null
            }))
        }));
    }

    // Get count of pending message requests for a user
    async getRequestCount(userId: string): Promise<number> {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        return Conversation.countDocuments({
            participants: userObjectId,
            type: "direct",
            request_status: "pending",
            created_by: { $ne: userObjectId }
        });
    }

    // Check if a user can message another based on their settings and follow status
    async canMessageUser(
        senderId: string,
        recipientId: string
    ): Promise<{ allowed: boolean; isRequest: boolean }> {
        const recipientOid = new mongoose.Types.ObjectId(recipientId);
        const senderOid = new mongoose.Types.ObjectId(senderId);

        // Check recipient's messaging settings
        const recipientSettings = await UserSettings.findOne(
            { user_id: recipientOid },
            { "privacy.allow_messages_from": 1 }
        ).lean() as any;

        const allowFrom = recipientSettings?.privacy?.allow_messages_from || "everyone";

        if (allowFrom === "no_one") {
            return { allowed: false, isRequest: false };
        }

        // Check if they are mutual followers (friends)
        const areFriends = await this.areFriends(senderId, recipientId);

        if (areFriends) {
            // Friends can always message each other
            return { allowed: true, isRequest: false };
        }

        if (allowFrom === "followers_only") {
            // Not friends and setting is followers_only
            // Check if sender follows recipient
            const senderFollows = await Follow.findOne({
                follower: senderOid,
                following: recipientOid,
                status: "accepted",
                is_removed: false
            });

            if (senderFollows) {
                // Sender follows recipient - allow as message request
                return { allowed: true, isRequest: true };
            }
            return { allowed: false, isRequest: false };
        }

        // allow_messages_from === "everyone"
        // Allow as message request since they're not friends
        return { allowed: true, isRequest: true };
    }
}

export const chatRepo = new ChatRepository();
