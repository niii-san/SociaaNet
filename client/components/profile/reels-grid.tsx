"use client";

import { Clapperboard } from "lucide-react";

interface Reel {
    id: number;
    thumbnail: string;
}

interface ReelsGridProps {
    reels: Reel[];
}

export function ReelsGrid({ reels }: ReelsGridProps) {
    if (!reels || reels.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Clapperboard className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">No reels yet</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1">
            {reels.map((reel) => (
                <div key={reel.id} className="aspect-9/16 bg-muted relative group cursor-pointer">
                    <img src={reel.thumbnail} alt="reel" className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-semibold drop-shadow-md">
                        <Clapperboard className="w-3 h-3" />
                        15.4k
                    </div>
                </div>
            ))}
        </div>
    );
}
