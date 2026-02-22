"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { FollowingRequest } from "@/types";
import { getFollowingRequests } from "@/features/follow/follow.api";

interface FollowContextType {
    followingRequests: FollowingRequest[];
    isLoading: boolean;
    refetchFollowingRequests: () => Promise<void>;
}

const FollowContext = createContext<FollowContextType | undefined>(undefined);

export const FollowProvider = ({ children }: { children: ReactNode }) => {
    const [followingRequests, setFollowingRequests] = useState<FollowingRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFollowingRequests = async () => {
        try {
            const response = await getFollowingRequests();
            setFollowingRequests(response.data);
        } catch (error) {
            console.error("Failed to fetch following requests:", error);
            setFollowingRequests([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFollowingRequests();
    }, []);

    const refetchFollowingRequests = async () => {
        setIsLoading(true);
        await fetchFollowingRequests();
    };

    return (
        <FollowContext.Provider
            value={{
                followingRequests,
                isLoading,
                refetchFollowingRequests,
            }}
        >
            {children}
        </FollowContext.Provider>
    );
};

export const useFollow = () => {
    const context = useContext(FollowContext);
    if (!context) {
        throw new Error("useFollow must be used within FollowProvider");
    }
    return context;
};
