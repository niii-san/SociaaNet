"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts";
import { AppSidebar } from "@/components/app-sidebar";
import {
    MessageCircle,
    Home,
    Search,
    Bell,
    Mail,
    User,
    Settings,
    Heart,
    MessageSquare,
    Repeat2,
    Share,
    MoreHorizontal,
    Image,
    Smile,
    MapPin,
    TrendingUp,
    Bookmark
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Fake data
const currentUser = {
    name: "John Doe",
    username: "johndoe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    bio: "Full-stack developer | Coffee enthusiast ☕"
};

const posts = [
    {
        id: 1,
        user: {
            name: "Sarah Wilson",
            username: "sarahw",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            verified: true
        },
        content:
            "Just launched my new portfolio website! 🚀 So excited to share my work with the world. Check it out and let me know what you think!",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        likes: 234,
        comments: 45,
        reposts: 12,
        time: "2h"
    },
    {
        id: 2,
        user: {
            name: "Alex Chen",
            username: "alexchen",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
            verified: false
        },
        content:
            "The sunrise this morning was absolutely breathtaking. Sometimes you just need to stop and appreciate the little things in life. 🌅",
        image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&h=400&fit=crop",
        likes: 892,
        comments: 67,
        reposts: 34,
        time: "4h"
    },
    {
        id: 3,
        user: {
            name: "Emily Rodriguez",
            username: "emilyr",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
            verified: true
        },
        content:
            "Just finished reading 'Atomic Habits' by James Clear. Highly recommend it to anyone looking to build better habits and break bad ones. What's your favorite productivity book? 📚",
        likes: 456,
        comments: 89,
        reposts: 23,
        time: "6h"
    },
    {
        id: 4,
        user: {
            name: "Marcus Johnson",
            username: "marcusj",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
            verified: false
        },
        content:
            "Working on a new open-source project that I think will help a lot of developers. Stay tuned for the announcement! 💻✨",
        likes: 178,
        comments: 23,
        reposts: 8,
        time: "8h"
    }
];

const trends = [
    { tag: "TechNews", posts: "125K" },
    { tag: "WebDevelopment", posts: "89K" },
    { tag: "AI", posts: "234K" },
    { tag: "StartupLife", posts: "56K" },
    { tag: "RemoteWork", posts: "78K" }
];

const suggestedUsers = [
    {
        name: "Tech Daily",
        username: "techdaily",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tech",
        bio: "Your daily dose of tech news"
    },
    {
        name: "Design Hub",
        username: "designhub",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Design",
        bio: "Inspiration for designers"
    },
    {
        name: "Code Masters",
        username: "codemasters",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Code",
        bio: "Learn to code with us"
    }
];

export function AuthHome() {
    const [postContent, setPostContent] = useState("");
    const [likedPosts, setLikedPosts] = useState<number[]>([]);
    const authContext = useAuth();
    console.log(authContext);

    const toggleLike = (postId: number) => {
        setLikedPosts((prev) =>
            prev.includes(postId)
                ? prev.filter((id) => id !== postId)
                : [...prev, postId]
        );
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Main Container */}
            <div className="max-w-7xl mx-auto flex">
                <AppSidebar />

                {/* Main Content */}
                <main className="flex-1 min-h-screen border-r border-border max-w-2xl">
                    {/* Header */}
                    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
                        <h1 className="text-xl font-bold">Home</h1>
                    </header>

                    {/* Compose Post */}
                    <div className="p-4 border-b border-border">
                        <div className="flex gap-3">
                            <img
                                src={currentUser.avatar}
                                alt={currentUser.name}
                                className="w-10 h-10 rounded-full bg-muted flex-shrink-0"
                            />
                            <div className="flex-1">
                                <textarea
                                    placeholder="What's happening?"
                                    value={postContent}
                                    onChange={(e) =>
                                        setPostContent(e.target.value)
                                    }
                                    className="w-full bg-transparent border-none outline-none resize-none text-lg placeholder:text-muted-foreground min-h-[80px]"
                                />
                                <div className="flex items-center justify-between pt-3 border-t border-border">
                                    <div className="flex items-center gap-1">
                                        <button className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors">
                                            <Image className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors">
                                            <Smile className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors">
                                            <MapPin className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <Button
                                        className="rounded-full px-5"
                                        disabled={!postContent.trim()}
                                    >
                                        Post
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feed */}
                    <div className="divide-y divide-border">
                        {posts.map((post) => (
                            <article
                                key={post.id}
                                className="p-4 hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex gap-3">
                                    <img
                                        src={post.user.avatar}
                                        alt={post.user.name}
                                        className="w-10 h-10 rounded-full bg-muted flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        {/* Post Header */}
                                        <div className="flex items-center gap-1 flex-wrap">
                                            <Link href={`/u/${post.user.username}`} className="font-semibold hover:underline">
                                                {post.user.name}
                                            </Link>
                                            {post.user.verified && (
                                                <svg
                                                    className="w-4 h-4 text-primary"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                                </svg>
                                            )}
                                            <Link href={`/u/${post.user.username}`} className="text-muted-foreground hover:underline">
                                                @{post.user.username}
                                            </Link>
                                            <span className="text-muted-foreground">
                                                ·
                                            </span>
                                            <span className="text-muted-foreground hover:underline cursor-pointer">
                                                {post.time}
                                            </span>
                                            <button className="ml-auto p-1 rounded-full hover:bg-muted transition-colors">
                                                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                        </div>

                                        {/* Post Content */}
                                        <p className="mt-1 whitespace-pre-wrap">
                                            {post.content}
                                        </p>

                                        {/* Post Image */}
                                        {post.image && (
                                            <div className="mt-3 rounded-2xl overflow-hidden border border-border">
                                                <img
                                                    src={post.image}
                                                    alt="Post image"
                                                    className="w-full object-cover max-h-96"
                                                />
                                            </div>
                                        )}

                                        {/* Post Actions */}
                                        <div className="flex items-center justify-between mt-3 max-w-md">
                                            <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                                                <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                                                    <MessageSquare className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm">
                                                    {post.comments}
                                                </span>
                                            </button>
                                            <button className="flex items-center gap-2 text-muted-foreground hover:text-green-500 transition-colors group">
                                                <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                                                    <Repeat2 className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm">
                                                    {post.reposts}
                                                </span>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    toggleLike(post.id)
                                                }
                                                className={`flex items-center gap-2 transition-colors group ${likedPosts.includes(post.id)
                                                        ? "text-red-500"
                                                        : "text-muted-foreground hover:text-red-500"
                                                    }`}
                                            >
                                                <div className="p-2 rounded-full group-hover:bg-red-500/10 transition-colors">
                                                    <Heart
                                                        className={`w-4 h-4 ${likedPosts.includes(
                                                            post.id
                                                        )
                                                                ? "fill-current"
                                                                : ""
                                                            }`}
                                                    />
                                                </div>
                                                <span className="text-sm">
                                                    {likedPosts.includes(
                                                        post.id
                                                    )
                                                        ? post.likes + 1
                                                        : post.likes}
                                                </span>
                                            </button>
                                            <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                                                <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                                                    <Share className="w-4 h-4" />
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </main>

                {/* Right Sidebar */}
                <aside className="hidden xl:block w-80 h-screen sticky top-0 p-4">
                    {/* Search */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search"
                            className="pl-10 rounded-full bg-muted border-none"
                        />
                    </div>

                    {/* Trends */}
                    <div className="bg-muted/50 rounded-2xl p-4 mb-4">
                        <h2 className="text-lg font-bold mb-4">
                            Trends for you
                        </h2>
                        <div className="space-y-4">
                            {trends.map((trend, index) => (
                                <div
                                    key={index}
                                    className="group cursor-pointer"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Trending
                                            </p>
                                            <p className="font-semibold group-hover:text-primary transition-colors">
                                                #{trend.tag}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {trend.posts} posts
                                            </p>
                                        </div>
                                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="text-primary text-sm mt-4 hover:underline">
                            Show more
                        </button>
                    </div>

                    {/* Who to Follow */}
                    <div className="bg-muted/50 rounded-2xl p-4">
                        <h2 className="text-lg font-bold mb-4">
                            Who to follow
                        </h2>
                        <div className="space-y-4">
                            {suggestedUsers.map((user, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3"
                                >
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full bg-muted"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/u/${user.username}`} className="font-semibold text-sm truncate hover:underline block">
                                            {user.name}
                                        </Link>
                                        <Link href={`/u/${user.username}`} className="text-xs text-muted-foreground truncate block">
                                            @{user.username}
                                        </Link>
                                    </div>
                                    <Button size="sm" className="rounded-full">
                                        Follow
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <button className="text-primary text-sm mt-4 hover:underline">
                            Show more
                        </button>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-4 px-2">
                        <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
                            <Link href="/terms" className="hover:underline">
                                Terms of Service
                            </Link>
                            <Link href="/privacy" className="hover:underline">
                                Privacy Policy
                            </Link>
                            <Link href="/cookies" className="hover:underline">
                                Cookie Policy
                            </Link>
                            <Link
                                href="/accessibility"
                                className="hover:underline"
                            >
                                Accessibility
                            </Link>
                            <Link href="/ads" className="hover:underline">
                                Ads info
                            </Link>
                            <span>© 2025 SociaaNet</span>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border px-6 py-2 flex items-center justify-around">
                <Link href="/home" className="p-3 text-primary">
                    <Home className="w-6 h-6" />
                </Link>
                <Link
                    href="/explore"
                    className="p-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Search className="w-6 h-6" />
                </Link>
                <Link
                    href="/notifications"
                    className="p-3 text-muted-foreground hover:text-foreground transition-colors relative"
                >
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
                </Link>
                <Link
                    href="/messages"
                    className="p-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Mail className="w-6 h-6" />
                </Link>
            </nav>
        </div>
    );
}
