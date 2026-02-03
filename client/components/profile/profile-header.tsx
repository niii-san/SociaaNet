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
import { IUserProfile } from "@/types";
import { EditFieldModal } from "./edit-field-modal";
import { Pencil } from "lucide-react";

interface ProfileHeaderProps {
    user: IUserProfile;
    isOwner: boolean;
    followers: number;
    following: number;
    joined: string;
}

export function ProfileHeader({ user, isOwner, followers, following, joined }: ProfileHeaderProps) {
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [editField, setEditField] = useState<{
        isOpen: boolean;
        title: string;
        fieldLabel: string;
        fieldName: "full_name" | "username" | "bio";
        initialValue: string;
        isTextarea?: boolean;
    }>({
        isOpen: false,
        title: "",
        fieldLabel: "",
        fieldName: "full_name",
        initialValue: "",
    });

    const handleAvatarClick = () => {
        if (!isOwner) return;
        setShowImagePicker(true);
    };

    const handleEditField = (
        title: string, 
        fieldLabel: string, 
        fieldName: "full_name" | "username" | "bio", 
        value: string, 
        isTextarea: boolean = false
    ) => {
        setEditField({
            isOpen: true,
            title,
            fieldLabel,
            fieldName,
            initialValue: value,
            isTextarea
        });
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

    return (
        <>
            <div className="relative mb-8 px-4">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="relative group shrink-0">
                        <div 
                            className={`w-36 h-36 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden ${isOwner ? 'cursor-pointer' : ''}`}
                            onClick={handleAvatarClick}
                        >
                            {user.avatar_url ? (
                                <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-linear-to-br from-primary to-purple-600 flex items-center justify-center text-white">
                                    <User className="w-20 h-20" />
                                </div>
                            )}
                            {isOwner && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                    <Camera className="w-10 h-10 text-white" />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex-1 space-y-4 pt-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 group/name">
                                    <h1 className="text-3xl font-bold leading-tight">{user.full_name}</h1>
                                    {isOwner && (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 opacity-0 group-hover/name:opacity-100 transition-opacity"
                                            onClick={() => handleEditField("Edit Name", "Full Name", "full_name", user.full_name)}
                                        >
                                            <Pencil className="w-4 h-4 text-muted-foreground" />
                                        </Button>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 group/username mt-1">
                                    <p className="text-lg text-muted-foreground">@{user.username}</p>
                                    {isOwner && (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6 opacity-0 group-hover/username:opacity-100 transition-opacity"
                                            onClick={() => handleEditField("Edit Username", "Username", "username", user.username)}
                                        >
                                            <Pencil className="w-3 h-3 text-muted-foreground" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {!isOwner && (
                                    <>
                                        <Button className="rounded-full font-semibold px-8">Follow</Button>
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

                        <div className="group/bio relative">
                            <p className="text-foreground whitespace-pre-wrap max-w-2xl leading-relaxed">
                                {user.bio || (isOwner ? "Add a bio..." : "")}
                            </p>
                            {isOwner && (
                                <div className="absolute top-0 right-full mr-2 md:static md:inline-flex md:mr-0 md:ml-2 align-top">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-6 w-6 opacity-0 group-hover/bio:opacity-100 transition-opacity"
                                        onClick={() => handleEditField("Edit Bio", "Bio", "bio", user.bio || "", true)}
                                    >
                                        <Pencil className="w-3 h-3 text-muted-foreground" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground pt-2">
                            <div className="flex items-center gap-1">
                                <CalendarDays className="w-4 h-4" />
                                <span>Joined {joined}</span>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-1 hover:underline cursor-pointer">
                                    <span className="font-bold text-foreground">{following}</span>
                                    <span>Following</span>
                                </div>
                                <div className="flex items-center gap-1 hover:underline cursor-pointer">
                                    <span className="font-bold text-foreground">{followers}</span>
                                    <span>Followers</span>
                                </div>
                            </div>
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
            <EditFieldModal
                {...editField}
                onClose={() => setEditField(prev => ({ ...prev, isOpen: false }))}
            />
        </>
    );
}
