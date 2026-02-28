"use client";

import { useState } from "react";
import { ChatMessage } from "@/types";
import { useAuth } from "@/contexts";
import { SmilePlus, Reply, Trash2, Check, CheckCheck } from "lucide-react";
import { EmojiPicker } from "./emoji-picker";
import { ReactionDetailsDialog } from "./reaction-details-dialog";

interface MessageBubbleProps {
    message: ChatMessage;
    isGroup: boolean;
    onReply: (message: ChatMessage) => void;
    onReact: (messageId: string, emoji: string) => void;
    onUnreact: (messageId: string) => void;
    onDelete: (messageId: string) => void;
}

function formatMessageTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
}

export function MessageBubble({
    message,
    isGroup,
    onReply,
    onReact,
    onUnreact,
    onDelete
}: MessageBubbleProps) {
    const { data: currentUser } = useAuth();
    const [showActions, setShowActions] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showReactionDetails, setShowReactionDetails] = useState(false);

    const isMine = message.sender.user_id === currentUser?.user_id;
    const myReaction = message.reactions?.find(
        (r) => r.user_id === currentUser?.user_id
    );

    if (message.is_deleted) {
        return (
            <div
                className={`flex ${isMine ? "justify-end" : "justify-start"} px-4 py-0.5`}
            >
                {/* Avatar for received messages */}
                {!isMine && (
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0 mr-2 mt-auto mb-1">
                        {message.sender.avatar_url ? (
                            <img
                                src={message.sender.avatar_url}
                                alt={message.sender.full_name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-[10px] font-semibold text-muted-foreground">
                                {message.sender.full_name?.[0]?.toUpperCase()}
                            </span>
                        )}
                    </div>
                )}
                <div className="max-w-[75%]">
                    {!isMine && isGroup && (
                        <p className="text-[10px] text-muted-foreground mb-0.5 ml-1">
                            {message.sender.full_name}
                        </p>
                    )}
                    <div
                        className={`rounded-2xl px-4 py-2 text-sm italic text-muted-foreground ${
                            isMine
                                ? "bg-primary/10 rounded-br-sm"
                                : "bg-muted rounded-bl-sm"
                        }`}
                    >
                        This message was deleted
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`flex ${isMine ? "justify-end" : "justify-start"} px-4 py-0.5 group`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => {
                setShowActions(false);
                if (!showEmojiPicker) setShowEmojiPicker(false);
            }}
        >
            {/* Avatar for received messages */}
            {!isMine && (
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0 mr-2 mt-auto mb-1">
                    {message.sender.avatar_url ? (
                        <img
                            src={message.sender.avatar_url}
                            alt={message.sender.full_name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-[10px] font-semibold text-muted-foreground">
                            {message.sender.full_name?.[0]?.toUpperCase()}
                        </span>
                    )}
                </div>
            )}
            <div className={`max-w-[75%] ${isMine ? "items-end" : "items-start"}`}>
                {/* Sender name for group chats */}
                {!isMine && isGroup && (
                    <p className="text-[10px] text-muted-foreground mb-0.5 ml-1 font-medium">
                        {message.sender.full_name}
                    </p>
                )}

                {/* Reply-to preview */}
                {message.reply_to && (
                    <div
                        className={`rounded-t-xl px-3 py-1.5 -mb-1 text-xs border-l-2 border-primary ${
                            isMine
                                ? "bg-primary/5 rounded-br-none"
                                : "bg-muted/80 rounded-bl-none"
                        }`}
                    >
                        <p className="font-medium text-primary text-[10px]">
                            {message.reply_to.sender.full_name}
                        </p>
                        <p className="text-muted-foreground truncate">
                            {message.reply_to.is_deleted
                                ? "Message deleted"
                                : message.reply_to.message_type !== "text"
                                  ? "📷 Media"
                                  : message.reply_to.content}
                        </p>
                    </div>
                )}

                {/* Message body */}
                <div className="relative">
                    <div
                        className={`rounded-2xl overflow-hidden ${
                            isMine
                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                : "bg-muted rounded-bl-sm"
                        }`}
                    >
                        {/* Media */}
                        {message.media_urls && message.media_urls.length > 0 && (
                            <div
                                className={`${
                                    message.media_urls.length === 1
                                        ? ""
                                        : "grid grid-cols-2 gap-0.5"
                                }`}
                            >
                                {message.media_urls.map((url, i) => (
                                    <div
                                        key={i}
                                        className="relative overflow-hidden"
                                    >
                                        {message.message_type === "video" ? (
                                            <video
                                                src={url}
                                                controls
                                                className="max-w-full max-h-64 rounded-t-xl"
                                            />
                                        ) : (
                                            <img
                                                src={url}
                                                alt=""
                                                className="max-w-full max-h-64 object-cover"
                                                loading="lazy"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Text */}
                        {message.content && (
                            <p className="px-3.5 py-2 text-sm whitespace-pre-wrap wrap-break-word">
                                {message.content}
                            </p>
                        )}
                    </div>

                    {/* Action buttons */}
                    {showActions && (
                        <div
                            className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-0.5 ${
                                isMine ? "-left-20" : "-right-20"
                            }`}
                        >
                            <button
                                onClick={() => setShowEmojiPicker(true)}
                                className="p-1.5 rounded-full hover:bg-muted transition-colors"
                                title="React"
                            >
                                <SmilePlus className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                            <button
                                onClick={() => onReply(message)}
                                className="p-1.5 rounded-full hover:bg-muted transition-colors"
                                title="Reply"
                            >
                                <Reply className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                            {isMine && (
                                <button
                                    onClick={() => onDelete(message._id)}
                                    className="p-1.5 rounded-full hover:bg-muted transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Emoji picker */}
                    {showEmojiPicker && (
                        <div
                            className={`absolute bottom-full mb-1 z-20 ${
                                isMine ? "right-0" : "left-0"
                            }`}
                        >
                            <EmojiPicker
                                onSelect={(emoji) =>
                                    onReact(message._id, emoji)
                                }
                                onClose={() => setShowEmojiPicker(false)}
                            />
                        </div>
                    )}
                </div>

                {/* Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                    <div
                        className={`flex flex-wrap gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}
                    >
                        {Object.entries(
                            message.reactions.reduce(
                                (acc, r) => {
                                    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                                    return acc;
                                },
                                {} as Record<string, number>
                            )
                        ).map(([emoji, count]) => (
                            <button
                                key={emoji}
                                onClick={() =>
                                    setShowReactionDetails(true)
                                }
                                className={`inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full border transition-colors cursor-pointer ${
                                    myReaction?.emoji === emoji
                                        ? "bg-primary/10 border-primary/30"
                                        : "bg-muted border-border hover:bg-muted/80"
                                }`}
                            >
                                <span>{emoji}</span>
                                {count > 1 && (
                                    <span className="text-muted-foreground">
                                        {count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* Reaction details dialog */}
                <ReactionDetailsDialog
                    open={showReactionDetails}
                    onOpenChange={setShowReactionDetails}
                    messageId={message._id}
                    onRemoveReaction={() => onUnreact(message._id)}
                />

                {/* Time and read status */}
                <div
                    className={`flex items-center gap-1 mt-0.5 ${isMine ? "justify-end" : "justify-start"}`}
                >
                    <span className="text-[10px] text-muted-foreground">
                        {formatMessageTime(message.created_at)}
                    </span>
                    {isMine && (
                        <span className="text-muted-foreground">
                            {message.read_by && message.read_by.length > 1 ? (
                                <CheckCheck className="w-3 h-3 text-primary" />
                            ) : (
                                <Check className="w-3 h-3" />
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
