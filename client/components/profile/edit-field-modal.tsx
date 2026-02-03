"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import { updateUserProfile } from "@/features/users/users.api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface EditFieldModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    fieldLabel: string;
    fieldName: "full_name" | "username" | "bio";
    initialValue: string;
    isTextarea?: boolean;
}

export function EditFieldModal({
    isOpen,
    onClose,
    title,
    fieldLabel,
    fieldName,
    initialValue,
    isTextarea = false
}: EditFieldModalProps) {
    const [value, setValue] = useState(initialValue);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            setValue(initialValue);
        }
    }, [initialValue, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await updateUserProfile({
                [fieldName]: value
            });
            toast.success(`${fieldLabel} updated successfully`);
            router.refresh();
            // Simple reload to ensure data consistency as per previous pattern
            setTimeout(() => window.location.reload(), 500);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor={fieldName}>
                                {fieldLabel}
                            </Label>
                            {isTextarea ? (
                                <Textarea
                                    id={fieldName}
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    rows={4}
                                    disabled={isLoading}
                                />
                            ) : (
                                <Input
                                    id={fieldName}
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    disabled={isLoading}
                                />
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
