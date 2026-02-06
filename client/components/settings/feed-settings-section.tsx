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
import { FeedSettings, FeedMode } from "@/types";
import { LayoutList, Sparkles, Clock, AlertTriangle } from "lucide-react";

interface FeedSettingsSectionProps {
    settings: FeedSettings;
    onUpdate: (field: keyof FeedSettings, value: any) => void;
}

export function FeedSettingsSection({ settings, onUpdate }: FeedSettingsSectionProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <LayoutList className="w-5 h-5 text-primary" />
                    <CardTitle>Feed</CardTitle>
                </div>
                <CardDescription>
                    Customize your feed experience
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <Label>Feed Mode</Label>
                    <Select
                        value={settings.mode}
                        onValueChange={(value: FeedMode) => onUpdate("mode", value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="algorithmic">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    <span>Algorithmic</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="chronological">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Chronological</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                        {settings.mode === "algorithmic"
                            ? "See posts recommended for you"
                            : "See posts in order from newest to oldest"}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                            <Label htmlFor="sensitive-content">Show Sensitive Content</Label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Display posts marked as sensitive
                        </p>
                    </div>
                    <Switch
                        id="sensitive-content"
                        checked={settings.show_sensitive_content}
                        onCheckedChange={(checked) => onUpdate("show_sensitive_content", checked)}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
