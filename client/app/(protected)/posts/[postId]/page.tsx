"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPostById, updatePostVisibility, PostDetail } from "@/features/posts/posts.api";
import { useAuth } from "@/contexts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MiniLoader } from "@/components/ui/mini-loader";
import {
    Heart,
    MessageCircle,
    Send,
    Bookmark,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Globe,
    Lock,
    Users,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function PostDetailPage() {
    const { postId } = useParams<{ postId: string }>();
    const router = useRouter();
    const { data: currentUser } = useAuth();

    const [post, setPost] = useState<PostDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [updatingVisibility, setUpdatingVisibility] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) return;

            setLoading(true);
            try {
                const data = await getPostById(postId);
                setPost(data);
            } catch (error: any) {
                console.error("Error fetching post:", error);
                toast.error(error.response?.data?.message || "Failed to load post");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handlePreviousImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? (post?.media_urls.length || 1) - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === (post?.media_urls.length || 1) - 1 ? 0 : prev + 1
        );
    };

    const handleVisibilityChange = async (newVisibility: "public" | "private" | "followers") => {
        if (!post) return;

        setUpdatingVisibility(true);
        try {
            await updatePostVisibility(post.post_id, newVisibility);
            setPost({ ...post, visibility: newVisibility });
            toast.success("Visibility updated successfully");
        } catch (error: any) {
            console.error("Error updating visibility:", error);
            toast.error(error.response?.data?.message || "Failed to update visibility");
        } finally {
            setUpdatingVisibility(false);
        }
    };

    const getVisibilityIcon = (visibility: string) => {
        switch (visibility) {
            case "public":
                return <Globe className="w-4 h-4" />;
            case "followers":
                return <Users className="w-4 h-4" />;
            case "private":
                return <Lock className="w-4 h-4" />;
            default:
                return <Globe className="w-4 h-4" />;
        }
    };

    const getVisibilityText = (visibility: string) => {
        switch (visibility) {
            case "public":
                return "Public";
            case "followers":
                return "Followers";
            case "private":
                return "Private";
            default:
                return visibility;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            return `${diffInMinutes}m ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays}d ago`;
        } else {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center pt-16">
                <MiniLoader />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-16 gap-4">
                <h2 className="text-2xl font-bold">Post Not Found</h2>
                <p className="text-muted-foreground">This post may have been deleted or is not available.</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    // Get visibility options based on account type
    const isPrivateAccount = currentUser?.is_private_account;
    const visibilityOptions: Array<"public" | "private" | "followers"> = isPrivateAccount
        ? ["followers", "private"]
        : ["public", "private"];

    return (
        <div className="min-h-screen bg-background pb-12 pt-16">
            <div className="container max-w-4xl mx-auto px-4 py-8">
                {/* Post Card */}
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={currentUser?.avatar_url || undefined} />
                                    <AvatarFallback>
                                        {currentUser?.full_name?.charAt(0).toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{currentUser?.username}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>{formatDate(post.created_at)}</span>
                                        <span>•</span>
                                        <div className="flex items-center gap-1">
                                            {getVisibilityIcon(post.visibility)}
                                            <span className="capitalize">{getVisibilityText(post.visibility)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {post.is_post_author && (
                                        <>
                                            {visibilityOptions.map((vis) => (
                                                <DropdownMenuItem
                                                    key={vis}
                                                    onClick={() => handleVisibilityChange(vis)}
                                                    disabled={updatingVisibility || post.visibility === vis}
                                                    className="gap-2"
                                                >
                                                    {getVisibilityIcon(vis)}
                                                    <span>Make {getVisibilityText(vis)}</span>
                                                </DropdownMenuItem>
                                            ))}
                                            <Separator className="my-1" />
                                        </>
                                    )}
                                    <DropdownMenuItem className="text-destructive">
                                        Report
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Images */}
                        <div className="relative bg-black aspect-square w-full">
                            <img
                                src={post.media_urls[currentImageIndex]}
                                alt={`Post image ${currentImageIndex + 1}`}
                                className="w-full h-full object-contain"
                            />

                            {/* Image navigation */}
                            {post.media_urls.length > 1 && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full h-10 w-10"
                                        onClick={handlePreviousImage}
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full h-10 w-10"
                                        onClick={handleNextImage}
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </Button>

                                    {/* Image indicators */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                        {post.media_urls.map((_, index) => (
                                            <div
                                                key={index}
                                                className={`rounded-full transition-all ${
                                                    index === currentImageIndex
                                                        ? "bg-white w-2 h-2"
                                                        : "bg-white/50 w-1.5 h-1.5"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Button variant="ghost" size="icon" className="hover:text-red-500">
                                        <Heart
                                            className={`w-7 h-7 ${
                                                post.is_post_liked_by_current_user
                                                    ? "fill-red-500 text-red-500"
                                                    : ""
                                            }`}
                                        />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <MessageCircle className="w-7 h-7" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Send className="w-7 h-7" />
                                    </Button>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <Bookmark className="w-6 h-6" />
                                </Button>
                            </div>

                            {/* Likes count */}
                            <div>
                                <p className="font-semibold text-sm">
                                    {post.likes_count} {post.likes_count === 1 ? "like" : "likes"}
                                </p>
                            </div>

                            {/* Caption */}
                            {post.caption && (
                                <div>
                                    <p className="text-sm">
                                        <span className="font-semibold mr-2">{currentUser?.username}</span>
                                        {post.caption}
                                    </p>
                                    {post.hashtags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {post.hashtags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="text-sm text-primary cursor-pointer hover:underline"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Comments Section */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Comments ({post.comments_count})
                    </h3>

                    {/* Add Comment */}
                    <Card className="mb-6">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={currentUser?.avatar_url || undefined} />
                                    <AvatarFallback>
                                        {currentUser?.full_name?.charAt(0).toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <textarea
                                        placeholder="Add a comment..."
                                        className="w-full bg-transparent outline-none text-sm resize-none min-h-12 border rounded-lg p-3"
                                        rows={2}
                                    />
                                    <div className="flex justify-end mt-2">
                                        <Button size="sm" className="font-semibold">
                                            Post Comment
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Comments List */}
                    {post.comments_count === 0 ? (
                        <Card>
                            <CardContent className="p-12">
                                <div className="text-center text-muted-foreground space-y-2">
                                    <MessageCircle className="w-12 h-12 mx-auto opacity-50" />
                                    <p className="font-medium">No comments yet</p>
                                    <p className="text-sm">Be the first to comment on this post</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {/* Comment items will be rendered here when API returns comments */}
                            <Card>
                                <CardContent className="p-4">
                                    <p className="text-sm text-muted-foreground text-center">
                                        {post.comments_count} {post.comments_count === 1 ? "comment" : "comments"} • Load comments feature coming soon
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
