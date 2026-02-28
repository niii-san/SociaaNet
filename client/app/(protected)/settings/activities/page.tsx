"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import Link from "next/link";
import { ChevronRight, Heart, MessageSquare, Repeat2, History, ShieldCheck } from "lucide-react";

const activityOptions = [
    {
        title: "Likes",
        description: "Posts and content you've liked",
        icon: Heart,
        href: "/settings/activities/likes",
        iconColor: "text-pink-500",
        bgColor: "bg-pink-500/10"
    },
    {
        title: "Comments",
        description: "Your comments on posts",
        icon: MessageSquare,
        href: "/settings/activities/comments",
        iconColor: "text-blue-500",
        bgColor: "bg-blue-500/10"
    },
    {
        title: "Reposts",
        description: "Content you've shared",
        icon: Repeat2,
        href: "/settings/activities/reposts",
        iconColor: "text-green-500",
        bgColor: "bg-green-500/10"
    },
    {
        title: "Watch History",
        description: "Videos and reels you've watched",
        icon: History,
        href: "/settings/activities/watch-history",
        iconColor: "text-purple-500",
        bgColor: "bg-purple-500/10"
    },
    {
        title: "Account Activities",
        description: "Your account actions and security events",
        icon: ShieldCheck,
        href: "/settings/activities/account",
        iconColor: "text-orange-500",
        bgColor: "bg-orange-500/10"
    }
];

export default function ActivitiesPage() {
    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
                <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-bold">Your Activities</h1>
                </div>
            </header>

            <div className="container max-w-3xl mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Activity Types</CardTitle>
                        <CardDescription>
                            View and manage your activity across SociaaNet
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {activityOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                                <Link
                                    key={option.href}
                                    href={option.href}
                                    className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/20 dark:hover:border-blue-800 transition-colors group"
                                >
                                    <div className={`p-3 rounded-full ${option.bgColor}`}>
                                        <Icon className={`w-5 h-5 ${option.iconColor}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{option.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {option.description}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                </Link>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
