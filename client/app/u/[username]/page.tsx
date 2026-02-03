"use client";

import { useAuth } from "@/contexts";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserProfileByUsername } from "@/features/users/users.api";
import { IUserProfile } from "@/types";
import { ProfileHeader } from "@/components/profile/profile-header";
import { PostsGrid } from "@/components/profile/posts-grid";
import { ReelsGrid } from "@/components/profile/reels-grid";
import { RepostsGrid } from "@/components/profile/reposts-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
    const { username } = useParams<{ username: string }>();

    const [profileData, setProfileData] = useState<IUserProfile | null>(null);
    const { data: currentUserData } = useAuth();

    const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
    const [loading, setLoading] = useState(true);

    console.log("current user data,", currentUserData);
    console.log("current profile data,", profileData);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfileByUsername(
                    username ?? "".toString()
                );
                setProfileData(data);
                
                if (currentUserData) {
                    setIsCurrentUserProfile(
                        currentUserData.username === data.username
                    );
                }
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, [username, currentUserData]); // Added currentUserData to dependency array

    return (
        <div className="min-h-screen bg-background pb-12 pt-16">
            <div className="container max-w-5xl mx-auto px-4">
                {profileData ? (
                    <>
                        <ProfileHeader
                            user={profileData}
                            isOwner={isCurrentUserProfile}
                            followers={1234}
                            following={567}
                            joined={new Date(
                                profileData.created_at
                            ).toLocaleDateString()}
                        />

                        <Separator className="my-6" />

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
                                <PostsGrid posts={[]} />
                            </TabsContent>
                            <TabsContent value="reels" className="mt-6">
                                <ReelsGrid reels={[]} />
                            </TabsContent>
                            <TabsContent value="reposts" className="mt-6">
                                <RepostsGrid reposts={[]} />
                            </TabsContent>
                        </Tabs>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-64">
                        {loading ? <p>Loading...</p> : <p>User not found</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
