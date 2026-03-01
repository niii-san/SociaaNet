"use client";

import { ReactNode } from "react";
import { Loader2, ArrowDown } from "lucide-react";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: ReactNode;
    className?: string;
}

export function PullToRefresh({
    onRefresh,
    children,
    className = "",
}: PullToRefreshProps) {
    const { containerRef, pullDistance, isRefreshing, showSpinner, progress } =
        usePullToRefresh({ onRefresh });

    return (
        <div
            ref={containerRef}
            className={`relative overflow-y-auto ${className}`}
        >
            {/* Pull indicator */}
            <div
                className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center justify-center transition-opacity duration-200"
                style={{
                    top: Math.max(pullDistance - 40, -40),
                    opacity: progress,
                }}
            >
                {isRefreshing || showSpinner ? (
                    <div className="w-8 h-8 rounded-full bg-background border border-border shadow-md flex items-center justify-center">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    </div>
                ) : (
                    <div
                        className="w-8 h-8 rounded-full bg-background border border-border shadow-md flex items-center justify-center transition-transform"
                        style={{
                            transform: `rotate(${progress * 180}deg)`,
                        }}
                    >
                        <ArrowDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                )}
            </div>

            {/* Content with pull offset */}
            <div
                style={{
                    transform: `translateY(${pullDistance}px)`,
                    transition: pullDistance === 0 && !isRefreshing ? "transform 0.3s ease" : "none",
                }}
            >
                {children}
            </div>
        </div>
    );
}
