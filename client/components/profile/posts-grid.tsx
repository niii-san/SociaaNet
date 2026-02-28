"use client";

import { Heart, MessageCircle, Copy } from "lucide-react";

interface Post {
    post_id: string;
    media_urls: string[];
    caption: string;
    comments_count: number;
    likes_count: number;
    hashtags: string[];
    created_at: string;
}

interface PostsGridProps {
    posts: Post[];
}

export function PostsGrid({ posts }: PostsGridProps) {
    if (!posts || posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <p className="text-lg font-medium">No posts yet</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-1">
            {posts.map((post) => (
                <div key={post.post_id} className="aspect-square bg-muted relative group cursor-pointer overflow-hidden">
                    <img 
                        src={post.media_urls[0]} 
                        alt="post" 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                    />
                    {/* Multiple images indicator */}
                    {post.media_urls.length > 1 && (
                        <div className="absolute top-2 right-2 z-10">
                            <Copy className="w-5 h-5 text-white drop-shadow-lg" />
                        </div>
                    )}
                    {/* Hover overlay with stats */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                        <div className="flex items-center gap-1">
                            <Heart className="w-6 h-6 fill-white" />
                            <span className="font-bold">{post.likes_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageCircle className="w-6 h-6 fill-white" />
                            <span className="font-bold">{post.comments_count}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
