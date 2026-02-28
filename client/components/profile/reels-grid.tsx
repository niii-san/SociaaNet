"use client";

import { Clapperboard, Play } from "lucide-react";
import Link from "next/link";

interface Reel {
    reel_id: string;
    media_url: string;
    thumbnail_url: string;
    caption: string;
    hashtags: string[];
    views_count: number;
    likes_count: number;
    comments_count: number;
    duration_seconds: number;
    created_at: string;
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

    const formatViews = (views: number): string => {
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)}M`;
        } else if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}K`;
        }
        return views.toString();
    };

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1">
            {reels.map((reel) => (
                <Link href={`/reels/${reel.reel_id}`} key={reel.reel_id}>
                    <div className="aspect-9/16 bg-muted relative group cursor-pointer overflow-hidden">
                        <img 
                            src={reel.thumbnail_url} 
                            alt="reel" 
                            className="w-full h-full object-cover" 
                        />
                        {/* Play icon overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                            <Play className="w-12 h-12 text-white fill-white" />
                        </div>
                        {/* Views count */}
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-semibold drop-shadow-md">
                            <Clapperboard className="w-3 h-3" />
                            {formatViews(reel.views_count)}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
