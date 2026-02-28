"use client";

import { useEffect, useCallback } from "react";

type KeyCombo = {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
};

type ShortcutHandler = (e: KeyboardEvent) => void;

/**
 * Hook to register a keyboard shortcut.
 * Automatically ignores events when user is typing in input/textarea/contenteditable.
 * Set `allowInInput` to true to fire even when focused on form elements.
 */
export function useKeyboardShortcut(
    combo: KeyCombo | KeyCombo[],
    handler: ShortcutHandler,
    options?: { allowInInput?: boolean; enabled?: boolean }
) {
    const { allowInInput = false, enabled = true } = options || {};

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!enabled) return;

            // Skip if user is typing in an input, textarea, or contenteditable
            if (!allowInInput) {
                const target = e.target as HTMLElement;
                const tag = target.tagName?.toLowerCase();
                if (
                    tag === "input" ||
                    tag === "textarea" ||
                    target.isContentEditable
                ) {
                    // Allow Escape even in inputs
                    if (e.key !== "Escape") return;
                }
            }

            const combos = Array.isArray(combo) ? combo : [combo];

            for (const c of combos) {
                const matches =
                    e.key.toLowerCase() === c.key.toLowerCase() &&
                    !!e.ctrlKey === !!c.ctrl &&
                    !!e.shiftKey === !!c.shift &&
                    !!e.altKey === !!c.alt &&
                    !!e.metaKey === !!c.meta;

                if (matches) {
                    handler(e);
                    return;
                }
            }
        },
        [combo, handler, allowInInput, enabled]
    );

    useEffect(() => {
        if (!enabled) return;
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown, enabled]);
}
