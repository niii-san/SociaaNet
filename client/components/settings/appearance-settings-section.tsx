"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AppearanceSettings, ThemeMode } from "@/types";
import { Palette, Sun, Moon, Monitor } from "lucide-react";

interface AppearanceSettingsSectionProps {
    settings: AppearanceSettings;
    onUpdate: (field: keyof AppearanceSettings, value: ThemeMode) => void;
}

export function AppearanceSettingsSection({ settings, onUpdate }: AppearanceSettingsSectionProps) {
    const getThemeIcon = (theme: ThemeMode) => {
        switch (theme) {
            case "light":
                return <Sun className="w-4 h-4" />;
            case "dark":
                return <Moon className="w-4 h-4" />;
            case "system":
                return <Monitor className="w-4 h-4" />;
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary" />
                    <CardTitle>Appearance</CardTitle>
                </div>
                <CardDescription>
                    Customize how SociaaNet looks for you
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        {getThemeIcon(settings.theme)}
                        <Label>Theme</Label>
                    </div>
                    <Select
                        value={settings.theme}
                        onValueChange={(value: ThemeMode) => onUpdate("theme", value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">
                                <div className="flex items-center gap-2">
                                    <Sun className="w-4 h-4" />
                                    <span>Light</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="dark">
                                <div className="flex items-center gap-2">
                                    <Moon className="w-4 h-4" />
                                    <span>Dark</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="system">
                                <div className="flex items-center gap-2">
                                    <Monitor className="w-4 h-4" />
                                    <span>System</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                        Choose your preferred color scheme
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
