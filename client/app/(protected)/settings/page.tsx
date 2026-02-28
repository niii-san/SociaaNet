"use client";

import { useAuth, useTheme } from "@/contexts";
import { useState, useMemo } from "react";
import { MiniLoader } from "@/components/ui/mini-loader";
import { Input } from "@/components/ui/input";
import { PrivacySettingsSection } from "@/components/settings/privacy-settings-section";
import { NotificationSettingsSection } from "@/components/settings/notification-settings-section";
import { AppearanceSettingsSection } from "@/components/settings/appearance-settings-section";
import { FeedSettingsSection } from "@/components/settings/feed-settings-section";
import { SecuritySettingsSection } from "@/components/settings/security-settings-section";
import {
    updatePrivacySettings,
    updateNotificationSettings,
    updateAppearanceSettings,
    updateFeedSettings,
    updateSecuritySettings
} from "@/features/settings/settings.api";
import { logoutUser } from "@/features/auth/auth.api";
import { toast } from "sonner";
import {
    PrivacySettings,
    NotificationSettings,
    AppearanceSettings,
    FeedSettings,
    SecuritySettings
} from "@/types";
import {
    Settings as SettingsIcon,
    Search,
    Activity,
    ChevronRight,
    History,
    Clock,
    LogOut
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
    const { settings, refetchSettings, invalidateCurrentUser } = useAuth();
    const { setTheme } = useTheme();
    const [updating, setUpdating] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    if (!settings) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <MiniLoader />
            </div>
        );
    }

    const handlePrivacyUpdate = async (
        field: keyof PrivacySettings,
        value: any
    ) => {
        setUpdating(true);
        try {
            await updatePrivacySettings({ [field]: value });
            await refetchSettings();
            await invalidateCurrentUser();
            toast.success("Privacy settings updated");
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Failed to update settings"
            );
        } finally {
            setUpdating(false);
        }
    };

    const handleNotificationUpdate = async (
        field: keyof NotificationSettings,
        value: boolean
    ) => {
        setUpdating(true);
        try {
            await updateNotificationSettings({ [field]: value });
            await refetchSettings();
            toast.success("Notification settings updated");
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Failed to update settings"
            );
        } finally {
            setUpdating(false);
        }
    };

    const handleAppearanceUpdate = async (
        field: keyof AppearanceSettings,
        value: any
    ) => {
        // Apply theme instantly for smooth UX
        if (field === "theme") {
            setTheme(value);
        }
        setUpdating(true);
        try {
            await updateAppearanceSettings({ [field]: value });
            await refetchSettings();
            toast.success("Appearance settings updated");
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Failed to update settings"
            );
        } finally {
            setUpdating(false);
        }
    };

    const handleFeedUpdate = async (field: keyof FeedSettings, value: any) => {
        setUpdating(true);
        try {
            await updateFeedSettings({ [field]: value });
            await refetchSettings();
            toast.success("Feed settings updated");
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Failed to update settings"
            );
        } finally {
            setUpdating(false);
        }
    };

    const handleSecurityUpdate = async (
        field: keyof SecuritySettings,
        value: any
    ) => {
        setUpdating(true);
        try {
            await updateSecuritySettings({ [field]: value });
            await refetchSettings();
            toast.success("Security settings updated");
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Failed to update settings"
            );
        } finally {
            setUpdating(false);
        }
    };

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await logoutUser();
            toast.success("Logged out successfully");
            // Redirect to login page
            router.push("/login");
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Failed to logout"
            );
        } finally {
            setLoggingOut(false);
        }
    };

    // Filter sections based on search query
    const searchLower = searchQuery.toLowerCase();
    const showPrivacy =
        searchLower === "" ||
        "privacy".includes(searchLower) ||
        "private account".includes(searchLower) ||
        "messages".includes(searchLower) ||
        "comments".includes(searchLower) ||
        "mentions".includes(searchLower) ||
        "online status".includes(searchLower) ||
        "last seen".includes(searchLower);

    const showNotifications =
        searchLower === "" ||
        "notification".includes(searchLower) ||
        "likes".includes(searchLower) ||
        "comments".includes(searchLower) ||
        "mentions".includes(searchLower) ||
        "follows".includes(searchLower) ||
        "messages".includes(searchLower);

    const showAppearance =
        searchLower === "" ||
        "appearance".includes(searchLower) ||
        "theme".includes(searchLower) ||
        "light".includes(searchLower) ||
        "dark".includes(searchLower);

    const showFeed =
        searchLower === "" ||
        "feed".includes(searchLower) ||
        "algorithmic".includes(searchLower) ||
        "chronological".includes(searchLower) ||
        "sensitive".includes(searchLower);

    const showSecurity =
        searchLower === "" ||
        "security".includes(searchLower) ||
        "password".includes(searchLower) ||
        "change password".includes(searchLower) ||
        "login".includes(searchLower) ||
        "sessions".includes(searchLower) ||
        "alerts".includes(searchLower);

    const showActivities =
        searchLower === "" ||
        "activities".includes(searchLower) ||
        "activity".includes(searchLower) ||
        "history".includes(searchLower) ||
        "account".includes(searchLower) ||
        "login".includes(searchLower) ||
        "track".includes(searchLower);

    const showLogout =
        searchLower === "" ||
        "logout".includes(searchLower) ||
        "log out".includes(searchLower) ||
        "sign out".includes(searchLower);

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
                <div className="flex items-center gap-3 mb-4">
                    <SettingsIcon className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-bold">Settings</h1>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search settings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </header>

            <div className="container max-w-3xl mx-auto px-4 py-8 space-y-6">
                {showActivities && (
                    <Card className="p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="p-3 rounded-lg bg-muted">
                                    <Activity className="w-5 h-5 text-foreground" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold mb-1">
                                        Your Activities
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Track your account activities, logins,
                                        profile updates, and security events
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={() =>
                                    router.push("/settings/activities")
                                }
                                variant="outline"
                                className="gap-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-950/20 dark:hover:text-blue-400 dark:hover:border-blue-800 transition-colors"
                            >
                                View
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                )}

                {showPrivacy && (
                    <PrivacySettingsSection
                        settings={settings.privacy}
                        onUpdate={handlePrivacyUpdate}
                    />
                )}

                {showNotifications && (
                    <NotificationSettingsSection
                        settings={settings.notifications}
                        onUpdate={handleNotificationUpdate}
                    />
                )}

                {showAppearance && (
                    <AppearanceSettingsSection
                        settings={settings.appearance}
                        onUpdate={handleAppearanceUpdate}
                    />
                )}

                {showFeed && (
                    <FeedSettingsSection
                        settings={settings.feed}
                        onUpdate={handleFeedUpdate}
                    />
                )}

                {showSecurity && (
                    <SecuritySettingsSection
                        settings={settings.security}
                        onUpdate={handleSecurityUpdate}
                        onSessionLogout={refetchSettings}
                    />
                )}

                {showLogout && (
                    <Card className="p-6 border-destructive/50">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="p-3 rounded-lg bg-destructive/10">
                                    <LogOut className="w-5 h-5 text-destructive" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold mb-1">
                                        Logout
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Sign out of your account on this device
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={handleLogout}
                                disabled={loggingOut}
                                variant="destructive"
                                className="gap-2 min-w-30"
                            >
                                <LogOut className="w-4 h-4" />
                                {loggingOut ? "Logging out..." : "Logout"}
                            </Button>
                        </div>
                    </Card>
                )}

                {!showActivities &&
                    !showPrivacy &&
                    !showNotifications &&
                    !showAppearance &&
                    !showFeed &&
                    !showSecurity &&
                    !showLogout && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                No settings found matching "{searchQuery}"
                            </p>
                        </div>
                    )}
            </div>
        </div>
    );
}
