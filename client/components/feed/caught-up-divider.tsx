"use client";

import { CheckCircle2 } from "lucide-react";

export function CaughtUpDivider() {
    return (
        <div className="flex flex-col items-center justify-center py-8 px-4 border-b border-border">
            <div className="flex items-center gap-3 mb-2">
                <div className="h-px w-16 bg-border" />
                <CheckCircle2 className="w-8 h-8 text-primary" />
                <div className="h-px w-16 bg-border" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
                You&apos;re all caught up
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
                You&apos;ve seen all new posts from the last 3 days
            </p>
        </div>
    );
}
