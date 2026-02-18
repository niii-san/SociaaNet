"use client";

import { SearchUser } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";

interface UserSearchResultProps {
    user: SearchUser;
}

export function UserSearchResult({ user }: UserSearchResultProps) {
    const isLocalhost = user.avatar_url?.includes('localhost');
    
    return (
        <Link
            href={`/u/${user.username}`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/20 dark:hover:border-blue-800 transition-colors border border-transparent"
        >
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0">
                {isLocalhost ? (
                    // Use regular img tag for localhost to avoid Next.js restrictions
                    <img
                        src={user.avatar_url || "/images/defaultAvatar.svg"}
                        alt={user.full_name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Image
                        src={user.avatar_url || "/images/defaultAvatar.svg"}
                        alt={user.full_name}
                        fill
                        className="object-cover"
                    />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="font-semibold truncate">{user.full_name}</p>
                    {user.is_private_account && (
                        <Lock className="w-3 h-3 text-muted-foreground shrink-0" />
                    )}
                </div>
                <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
            </div>
        </Link>
    );
}
