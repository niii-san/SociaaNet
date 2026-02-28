"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Clapperboard } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Page() {
    usePageTitle("Reels");

    return (
        <div className="min-h-screen bg-background pb-12">
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Clapperboard className="w-6 h-6 text-primary" />
                        <h1 className="text-2xl font-bold">Reels</h1>
                    </div>
                    <Link href="/create-reel">
                        <Button size="sm" className="gap-2">
                            <Plus className="w-4 h-4" />
                            Create
                        </Button>
                    </Link>
                </div>
            </header>
            <div className="container max-w-2xl mx-auto px-4 py-6">
                <div className="text-center py-16">
                    <Clapperboard className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Discover Reels</h3>
                    <p className="text-muted-foreground mb-6">
                        Short videos from creators you follow will appear here.
                    </p>
                    <Link href="/create-reel">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Create Your First Reel
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
