"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Send, Image, X, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/types";
import { uploadChatMedia } from "@/features/chat/chat.api";
import { toast } from "sonner";

interface ChatInputProps {
    onSend: (data: {
        content?: string;
        messageType?: "text" | "image" | "video" | "mixed";
        mediaKeys?: string[];
        replyTo?: string;
    }) => void;
    replyTo: ChatMessage | null;
    onCancelReply: () => void;
    onTypingStart: () => void;
    onTypingStop: () => void;
    disabled?: boolean;
}

export function ChatInput({
    onSend,
    replyTo,
    onCancelReply,
    onTypingStart,
    onTypingStop,
    disabled
}: ChatInputProps) {
    const [text, setText] = useState("");
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isTypingRef = useRef(false);

    useEffect(() => {
        if (replyTo && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [replyTo]);

    // Cleanup previews
    useEffect(() => {
        return () => {
            mediaPreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [mediaPreviews]);

    const handleTyping = () => {
        if (!isTypingRef.current) {
            isTypingRef.current = true;
            onTypingStart();
        }
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            isTypingRef.current = false;
            onTypingStop();
        }, 2000);
    };

    const handleSend = async () => {
        const content = text.trim();
        if (!content && mediaFiles.length === 0) return;

        // Stop typing indicator
        if (isTypingRef.current) {
            isTypingRef.current = false;
            onTypingStop();
        }
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        let mediaKeys: string[] | undefined;
        let messageType: "text" | "image" | "video" | "mixed" = "text";

        if (mediaFiles.length > 0) {
            setUploading(true);
            try {
                const result = await uploadChatMedia(mediaFiles);
                mediaKeys = result.keys;

                const hasImages = mediaFiles.some((f) =>
                    f.type.startsWith("image/")
                );
                const hasVideos = mediaFiles.some((f) =>
                    f.type.startsWith("video/")
                );
                if (hasImages && hasVideos) messageType = "mixed";
                else if (hasVideos) messageType = "video";
                else messageType = "image";
            } catch {
                toast.error("Failed to upload media");
                setUploading(false);
                return;
            }
            setUploading(false);
        }

        onSend({
            content: content || undefined,
            messageType,
            mediaKeys,
            replyTo: replyTo?._id
        });

        setText("");
        setMediaFiles([]);
        setMediaPreviews((prev) => {
            prev.forEach((url) => URL.revokeObjectURL(url));
            return [];
        });
        onCancelReply();

        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
        // Escape to cancel reply
        if (e.key === "Escape" && replyTo) {
            e.preventDefault();
            onCancelReply();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const validFiles = files.filter((f) => {
            if (
                !f.type.startsWith("image/") &&
                !f.type.startsWith("video/")
            ) {
                toast.error(`${f.name} is not a supported format`);
                return false;
            }
            if (f.size > 50 * 1024 * 1024) {
                toast.error(`${f.name} is too large (max 50MB)`);
                return false;
            }
            return true;
        });

        setMediaFiles((prev) => [...prev, ...validFiles]);
        const previews = validFiles.map((f) => URL.createObjectURL(f));
        setMediaPreviews((prev) => [...prev, ...previews]);

        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeMedia = (index: number) => {
        URL.revokeObjectURL(mediaPreviews[index]);
        setMediaFiles((prev) => prev.filter((_, i) => i !== index));
        setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleTextareaInput = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setText(e.target.value);
        handleTyping();

        // Auto-resize
        const ta = e.target;
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    };

    return (
        <div className="border-t border-border bg-background">
            {/* Reply preview */}
            {replyTo && (
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b border-border animate-in slide-in-from-bottom-2 duration-150">
                    <Reply className="w-4 h-4 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-primary">
                            Replying to {replyTo.sender.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {replyTo.is_deleted
                                ? "Message deleted"
                                : replyTo.message_type !== "text"
                                  ? "📷 Media"
                                  : replyTo.content}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-6 w-6"
                        onClick={onCancelReply}
                        title="Cancel reply (Esc)"
                    >
                        <X className="w-3 h-3" />
                    </Button>
                </div>
            )}

            {/* Media previews */}
            {mediaPreviews.length > 0 && (
                <div className="flex gap-2 px-4 py-2 overflow-x-auto border-b border-border">
                    {mediaPreviews.map((preview, i) => (
                        <div
                            key={i}
                            className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted"
                        >
                            {mediaFiles[i]?.type.startsWith("video/") ? (
                                <video
                                    src={preview}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src={preview}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <button
                                onClick={() => removeMedia(i)}
                                className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center"
                            >
                                <X className="w-2.5 h-2.5 text-white" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Input row */}
            <div className="flex items-end gap-2 px-3 py-3">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileChange}
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 mb-0.5"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled || uploading}
                >
                    <Image className="w-5 h-5" />
                </Button>

                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={handleTextareaInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Message..."
                    rows={1}
                    disabled={disabled || uploading}
                    className="flex-1 resize-none bg-muted/50 rounded-2xl px-4 py-2.5 text-sm placeholder:text-muted-foreground outline-none max-h-30 border border-border focus:border-primary transition-colors"
                />

                <Button
                    size="icon"
                    className="shrink-0 rounded-full mb-0.5"
                    onClick={handleSend}
                    disabled={
                        disabled ||
                        uploading ||
                        (!text.trim() && mediaFiles.length === 0)
                    }
                >
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
