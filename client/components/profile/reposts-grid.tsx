"use client";

import { Repeat2, Heart, MessageCircle, Play, Copy, Clapperboard } from "lucide-react";
import Link from "next/link";
import { IRepost } from "@/types";

interface RepostsGridProps {
    reposts: IRepost[];
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

    const formatCount = (count: number): string => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    return (
        <div className="grid grid-cols-3 gap-1">
            {reposts.map((repost) => {
                if (repost.type === "post" && repost.post) {
                    return (
                        <Link href={`/posts/${repost.post.post_id}`} key={repost.repost_id}>
                            <div className="aspect-square bg-muted relative group cursor-pointer overflow-hidden">
                                <img
                                    src={repost.post.media_urls[0]}
                                    alt="reposted post"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                {/* Multiple images indicator */}
                                {repost.post.media_urls.length > 1 && (
                                    <div className="absolute top-2 right-2 z-10">
                                        <Copy className="w-5 h-5 text-white drop-shadow-lg" />
                                    </div>
                                )}
                                {/* Repost badge */}
                                <div className="absolute top-2 left-2 z-10">
                                    <div className="bg-black/60 rounded-full p-1">
                                        <Repeat2 className="w-3.5 h-3.5 text-green-400" />
                                    </div>
                                </div>
                                {/* Hover overlay with stats */}
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                                    <div className="flex items-center gap-1">
                                        <Heart className="w-6 h-6 fill-white" />
                                        <span className="font-bold">{formatCount(repost.post.likes_count)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageCircle className="w-6 h-6 fill-white" />
                                        <span className="font-bold">{formatCount(repost.post.comments_count)}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                }

                if (repost.type === "reel" && repost.reel) {
                    return (
                        <Link href={`/reels/${repost.reel.reel_id}`} key={repost.repost_id}>
                            <div className="aspect-9/16 bg-muted relative group cursor-pointer overflow-hidden">
                                <img
                                    src={repost.reel.thumbnail_url}
                                    alt="reposted reel"
                                    className="w-full h-full object-cover"
                                />
                                {/* Play icon overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                    <Play className="w-12 h-12 text-white fill-white" />
                                </div>
                                {/* Repost badge */}
                                <div className="absolute top-2 left-2 z-10">
                                    <div className="bg-black/60 rounded-full p-1">
                                        <Repeat2 className="w-3.5 h-3.5 text-green-400" />
                                    </div>
                                </div>
                                {/* Views count */}
                                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-semibold drop-shadow-md">
                                    <Clapperboard className="w-3 h-3" />
                                    {formatCount(repost.reel.views_count)}
                                </div>
                            </div>
                        </Link>
                    );
                }

                return null;
            })}
        </div>
    );
}
