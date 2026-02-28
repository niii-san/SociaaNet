"use client";

import { useEffect } from "react";

/**
 * Sets the document title for the current page.
 * Appends " · SociaaNet" suffix automatically.
 */
export function usePageTitle(title: string) {
    useEffect(() => {
        const prev = document.title;
        document.title = title ? `${title} · SociaaNet` : "SociaaNet";
        return () => {
            document.title = prev;
        };
    }, [title]);
}
