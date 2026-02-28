"use client";

import { useState, useRef, useEffect } from "react";

const EMOJI_LIST = ["❤️", "😂", "😮", "😢", "😡", "👍", "🔥", "🎉", "💯", "🙏"];

interface EmojiPickerProps {
    onSelect: (emoji: string) => void;
    onClose: () => void;
}

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [onClose]);

    return (
        <div
            ref={ref}
            className="flex gap-1 bg-background border border-border rounded-full px-2 py-1.5 shadow-lg"
        >
            {EMOJI_LIST.map((emoji) => (
                <button
                    key={emoji}
                    onClick={() => {
                        onSelect(emoji);
                        onClose();
                    }}
                    className="text-lg hover:scale-125 transition-transform px-0.5"
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
}
