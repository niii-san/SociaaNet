"use client";

import { Bell } from "lucide-react";

export default function Page() {
    return (
        <div className="min-h-screen bg-background pb-12">
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
                <div className="flex items-center gap-3">
                    <Bell className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-bold">Notifications</h1>
                </div>
            </header>
            <div className="container max-w-2xl mx-auto px-4 py-6">
                <div className="text-center py-16">
                    <Bell className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
                    <p className="text-muted-foreground">
                        When someone interacts with you, you&apos;ll see it here.
                    </p>
                </div>
            </div>
        </div>
    );
}
