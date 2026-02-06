"use client";

import { useAuth } from "@/contexts";
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
import { toast } from "sonner";
import {
    PrivacySettings,
    NotificationSettings,
    AppearanceSettings,
    FeedSettings,
    SecuritySettings
} from "@/types";
import { Settings as SettingsIcon, Search } from "lucide-react";

export default function SettingsPage() {
    const { settings, refetchSettings } = useAuth();
    const [updating, setUpdating] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    if (!settings) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <MiniLoader />
            </div>
        );
    }

    const handlePrivacyUpdate = async (field: keyof PrivacySettings, value: any) => {
        setUpdating(true);
        try {
            await updatePrivacySettings({ [field]: value });
            await refetchSettings();
            toast.success("Privacy settings updated");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update settings");
        } finally {
            setUpdating(false);
        }
    };

    const handleNotificationUpdate = async (field: keyof NotificationSettings, value: boolean) => {
        setUpdating(true);
        try {
            await updateNotificationSettings({ [field]: value });
            await refetchSettings();
            toast.success("Notification settings updated");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update settings");
        } finally {
            setUpdating(false);
        }
    };

    const handleAppearanceUpdate = async (field: keyof AppearanceSettings, value: any) => {
        setUpdating(true);
        try {
            await updateAppearanceSettings({ [field]: value });
            await refetchSettings();
            toast.success("Appearance settings updated");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update settings");
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
            toast.error(error?.response?.data?.message || "Failed to update settings");
        } finally {
            setUpdating(false);
        }
    };

    const handleSecurityUpdate = async (field: keyof SecuritySettings, value: any) => {
        setUpdating(true);
        try {
            await updateSecuritySettings({ [field]: value });
            await refetchSettings();
            toast.success("Security settings updated");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update settings");
        } finally {
            setUpdating(false);
        }
    };

    // Filter sections based on search query
    const searchLower = searchQuery.toLowerCase();
    const showPrivacy = searchLower === "" || 
        "privacy".includes(searchLower) || 
        "private account".includes(searchLower) ||
        "messages".includes(searchLower) ||
        "comments".includes(searchLower) ||
        "mentions".includes(searchLower) ||
        "online status".includes(searchLower) ||
        "last seen".includes(searchLower);
    
    const showNotifications = searchLower === "" ||
        "notification".includes(searchLower) ||
        "likes".includes(searchLower) ||
        "comments".includes(searchLower) ||
        "mentions".includes(searchLower) ||
        "follows".includes(searchLower) ||
        "messages".includes(searchLower);
    
    const showAppearance = searchLower === "" ||
        "appearance".includes(searchLower) ||
        "theme".includes(searchLower) ||
        "light".includes(searchLower) ||
        "dark".includes(searchLower);
    
    const showFeed = searchLower === "" ||
        "feed".includes(searchLower) ||
        "algorithmic".includes(searchLower) ||
        "chronological".includes(searchLower) ||
        "sensitive".includes(searchLower);
    
    const showSecurity = searchLower === "" ||
        "security".includes(searchLower) ||
        "login".includes(searchLower) ||
        "sessions".includes(searchLower) ||
        "alerts".includes(searchLower);

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
                
                {!showPrivacy && !showNotifications && !showAppearance && !showFeed && !showSecurity && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No settings found matching "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}
