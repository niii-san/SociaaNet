"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import { updateUsername, updateBio, updateFullName } from "@/features/users/users.api";
import { getCurrentUser } from "@/features/users/users.api";
import { IUserProfile } from "@/types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface EditProfileModalProps {
    user: IUserProfile;
    isOpen: boolean;
    onClose: () => void;
}

export function EditProfileModal({
    user,
    isOpen,
    onClose,
}: EditProfileModalProps) {
    const [fullName, setFullName] = useState(user.full_name);
    const [username, setUsername] = useState(user.username);
    const [bio, setBio] = useState(user.bio || "");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Reset state when user changes or modal opens
    useEffect(() => {
        if (isOpen) {
            setFullName(user.full_name);
            setUsername(user.username);
            setBio(user.bio || "");
        }
    }, [user, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Update all fields that have changed
            const updatePromises = [];
            let usernameChanged = false;
            let newUsername = username;
            
            if (fullName !== user.full_name) {
                updatePromises.push(updateFullName(fullName));
            }
            if (username !== user.username) {
                updatePromises.push(updateUsername(username));
                usernameChanged = true;
            }
            if (bio !== (user.bio || "")) {
                updatePromises.push(updateBio(bio));
            }
            
            await Promise.all(updatePromises);
            
            toast.success("Profile updated successfully");
            
            // Refetch current user data
            await getCurrentUser();
            
            // If username changed, redirect to new profile URL
            if (usernameChanged) {
                router.push(`/u/${newUsername}`);
            } else {
                // Otherwise just reload to refresh data
                window.location.reload();
            }
            onClose();
        } catch (error: any) {
            console.error(error);
            const errorMessage = error?.response?.data?.message || "Failed to update profile";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="col-span-3"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Username
                            </Label>
                            <Input
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="col-span-3"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bio" className="text-right">
                                Bio
                            </Label>
                            <Textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="col-span-3"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
