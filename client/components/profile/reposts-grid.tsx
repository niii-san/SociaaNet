"use client";

import { Repeat2 } from "lucide-react";

interface RepostsGridProps {
    // Defines what a repost looks like later, for now just empty state usually
    reposts: any[]; 
}

export function RepostsGrid({ reposts }: RepostsGridProps) {
    if (!reposts || reposts.length === 0) {
        return (
            <div className="min-h-75 flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Repeat2 className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">No reposts yet</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-1">
             {/* Render logic would go here */}
        </div>
    );
}
