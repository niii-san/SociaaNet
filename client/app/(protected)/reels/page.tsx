"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Page() {
    return (
        <>
            <div>Reels page</div>
            
            {/* Floating Action Button */}
            <Link href="/create-reel">
                <Button 
                    size="icon"
                    className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-2xl shadow-primary/30 hover:shadow-primary/40 z-50"
                >
                    <Plus className="h-6 w-6" />
                </Button>
            </Link>
        </>
    );
}
