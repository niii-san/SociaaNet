"use client";

import { useAuth } from "@/contexts";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserProfileByUsername } from "@/features/users/users.api";
import { IUserProfile } from "@/types";
import { ProfileHeader } from "@/components/profile/profile-header";
import { PostsGrid } from "@/components/profile/posts-grid";
import { ReelsGrid } from "@/components/profile/reels-grid";
import { RepostsGrid } from "@/components/profile/reposts-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { MiniLoader } from "@/components/ui/mini-loader";
import { UserX, Lock, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProfilePageSkeleton } from "@/components/profile/profile-skeleton";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function ProfilePage() {
    const { username } = useParams<{ username: string }>();
    const router = useRouter();

    const [profileData, setProfileData] = useState<IUserProfile | null>(null);
    const { data: currentUserData } = useAuth();

    const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
    const [loading, setLoading] = useState(true);

    usePageTitle(profileData ? `${profileData.full_name} (@${profileData.username})` : `@${username}`);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!username) return;
            
            setLoading(true);
            try {
                const data = await getUserProfileByUsername(username);
                setProfileData(data);

                if (currentUserData) {
                    setIsCurrentUserProfile(
                        currentUserData.user_id === data.user_id
                    );
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                setProfileData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]); // Only depend on username from route
    
    // Separate effect to update isCurrentUserProfile when currentUserData changes
    useEffect(() => {
        if (currentUserData && profileData) {
            setIsCurrentUserProfile(
                currentUserData.user_id === profileData.user_id
            );
        }
    }, [currentUserData, profileData]);

    const handleProfileUpdate = async () => {
        if (!username) return;
        try {
            const data = await getUserProfileByUsername(username);
            setProfileData(data);
        } catch (error) {
            console.error("Error refetching profile:", error);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-16 lg:pb-12">
            {/* Mobile header with back button */}
            <header className="lg:hidden sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-1 -ml-1 rounded-full hover:bg-muted transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-semibold truncate">
                        {profileData ? `@${profileData.username}` : `@${username}`}
                    </h1>
                </div>
            </header>

            <div className="container max-w-5xl mx-auto px-4">
                {profileData ? (
                    <>
                        <ProfileHeader
                            user={profileData}
                            isOwner={isCurrentUserProfile}
                            followers={profileData.followers_count}
                            following={profileData.following_count}
                            joined={new Date(
                                profileData.created_at
                            ).toLocaleDateString()}
                            onProfileUpdate={handleProfileUpdate}
                        />

                        <Separator className="my-6" />

                        {/* Check if account is private and user is not following */}
                        {profileData.is_private_account && !profileData.is_following && !profileData.is_own_profile ? (
                            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full bg-muted/50 blur-2xl" />
                                    <div className="relative rounded-full bg-muted p-8">
                                        <Lock className="w-16 h-16 text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <h2 className="text-2xl font-bold">This Account is Private</h2>
                                    <p className="text-muted-foreground max-w-md">
                                        Follow this account to see their posts and reels.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <Tabs defaultValue="posts" className="w-full">
                                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
                                    <TabsTrigger
                                        value="posts"
                                        className="rounded-none border-b-2 border-transparent px-4 py-2 font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
                                    >
                                        Posts
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="reels"
                                        className="rounded-none border-b-2 border-transparent px-4 py-2 font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
                                    >
                                        Reels
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="reposts"
                                        className="rounded-none border-b-2 border-transparent px-4 py-2 font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
                                    >
                                        Reposts
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="posts" className="mt-6">
                                    <PostsGrid posts={profileData.posts || []} />
                                </TabsContent>
                                <TabsContent value="reels" className="mt-6">
                                    <ReelsGrid reels={profileData.reels || []} />
                                </TabsContent>
                                <TabsContent value="reposts" className="mt-6">
                                    <RepostsGrid reposts={profileData.reposts || []} />
                                </TabsContent>
                            </Tabs>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                        {loading ? (
                            <ProfilePageSkeleton />
                        ) : (
                            <>
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full bg-destructive/10 blur-2xl" />
                                    <div className="relative rounded-full bg-muted p-8">
                                        <UserX className="w-16 h-16 text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <h2 className="text-2xl font-bold">User Not Found</h2>
                                    <p className="text-muted-foreground max-w-md">
                                        This account doesn't exist or may have been removed.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
