"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function GlobalError({
    error,
    reset
}: {
    error: Error;
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
        toast.error(error.message || "Something went wrong");
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <button onClick={() => reset()} className="btn">
                Try again
            </button>
        </div>
    );
}
