"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, Check, Loader2 } from "lucide-react";
import { ChatFriend } from "@/types";
import {
    getFriends,
    getOrCreateDirectConversation,
    createGroupConversation
} from "@/features/chat/chat.api";
import { useChat } from "@/contexts/chat.context";
import { toast } from "sonner";

interface NewChatDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NewChatDialog({ open, onOpenChange }: NewChatDialogProps) {
    const router = useRouter();
    const { refreshConversations } = useChat();
    const [friends, setFriends] = useState<ChatFriend[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFriends, setSelectedFriends] = useState<ChatFriend[]>([]);
    const [groupName, setGroupName] = useState("");
    const [creating, setCreating] = useState(false);
    const [tab, setTab] = useState("direct");

    useEffect(() => {
        if (open) {
            loadFriends();
            setSearchQuery("");
            setSelectedFriends([]);
            setGroupName("");
            setTab("direct");
        }
    }, [open]);

    const loadFriends = async () => {
        setLoading(true);
        try {
            const data = await getFriends();
            setFriends(data);
        } catch {
            toast.error("Failed to load friends");
        } finally {
            setLoading(false);
        }
    };

    const filteredFriends = friends.filter((f) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            f.full_name.toLowerCase().includes(q) ||
            f.username.toLowerCase().includes(q)
        );
    });

    const handleDirectChat = async (friend: ChatFriend) => {
        setCreating(true);
        try {
            const conv = await getOrCreateDirectConversation(friend.user_id);
            await refreshConversations();
            onOpenChange(false);
            router.push(`/inbox/${conv.conversation_id || conv._id}`);
        } catch {
            toast.error("Failed to start conversation");
        } finally {
            setCreating(false);
        }
    };

    const toggleFriendSelection = (friend: ChatFriend) => {
        setSelectedFriends((prev) => {
            const exists = prev.find((f) => f.user_id === friend.user_id);
            if (exists) return prev.filter((f) => f.user_id !== friend.user_id);
            if (prev.length >= 19) {
                toast.error("Group chat can have up to 20 members");
                return prev;
            }
            return [...prev, friend];
        });
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            toast.error("Please enter a group name");
            return;
        }
        if (selectedFriends.length < 1) {
            toast.error("Select at least one friend");
            return;
        }
        setCreating(true);
        try {
            const conv = await createGroupConversation(
                selectedFriends.map((f) => f.user_id),
                groupName.trim()
            );
            await refreshConversations();
            onOpenChange(false);
            router.push(`/inbox/${conv.conversation_id || conv._id}`);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Failed to create group"
            );
        } finally {
            setCreating(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>New Conversation</DialogTitle>
                </DialogHeader>

                <Tabs
                    value={tab}
                    onValueChange={(v) => {
                        setTab(v);
                        setSelectedFriends([]);
                    }}
                >
                    <TabsList className="w-full">
                        <TabsTrigger value="direct" className="flex-1">
                            Direct Message
                        </TabsTrigger>
                        <TabsTrigger value="group" className="flex-1">
                            <Users className="w-4 h-4 mr-1.5" />
                            Group Chat
                        </TabsTrigger>
                    </TabsList>

                    <div className="relative mt-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search friends..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <TabsContent value="direct" className="mt-3">
                        <div className="overflow-y-auto max-h-[40vh] space-y-1">
                            {loading ? (
                                <div className="text-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                                </div>
                            ) : filteredFriends.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    {searchQuery
                                        ? "No friends found"
                                        : "No friends yet. Follow people and have them follow you back!"}
                                </div>
                            ) : (
                                filteredFriends.map((friend) => (
                                    <button
                                        key={friend.user_id}
                                        onClick={() =>
                                            handleDirectChat(friend)
                                        }
                                        disabled={creating}
                                        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                                            {friend.avatar_url ? (
                                                <img
                                                    src={friend.avatar_url}
                                                    alt={friend.full_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-primary font-semibold">
                                                    {friend.full_name[0]?.toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium text-sm">
                                                {friend.full_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                @{friend.username}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="group" className="mt-3">
                        <div className="mb-3">
                            <Input
                                placeholder="Group name..."
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                        </div>

                        {selectedFriends.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {selectedFriends.map((f) => (
                                    <button
                                        key={f.user_id}
                                        onClick={() =>
                                            toggleFriendSelection(f)
                                        }
                                        className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full hover:bg-primary/20 transition-colors"
                                    >
                                        {f.full_name}
                                        <span className="text-[10px]">✕</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="overflow-y-auto max-h-[30vh] space-y-1">
                            {loading ? (
                                <div className="text-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                                </div>
                            ) : filteredFriends.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    {searchQuery
                                        ? "No friends found"
                                        : "No friends yet"}
                                </div>
                            ) : (
                                filteredFriends.map((friend) => {
                                    const isSelected = selectedFriends.some(
                                        (f) => f.user_id === friend.user_id
                                    );
                                    return (
                                        <button
                                            key={friend.user_id}
                                            onClick={() =>
                                                toggleFriendSelection(friend)
                                            }
                                            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                                                {friend.avatar_url ? (
                                                    <img
                                                        src={friend.avatar_url}
                                                        alt={friend.full_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-primary font-semibold">
                                                        {friend.full_name[0]?.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-left flex-1">
                                                <p className="font-medium text-sm">
                                                    {friend.full_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    @{friend.username}
                                                </p>
                                            </div>
                                            <div
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                                    isSelected
                                                        ? "bg-primary border-primary"
                                                        : "border-muted-foreground/30"
                                                }`}
                                            >
                                                {isSelected && (
                                                    <Check className="w-3 h-3 text-primary-foreground" />
                                                )}
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        <Button
                            className="w-full mt-3 gap-2"
                            onClick={handleCreateGroup}
                            disabled={
                                creating ||
                                selectedFriends.length === 0 ||
                                !groupName.trim()
                            }
                        >
                            {creating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Users className="w-4 h-4" />
                            )}
                            Create Group ({selectedFriends.length} members)
                        </Button>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
