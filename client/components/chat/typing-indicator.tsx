"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TypingIndicatorProps {
    /** User info for the person(s) typing */
    typingUsers: Array<{
        user_id: string;
        full_name: string;
        avatar_url: string | null;
    }>;
}

export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
    if (typingUsers.length === 0) return null;

    const firstUser = typingUsers[0];

    return (
        <div className="flex items-end gap-2 px-4 py-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Avatar */}
            <Avatar className="w-7 h-7 shrink-0">
                <AvatarImage
                    src={firstUser.avatar_url || undefined}
                    alt={firstUser.full_name}
                />
                <AvatarFallback className="text-xs">
                    {firstUser.full_name[0]?.toUpperCase()}
                </AvatarFallback>
            </Avatar>

            {/* Typing bubble with bouncing dots */}
            <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                <span
                    className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
                    style={{ animationDelay: "0ms", animationDuration: "1s" }}
                />
                <span
                    className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
                    style={{ animationDelay: "150ms", animationDuration: "1s" }}
                />
                <span
                    className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
                    style={{ animationDelay: "300ms", animationDuration: "1s" }}
                />
            </div>

            {/* Name label for groups */}
            {typingUsers.length > 1 && (
                <span className="text-xs text-muted-foreground ml-1">
                    {typingUsers.length} people
                </span>
            )}
        </div>
    );
}
