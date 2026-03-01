"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UsePullToRefreshOptions {
    onRefresh: () => Promise<void>;
    threshold?: number;
    maxPull?: number;
}

export function usePullToRefresh({
    onRefresh,
    threshold = 80,
    maxPull = 120,
}: UsePullToRefreshOptions) {
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const touchStartY = useRef(0);
    const isPulling = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleTouchStart = useCallback(
        (e: TouchEvent) => {
            if (isRefreshing) return;
            const el = containerRef.current;
            // Only activate if scrolled to top
            if (el && el.scrollTop <= 0) {
                touchStartY.current = e.touches[0].clientY;
                isPulling.current = true;
            }
        },
        [isRefreshing]
    );

    const handleTouchMove = useCallback(
        (e: TouchEvent) => {
            if (!isPulling.current || isRefreshing) return;
            const diff = e.touches[0].clientY - touchStartY.current;
            if (diff > 0) {
                // Apply resistance (diminishing returns)
                const distance = Math.min(diff * 0.5, maxPull);
                setPullDistance(distance);
            }
        },
        [isRefreshing, maxPull]
    );

    const handleTouchEnd = useCallback(async () => {
        if (!isPulling.current || isRefreshing) return;
        isPulling.current = false;

        if (pullDistance >= threshold) {
            setIsRefreshing(true);
            setPullDistance(threshold * 0.5); // Shrink to spinner position
            try {
                await onRefresh();
            } finally {
                setIsRefreshing(false);
                setPullDistance(0);
            }
        } else {
            setPullDistance(0);
        }
    }, [pullDistance, threshold, isRefreshing, onRefresh]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        el.addEventListener("touchstart", handleTouchStart, { passive: true });
        el.addEventListener("touchmove", handleTouchMove, { passive: true });
        el.addEventListener("touchend", handleTouchEnd);
        return () => {
            el.removeEventListener("touchstart", handleTouchStart);
            el.removeEventListener("touchmove", handleTouchMove);
            el.removeEventListener("touchend", handleTouchEnd);
        };
    }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

    const showSpinner = pullDistance >= threshold || isRefreshing;
    const progress = Math.min(pullDistance / threshold, 1);

    return {
        containerRef,
        pullDistance,
        isRefreshing,
        showSpinner,
        progress,
    };
}
