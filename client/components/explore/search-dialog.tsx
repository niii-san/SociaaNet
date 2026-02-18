"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchUsers } from "@/features/search/search.api";
import { SearchUser } from "@/types";
import { UserSearchResult } from "@/components/explore/user-search-result";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface SearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [results, setResults] = useState<SearchUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    // Perform search when debounced query changes
    useEffect(() => {
        if (debouncedQuery.trim().length === 0) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        const performSearch = async () => {
            setLoading(true);
            try {
                const response = await searchUsers(debouncedQuery, 1);
                setResults(response.data);
                setCurrentPage(response.current_page);
                setHasNextPage(response.has_next_page);
                setHasSearched(true);
            } catch (error) {
                console.error("Search failed:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [debouncedQuery]);

    const loadMore = async () => {
        if (!hasNextPage || loading) return;
        
        setLoading(true);
        try {
            const response = await searchUsers(debouncedQuery, currentPage + 1);
            setResults((prev) => [...prev, ...response.data]);
            setCurrentPage(response.current_page);
            setHasNextPage(response.has_next_page);
        } catch (error) {
            console.error("Load more failed:", error);
        } finally {
            setLoading(false);
        }
    };

    // Reset state when dialog closes
    useEffect(() => {
        if (!open) {
            setQuery("");
            setDebouncedQuery("");
            setResults([]);
            setHasSearched(false);
        }
    }, [open]);

    const handleResultClick = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-0 gap-0 max-h-[80vh] flex flex-col">
                <DialogHeader className="px-4 pt-4 pb-3 border-b">
                    <DialogTitle className="text-center">Search</DialogTitle>
                </DialogHeader>

                {/* Search Input */}
                <div className="px-4 py-3 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search users..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-9 pr-9"
                            autoFocus
                        />
                        {query && (
                            <button
                                onClick={() => setQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        {loading && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Search Results */}
                <div className="flex-1 overflow-y-auto">
                    {hasSearched ? (
                        <>
                            {results.length > 0 ? (
                                <div className="p-2">
                                    {results.map((user) => (
                                        <div key={user.user_id} onClick={handleResultClick}>
                                            <UserSearchResult user={user} />
                                        </div>
                                    ))}
                                    
                                    {/* Load More */}
                                    {hasNextPage && (
                                        <button
                                            onClick={loadMore}
                                            disabled={loading}
                                            className="w-full py-3 text-sm font-medium text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? "Loading..." : "Load more"}
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12 px-4">
                                    <p className="text-muted-foreground">No users found</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 px-4">
                            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                            <p className="text-sm text-muted-foreground">
                                Search for people on SociaaNet
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
