"use client";

import { useEffect, useState } from "react";
import { getUserActivities } from "@/features/activities/activities.api";
import { Activity } from "@/types";
import { MiniLoader } from "@/components/ui/mini-loader";
import { ActivityItem } from "@/components/activities/activity-item";
import { ShieldCheck, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AccountActivitiesPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await getUserActivities();
                setActivities(data);
            } catch (error) {
                console.error("Failed to fetch activities:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const filteredActivities = activities.filter((activity) => {
        if (filter === "all") return true;
        if (filter === "security") return ["logged_in", "logged_out", "password_changed", "email_updated"].includes(activity.verb);
        if (filter === "profile") return ["username_updated", "full_name_updated", "bio_updated", "avatar_updated"].includes(activity.verb);
        return true;
    });

    // Group activities by date
    const groupedActivities = filteredActivities.reduce((acc, activity) => {
        const date = new Date(activity.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(activity);
        return acc;
    }, {} as Record<string, Activity[]>);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <MiniLoader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                        <div>
                            <h1 className="text-2xl font-bold">Account Activities</h1>
                            <p className="text-sm text-muted-foreground">
                                {activities.length} {activities.length === 1 ? "activity" : "activities"} recorded
                            </p>
                        </div>
                    </div>
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[160px]">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Activities</SelectItem>
                            <SelectItem value="security">Security</SelectItem>
                            <SelectItem value="profile">Profile</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </header>

            <div className="container max-w-4xl mx-auto px-4 py-8">
                {filteredActivities.length === 0 ? (
                    <div className="text-center py-12">
                        <ShieldCheck className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Activities Found</h3>
                        <p className="text-muted-foreground">
                            {filter !== "all" 
                                ? "Try changing your filter to see more activities"
                                : "Your account activities will appear here"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupedActivities).map(([date, dateActivities]) => (
                            <div key={date} className="space-y-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>{date}</span>
                                </div>
                                <div className="space-y-3">
                                    {dateActivities.map((activity) => (
                                        <ActivityItem key={activity.activity_id} activity={activity} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
