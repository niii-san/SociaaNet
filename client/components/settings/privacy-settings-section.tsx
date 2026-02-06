"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PrivacySettings, PrivacyVisibility } from "@/types";
import { Shield, Lock, Eye, MessageSquare, AtSign } from "lucide-react";

interface PrivacySettingsSectionProps {
    settings: PrivacySettings;
    onUpdate: (field: keyof PrivacySettings, value: any) => void;
}

export function PrivacySettingsSection({ settings, onUpdate }: PrivacySettingsSectionProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <CardTitle>Privacy</CardTitle>
                </div>
                <CardDescription>
                    Manage who can see your content and interact with you
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-muted-foreground" />
                            <Label htmlFor="private-account">Private Account</Label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Only approved followers can see your posts
                        </p>
                    </div>
                    <Switch
                        id="private-account"
                        checked={settings.private_account}
                        onCheckedChange={(checked) => onUpdate("private_account", checked)}
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <Label>Allow Messages From</Label>
                    </div>
                    <Select
                        value={settings.allow_messages_from}
                        onValueChange={(value: PrivacyVisibility) => onUpdate("allow_messages_from", value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="everyone">Everyone</SelectItem>
                            <SelectItem value="followers_only">Followers Only</SelectItem>
                            <SelectItem value="no_one">No One</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-3">
                    <Label>Allow Comments From</Label>
                    <Select
                        value={settings.allow_comments_from}
                        onValueChange={(value: PrivacyVisibility) => onUpdate("allow_comments_from", value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="everyone">Everyone</SelectItem>
                            <SelectItem value="followers_only">Followers Only</SelectItem>
                            <SelectItem value="no_one">No One</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <AtSign className="w-4 h-4 text-muted-foreground" />
                        <Label>Allow Mentions From</Label>
                    </div>
                    <Select
                        value={settings.allow_mentions_from}
                        onValueChange={(value: PrivacyVisibility) => onUpdate("allow_mentions_from", value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="everyone">Everyone</SelectItem>
                            <SelectItem value="followers_only">Followers Only</SelectItem>
                            <SelectItem value="no_one">No One</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            <Label htmlFor="online-status">Show Online Status</Label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Let others see when you're active
                        </p>
                    </div>
                    <Switch
                        id="online-status"
                        checked={settings.show_online_status}
                        onCheckedChange={(checked) => onUpdate("show_online_status", checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="last-seen">Show Last Seen</Label>
                        <p className="text-sm text-muted-foreground">
                            Display your last activity time
                        </p>
                    </div>
                    <Switch
                        id="last-seen"
                        checked={settings.show_last_seen}
                        onCheckedChange={(checked) => onUpdate("show_last_seen", checked)}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
