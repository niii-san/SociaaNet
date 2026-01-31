"use client";

import { useAuth } from "@/contexts";
import { Grid3X3, Clapperboard, Repeat2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ProfileHeader } from "@/components/profile/profile-header";
import { PostsGrid } from "@/components/profile/posts-grid";
import { ReelsGrid } from "@/components/profile/reels-grid";
import { RepostsGrid } from "@/components/profile/reposts-grid";

// Mock data for profile
const DUMMY_PROFILE = {
    bio: "Full-stack developer | UI/UX Enthusiast | Building things for the web 🚀",
    location: "San Francisco, CA",
    website: "nishantbista.com.np",
    followers: 1234,
    following: 567,
    joined: "January 2025",
    posts: [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=500&fit=crop"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=500&fit=crop"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=500&fit=crop"
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop"
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&h=500&fit=crop"
        },
        {
            id: 6,
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=500&fit=crop"
        }
    ],
    reels: [
        {
            id: 1,
            thumbnail:
                "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=500&fit=crop"
        },
        {
            id: 2,
            thumbnail:
                "https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=300&h=500&fit=crop"
        }
    ],
    reposts: [
        // Dummy reposts
    ]
};

export default function ProfilePage() {
    const { uid } = useParams();
    const { data: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState<"posts" | "reels" | "reposts">(
        "posts"
    );

    const isOwner = currentUser?._id === uid;

    // Use current user data if owner, otherwise would fetch user by UID
    // For now assuming we are viewing current user or a dummy user if param differs (mock logic)
    // In real app, fetchProfile(uid)

    // Combining IUser with dummy data
    const displayUser = isOwner
        ? { ...currentUser, ...DUMMY_PROFILE }
        : {
            _id: uid,
            full_name: "Test User",
            username: "testuser",
            avatar_url: null,
            created_at: new Date().toISOString(),
            // @ts-ignore
            email_address: "test@example.com",
            ...DUMMY_PROFILE
        };

    return (
        <div className="pb-20">
            {/* Header / Cover */}
            <div className="h-48 bg-linear-to-r from-primary/10 to-primary/30 relative">
                {/* Back button could go here for mobile */}
            </div>

            {/* Profile Info */}
            <ProfileHeader
                user={displayUser as any}
                isOwner={isOwner}
                bio={displayUser.bio}
                followers={displayUser.followers}
                following={displayUser.following}
                joined={displayUser.joined}
            />

            {/* Tabs */}
            <div className="border-b border-border sticky top-16 bg-background/95 backdrop-blur-md z-10 mt-6">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab("posts")}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "posts" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:bg-muted/50"}`}
                    >
                        <Grid3X3 className="w-5 h-5" />
                        Posts
                    </button>
                    <button
                        onClick={() => setActiveTab("reels")}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "reels" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:bg-muted/50"}`}
                    >
                        <Clapperboard className="w-5 h-5" />
                        Reels
                    </button>
                    <button
                        onClick={() => setActiveTab("reposts")}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "reposts" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:bg-muted/50"}`}
                    >
                        <Repeat2 className="w-5 h-5" />
                        Reposts
                    </button>
                </div>
            </div>

            {/* Content Content - Grid */}
            <div className="min-h-75">
                {activeTab === "posts" && (
                    <PostsGrid posts={displayUser.posts} />
                )}

                {activeTab === "reels" && (
                    <ReelsGrid reels={displayUser.reels} />
                )}

                {activeTab === "reposts" && (
                    <RepostsGrid reposts={displayUser.reposts} />
                )}
            </div>
        </div>
    );
}
