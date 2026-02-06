"use client";

import { Activity } from "@/types";
import {
    LogIn,
    User,
    AtSign,
    FileText,
    Shield,
    Key,
    Mail,
    Camera,
    Settings,
    AlertCircle
} from "lucide-react";

interface ActivityItemProps {
    activity: Activity;
}

const getActivityIcon = (verb: string) => {
    const iconMap: Record<string, any> = {
        logged_in: LogIn,
        logged_out: LogIn,
        username_updated: AtSign,
        full_name_updated: User,
        bio_updated: FileText,
        password_changed: Key,
        email_updated: Mail,
        avatar_updated: Camera,
        settings_updated: Settings,
        security_alert: AlertCircle
    };
    return iconMap[verb] || Shield;
};

const getActivityColor = (verb: string) => {
    const colorMap: Record<string, { icon: string; bg: string }> = {
        logged_in: { icon: "text-green-500", bg: "bg-green-500/10" },
        logged_out: { icon: "text-gray-500", bg: "bg-gray-500/10" },
        username_updated: { icon: "text-blue-500", bg: "bg-blue-500/10" },
        full_name_updated: { icon: "text-purple-500", bg: "bg-purple-500/10" },
        bio_updated: { icon: "text-indigo-500", bg: "bg-indigo-500/10" },
        password_changed: { icon: "text-orange-500", bg: "bg-orange-500/10" },
        email_updated: { icon: "text-cyan-500", bg: "bg-cyan-500/10" },
        avatar_updated: { icon: "text-pink-500", bg: "bg-pink-500/10" },
        settings_updated: { icon: "text-violet-500", bg: "bg-violet-500/10" },
        security_alert: { icon: "text-red-500", bg: "bg-red-500/10" }
    };
    return colorMap[verb] || { icon: "text-primary", bg: "bg-primary/10" };
};

const formatVerb = (verb: string) => {
    return verb
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const formatDate = (date: string) => {
    const activityDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - activityDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return activityDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: activityDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined
    });
};

const getMetadataDisplay = (verb: string, metadata: Record<string, any>) => {
    switch (verb) {
        case "logged_in":
        case "logged_out":
            return (
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {metadata.device && (
                        <p className="flex items-center gap-1">
                            <span className="font-medium">Device:</span> {metadata.device}
                        </p>
                    )}
                    {metadata.ip && (
                        <p className="flex items-center gap-1">
                            <span className="font-medium">IP:</span> {metadata.ip}
                        </p>
                    )}
                </div>
            );
        case "username_updated":
            return (
                <div className="mt-2 text-sm">
                    <p className="text-muted-foreground">
                        New username: <span className="font-medium text-foreground">@{metadata.new_username}</span>
                    </p>
                </div>
            );
        case "full_name_updated":
            return (
                <div className="mt-2 text-sm">
                    <p className="text-muted-foreground">
                        New name: <span className="font-medium text-foreground">{metadata.new_full_name}</span>
                    </p>
                </div>
            );
        case "bio_updated":
            return (
                <div className="mt-2 text-sm">
                    <p className="text-muted-foreground">
                        New bio: <span className="font-medium text-foreground italic">"{metadata.new_bio}"</span>
                    </p>
                </div>
            );
        default:
            return null;
    }
};

export function ActivityItem({ activity }: ActivityItemProps) {
    const Icon = getActivityIcon(activity.verb);
    const colors = getActivityColor(activity.verb);

    return (
        <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/20 dark:hover:border-blue-800 transition-colors">
            <div className={`p-3 rounded-full ${colors.bg} shrink-0`}>
                <Icon className={`w-5 h-5 ${colors.icon}`} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{formatVerb(activity.verb)}</h3>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(activity.created_at)}
                    </span>
                </div>
                {getMetadataDisplay(activity.verb, activity.metadata)}
            </div>
        </div>
    );
}
