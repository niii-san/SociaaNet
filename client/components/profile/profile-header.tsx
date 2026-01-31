"use client";

import { useAuth } from "@/contexts";
import {
    CalendarDays,
    Camera,
    MessageCircle,
    MoreHorizontal,
    User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ImagePickerModal } from "./image-picker-modal";
import { api } from "@/lib/axios-instance";
import { toast } from "sonner";
import { IUser } from "@/types";

interface ProfileHeaderProps {
    user: IUser;
    isOwner: boolean;
    // Extended properties that might not be in IUser yet but in our dummy data
    bio?: string;
    followers: number;
    following: number;
    joined: string;
}

export function ProfileHeader({ user, isOwner, bio, followers, following, joined }: ProfileHeaderProps) {
    const [showImagePicker, setShowImagePicker] = useState(false);

    const handleAvatarClick = () => {
        if (!isOwner) return;
        setShowImagePicker(true);
    };

    const handleFileSelect = async (file: File) => {
        const formData = new FormData();
        formData.append("avatar", file);

        const promise = api.post("/users/me/avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        toast.promise(promise, {
            loading: "Uploading avatar...",
            success: () => {
                 // In a real app we'd trigger a revalidation here.
                 // For now, reloading to show change.
                setTimeout(() => window.location.reload(), 1000);
                return "Avatar updated successfully!";
            },
            error: "Failed to upload avatar",
        });
    };

    const handleEditProfile = () => {
        toast("Edit profile functionality coming soon!");
    };

    return (
        <>
            <div className="relative mb-4 px-4">
                <div className="flex justify-between items-start -mt-16">
                    <div className="relative group">
                        <div 
                            className={`w-32 h-32 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden ${isOwner ? 'cursor-pointer' : ''}`}
                            onClick={handleAvatarClick}
                        >
                            {user.avatar_url ? (
                                <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-linear-to-br from-primary to-purple-600 flex items-center justify-center text-white">
                                    <User className="w-16 h-16" />
                                </div>
                            )}
                            {isOwner && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-20 sm:mt-0 pt-4 flex gap-3">
                        {isOwner ? (
                            <Button variant="outline" className="rounded-full font-semibold" onClick={handleEditProfile}>
                                Edit Profile
                            </Button>
                        ) : (
                            <>
                                <Button className="rounded-full font-semibold">Follow</Button>
                                <Button variant="outline" size="icon" className="rounded-full">
                                    <MessageCircle className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <MoreHorizontal className="w-5 h-5" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    <div>
                        <h1 className="text-2xl font-bold leading-tight">{user.full_name}</h1>
                        <p className="text-muted-foreground">@{user.username}</p>
                    </div>

                    <p className="text-foreground whitespace-pre-wrap max-w-xl">
                        {bio}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <CalendarDays className="w-4 h-4" />
                            <span>Joined {joined}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1 hover:underline cursor-pointer">
                            <span className="font-bold text-foreground">{following}</span>
                            <span className="text-muted-foreground">Following</span>
                        </div>
                        <div className="flex items-center gap-1 hover:underline cursor-pointer">
                            <span className="font-bold text-foreground">{followers}</span>
                            <span className="text-muted-foreground">Followers</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <ImagePickerModal 
                isOpen={showImagePicker}
                onClose={() => setShowImagePicker(false)}
                onFileSelect={handleFileSelect}
                currentAvatar={user.avatar_url}
            />
        </>
    );
}
