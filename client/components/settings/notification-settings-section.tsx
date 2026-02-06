"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { NotificationSettings } from "@/types";
import { Bell, Heart, MessageCircle, AtSign, UserPlus, Mail } from "lucide-react";

interface NotificationSettingsSectionProps {
    settings: NotificationSettings;
    onUpdate: (field: keyof NotificationSettings, value: boolean) => void;
}

export function NotificationSettingsSection({ settings, onUpdate }: NotificationSettingsSectionProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    <CardTitle>Notifications</CardTitle>
                </div>
                <CardDescription>
                    Choose what notifications you want to receive
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-muted-foreground" />
                            <Label htmlFor="notif-likes">Likes</Label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            When someone likes your posts
                        </p>
                    </div>
                    <Switch
                        id="notif-likes"
                        checked={settings.likes}
                        onCheckedChange={(checked) => onUpdate("likes", checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-muted-foreground" />
                            <Label htmlFor="notif-comments">Comments</Label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            When someone comments on your posts
                        </p>
                    </div>
                    <Switch
                        id="notif-comments"
                        checked={settings.comments}
                        onCheckedChange={(checked) => onUpdate("comments", checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <AtSign className="w-4 h-4 text-muted-foreground" />
                            <Label htmlFor="notif-mentions">Mentions</Label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            When someone mentions you
                        </p>
                    </div>
                    <Switch
                        id="notif-mentions"
                        checked={settings.mentions}
                        onCheckedChange={(checked) => onUpdate("mentions", checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <UserPlus className="w-4 h-4 text-muted-foreground" />
                            <Label htmlFor="notif-follows">Follows</Label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            When someone follows you
                        </p>
                    </div>
                    <Switch
                        id="notif-follows"
                        checked={settings.follows}
                        onCheckedChange={(checked) => onUpdate("follows", checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <Label htmlFor="notif-messages">Messages</Label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            When you receive a new message
                        </p>
                    </div>
                    <Switch
                        id="notif-messages"
                        checked={settings.messages}
                        onCheckedChange={(checked) => onUpdate("messages", checked)}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
