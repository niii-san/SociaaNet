"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatConversation, ChatFriend } from "@/types";
import { useAuth } from "@/contexts";
import { useChat } from "@/contexts/chat.context";
import {
    getFriends,
    addParticipant,
    removeParticipant,
    updateGroupName,
    getUsersActivity,
    deleteConversation as deleteConversationAPI
} from "@/features/chat/chat.api";
import {
    Users,
    UserPlus,
    Crown,
    LogOut,
    Pencil,
    Check,
    X,
    Loader2,
    Search,
    Trash2
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function formatLastActive(dateStr: string | null): string {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Active just now";
    if (diffMins < 60) return `Active ${diffMins}m ago`;
    if (diffHours < 24) return `Active ${diffHours}h ago`;
    if (diffDays < 7) return `Active ${diffDays}d ago`;
    return `Active ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

interface GroupInfoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    conversation: ChatConversation;
    onConversationUpdate: () => void;
}

export function GroupInfoDialog({
    open,
    onOpenChange,
    conversation,
    onConversationUpdate
}: GroupInfoDialogProps) {
    const { data: currentUser, settings: userSettings } = useAuth();
    const { onlineUsers } = useChat();
    const router = useRouter();
    const myActivityOff =
        userSettings?.privacy?.show_activity_status === false;
    const [editingName, setEditingName] = useState(false);
    const [newName, setNewName] = useState(conversation.group_name || "");
    const [showAddMember, setShowAddMember] = useState(false);
    const [friends, setFriends] = useState<ChatFriend[]>([]);
    const [friendSearch, setFriendSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [activityData, setActivityData] = useState<
        Record<
            string,
            {
                is_online: boolean;
                last_active_at: string | null;
                show_activity_status: boolean;
            }
        >
    >({});

    const isAdmin = conversation.group_admin === currentUser?.user_id;
    const isGroup = conversation.type === "group";

    // Fetch activity status for all participants when dialog opens
    useEffect(() => {
        if (!open) return;
        const userIds = conversation.participants
            .filter((p) => p.user_id !== currentUser?.user_id)
            .map((p) => p.user_id);
        if (userIds.length === 0) return;
        getUsersActivity(userIds)
            .then(setActivityData)
            .catch(() => {});
    }, [open, conversation.participants, currentUser?.user_id]);

    const isParticipantOnline = (userId: string): boolean => {
        if (myActivityOff) return false;
        const activity = activityData[userId];
        if (!activity) return onlineUsers.has(userId);
        if (!activity.show_activity_status) return false;
        return activity.is_online || onlineUsers.has(userId);
    };

    const showParticipantActivity = (userId: string): boolean => {
        if (myActivityOff) return false;
        const activity = activityData[userId];
        if (!activity) return true;
        return activity.show_activity_status;
    };

    useEffect(() => {
        if (showAddMember) {
            loadFriends();
        }
    }, [showAddMember]);

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

    const handleUpdateName = async () => {
        if (!newName.trim() || newName === conversation.group_name) {
            setEditingName(false);
            return;
        }
        try {
            await updateGroupName(
                conversation.conversation_id,
                newName.trim()
            );
            toast.success("Group name updated");
            setEditingName(false);
            onConversationUpdate();
        } catch {
            toast.error("Failed to update group name");
        }
    };

    const handleAddMember = async (userId: string) => {
        try {
            await addParticipant(conversation.conversation_id, userId);
            toast.success("Member added");
            onConversationUpdate();
            setShowAddMember(false);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Failed to add member"
            );
        }
    };

    const handleRemoveMember = async (userId: string) => {
        try {
            await removeParticipant(conversation.conversation_id, userId);
            toast.success("Member removed");
            onConversationUpdate();
        } catch {
            toast.error("Failed to remove member");
        }
    };

    const handleLeaveGroup = async () => {
        if (!currentUser) return;
        try {
            await removeParticipant(
                conversation.conversation_id,
                currentUser.user_id
            );
            toast.success("Left group");
            onOpenChange(false);
            router.push("/inbox");
        } catch {
            toast.error("Failed to leave group");
        }
    };

    const handleDeleteChat = async () => {
        try {
            setDeleting(true);
            await deleteConversationAPI(conversation.conversation_id);
            toast.success("Chat deleted");
            onOpenChange(false);
            router.push("/inbox");
        } catch {
            toast.error("Failed to delete chat");
        } finally {
            setDeleting(false);
        }
    };

    const existingMemberIds = new Set(
        conversation.participants.map((p) => p.user_id)
    );
    const availableFriends = friends.filter(
        (f) =>
            !existingMemberIds.has(f.user_id) &&
            (friendSearch
                ? f.full_name
                      .toLowerCase()
                      .includes(friendSearch.toLowerCase()) ||
                  f.username
                      .toLowerCase()
                      .includes(friendSearch.toLowerCase())
                : true)
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        {isGroup ? "Group Info" : "Chat Info"}
                    </DialogTitle>
                </DialogHeader>

                {isGroup && (
                    <div className="space-y-4">
                        {/* Group name */}
                        <div className="flex items-center gap-2">
                            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center shrink-0">
                                <Users className="w-6 h-6 text-muted-foreground" />
                            </div>
                            {editingName ? (
                                <div className="flex items-center gap-1.5 flex-1">
                                    <Input
                                        value={newName}
                                        onChange={(e) =>
                                            setNewName(e.target.value)
                                        }
                                        className="h-8 text-sm"
                                        autoFocus
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8"
                                        onClick={handleUpdateName}
                                    >
                                        <Check className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8"
                                        onClick={() => {
                                            setEditingName(false);
                                            setNewName(
                                                conversation.group_name || ""
                                            );
                                        }}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 flex-1">
                                    <h3 className="font-semibold text-lg">
                                        {conversation.group_name}
                                    </h3>
                                    {isAdmin && (
                                        <button
                                            onClick={() =>
                                                setEditingName(true)
                                            }
                                            className="text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Members */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium text-muted-foreground">
                                    Members ({conversation.participants.length})
                                </h4>
                                {isAdmin &&
                                    conversation.participants.length < 20 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="gap-1.5 h-7 text-xs"
                                            onClick={() =>
                                                setShowAddMember(!showAddMember)
                                            }
                                        >
                                            <UserPlus className="w-3.5 h-3.5" />
                                            Add
                                        </Button>
                                    )}
                            </div>

                            {/* Add member panel */}
                            {showAddMember && (
                                <div className="mb-3 p-3 rounded-lg border border-border bg-muted/30">
                                    <div className="relative mb-2">
                                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                        <Input
                                            placeholder="Search friends..."
                                            value={friendSearch}
                                            onChange={(e) =>
                                                setFriendSearch(e.target.value)
                                            }
                                            className="h-8 pl-8 text-xs"
                                        />
                                    </div>
                                    <div className="max-h-32 overflow-y-auto space-y-1">
                                        {loading ? (
                                            <div className="flex justify-center py-4">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            </div>
                                        ) : availableFriends.length === 0 ? (
                                            <p className="text-xs text-muted-foreground text-center py-3">
                                                No friends to add
                                            </p>
                                        ) : (
                                            availableFriends.map((f) => (
                                                <button
                                                    key={f.user_id}
                                                    onClick={() =>
                                                        handleAddMember(
                                                            f.user_id
                                                        )
                                                    }
                                                    className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-muted/50 text-left"
                                                >
                                                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                                                        {f.avatar_url ? (
                                                            <img
                                                                src={
                                                                    f.avatar_url
                                                                }
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-[10px] font-semibold text-primary">
                                                                {f.full_name[0]?.toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium">
                                                            {f.full_name}
                                                        </p>
                                                        <p className="text-[10px] text-muted-foreground">
                                                            @{f.username}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Members list */}
                            <div className="space-y-1 overflow-y-auto max-h-48">
                                {conversation.participants.map((p) => {
                                    const isParticipantAdmin =
                                        p.user_id ===
                                        conversation.group_admin;
                                    const isMe =
                                        p.user_id === currentUser?.user_id;
                                    const participantOnline = !isMe && isParticipantOnline(p.user_id);
                                    const showActivity = isMe || showParticipantActivity(p.user_id);

                                    return (
                                        <div
                                            key={p.user_id}
                                            className="flex items-center gap-3 p-2 rounded-lg"
                                        >
                                            <div className="relative shrink-0">
                                                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                                    {p.avatar_url ? (
                                                        <img
                                                            src={p.avatar_url}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-xs font-semibold text-primary">
                                                            {p.full_name[0]?.toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                {participantOnline && showActivity && (
                                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="text-sm font-medium truncate">
                                                        {p.full_name}
                                                        {isMe && (
                                                            <span className="text-muted-foreground">
                                                                {" "}
                                                                (you)
                                                            </span>
                                                        )}
                                                    </p>
                                                    {isParticipantAdmin && (
                                                        <Crown className="w-3 h-3 text-amber-500 shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    @{p.username}
                                                </p>
                                            </div>
                                            {isAdmin &&
                                                !isMe &&
                                                !isParticipantAdmin && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
                                                        onClick={() =>
                                                            handleRemoveMember(
                                                                p.user_id
                                                            )
                                                        }
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </Button>
                                                )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Leave group */}
                        {!isAdmin && (
                            <Button
                                variant="ghost"
                                className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={handleLeaveGroup}
                            >
                                <LogOut className="w-4 h-4" />
                                Leave Group
                            </Button>
                        )}

                        {/* Delete group (admin only) */}
                        {isAdmin && (
                            <Button
                                variant="ghost"
                                className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={handleDeleteChat}
                                disabled={deleting}
                            >
                                {deleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                                Delete Group
                            </Button>
                        )}
                    </div>
                )}

                {/* Direct chat info */}
                {!isGroup && (
                    <div className="space-y-4">
                        {conversation.participants
                            .filter(
                                (p) => p.user_id !== currentUser?.user_id
                            )
                            .map((p) => {
                                const online = isParticipantOnline(p.user_id);
                                const showAct = showParticipantActivity(p.user_id);
                                const activity = activityData[p.user_id];

                                return (
                                    <div
                                        key={p.user_id}
                                        className="flex flex-col items-center gap-3 py-4"
                                    >
                                        <div className="relative">
                                            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                                {p.avatar_url ? (
                                                    <img
                                                        src={p.avatar_url}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-2xl font-bold text-primary">
                                                        {p.full_name[0]?.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            {online && showAct && (
                                                <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <h3 className="font-semibold text-lg">
                                                {p.full_name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                @{p.username}
                                            </p>
                                            {showAct && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {online
                                                        ? "Active now"
                                                        : activity?.last_active_at
                                                          ? formatLastActive(activity.last_active_at)
                                                          : "Offline"}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                        {/* Delete chat */}
                        <Button
                            variant="ghost"
                            className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={handleDeleteChat}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Trash2 className="w-4 h-4" />
                            )}
                            Delete Chat
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
