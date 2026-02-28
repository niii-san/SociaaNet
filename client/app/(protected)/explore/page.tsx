"use client";

import { useState } from "react";
import { Search, TrendingUp, Compass } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchDialog } from "@/components/explore/search-dialog";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

export default function ExplorePage() {
    const [searchOpen, setSearchOpen] = useState(false);

    usePageTitle("Explore");

    // Ctrl+K or / to open search
    useKeyboardShortcut(
        [{ key: "k", ctrl: true }, { key: "/" }],
        (e) => { e.preventDefault(); setSearchOpen(true); }
    );

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
                <div className="flex items-center gap-3 mb-4">
                    <Compass className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-bold">Explore</h1>
                </div>

                {/* Search Bar - Opens Dialog */}
                <div 
                    className="relative cursor-pointer"
                    onClick={() => setSearchOpen(true)}
                >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-16 cursor-pointer"
                        readOnly
                    />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>
            </header>

            <div className="container max-w-4xl mx-auto px-4 py-6">
                {/* Explore Content - Placeholder for now */}
                <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Discover Content</h3>
                    <p className="text-muted-foreground">
                        Explore trending posts, reels, and more coming soon...
                    </p>
                </div>
            </div>

            {/* Search Dialog */}
            <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
        </div>
    );
}
