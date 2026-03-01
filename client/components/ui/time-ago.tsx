"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

function getRelativeTime(dateStr: string): string {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diff = now - then;
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return seconds <= 5 ? "just now" : `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo`;
    const years = Math.floor(days / 365);
    return `${years}y`;
}

function getFullDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

interface TimeAgoProps {
    date: string;
    className?: string;
    prefix?: string;
    suffix?: string;
}

export function TimeAgo({ date, className, prefix, suffix }: TimeAgoProps) {
    const relative = useMemo(() => getRelativeTime(date), [date]);
    const full = useMemo(() => getFullDate(date), [date]);

    return (
        <time
            dateTime={new Date(date).toISOString()}
            title={full}
            className={cn(
                "text-muted-foreground text-sm cursor-default select-none",
                className
            )}
        >
            {prefix}
            {relative}
            {suffix}
        </time>
    );
}

export { getRelativeTime, getFullDate };
