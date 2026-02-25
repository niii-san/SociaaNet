"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SecuritySettings } from "@/types";
import { ShieldCheck, Monitor, MapPin, Clock, LogOut, KeyRound, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    logoutSession,
    logoutAllSessions
} from "@/features/settings/settings.api";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface SecuritySettingsSectionProps {
    settings: SecuritySettings;
    onUpdate: (field: keyof SecuritySettings, value: any) => void;
    onSessionLogout: () => void;
}

export function SecuritySettingsSection({
    settings,
    onUpdate,
    onSessionLogout
}: SecuritySettingsSectionProps) {
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState<number | null>(null);
    const [loggingOutAll, setLoggingOutAll] = useState(false);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString();
    };

    const handleLogoutSession = async (index: number) => {
        setLoggingOut(index);
        try {
            await logoutSession(index);
            toast.success("Session logged out successfully");
            onSessionLogout();
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Failed to logout session"
            );
        } finally {
            setLoggingOut(null);
        }
    };

    const handleLogoutAllSessions = async () => {
        setLoggingOutAll(true);
        try {
            await logoutAllSessions();
            toast.success("All sessions logged out successfully");
            // This will likely redirect to login as current session is also terminated
            window.location.href = "/login";
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    "Failed to logout all sessions"
            );
        } finally {
            setLoggingOutAll(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <CardTitle>Security</CardTitle>
                </div>
                <CardDescription>
                    Manage your account security and active sessions
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Change Password */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-card/50">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <KeyRound className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold mb-1">
                                Change Password
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Update your password to keep your account secure
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => router.push("/settings/change-password")}
                        variant="outline"
                        size="sm"
                        className="gap-1 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors"
                    >
                        Change
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>

                {/* Login Alerts */}
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="login-alerts">Login Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                            Get notified when someone logs into your account
                        </p>
                    </div>
                    <Switch
                        id="login-alerts"
                        checked={settings.login_alerts}
                        onCheckedChange={(checked) =>
                            onUpdate("login_alerts", checked)
                        }
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-semibold mb-2">
                                Active Sessions
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Devices where you're currently logged in
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleLogoutAllSessions}
                            disabled={loggingOutAll}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            {loggingOutAll ? "Logging out..." : "Logout All"}
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {settings.sessions.map((session, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-4 rounded-lg border bg-card"
                            >
                                <div className="mt-1">
                                    <Monitor className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">
                                            {session.device}
                                        </p>
                                        {index === 0 && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                Current
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            <span>{session.ip}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>
                                                {formatDate(
                                                    session.last_activity
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleLogoutSession(index)}
                                    disabled={loggingOut === index}
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    {loggingOut === index
                                        ? "Logging out..."
                                        : "Logout"}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
