"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createReel } from "@/features/posts/posts.api";
import { useAuth } from "@/contexts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { 
    ArrowLeft, 
    Loader2, 
    Video, 
    X, 
    Upload,
    Globe,
    Lock,
    Users,
    Play,
    Film
} from "lucide-react";
import Link from "next/link";
import { usePageTitle } from "@/hooks/usePageTitle";

type Visibility = "public" | "private" | "followers";

export default function CreateReelPage() {
    const router = useRouter();
    const { data: user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    usePageTitle("Create Reel");
    
    const [loading, setLoading] = useState(false);
    const [caption, setCaption] = useState("");
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [videoDuration, setVideoDuration] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Check if user's account is private
    const isPrivateAccount = user?.is_private_account || false;
    
    // Set default visibility based on account type
    const [visibility, setVisibility] = useState<Visibility>(
        isPrivateAccount ? "followers" : "public"
    );

    const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("video/")) {
            toast.error("Please select a valid video file");
            return;
        }

        // Validate file size (max 100MB)
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
            toast.error("Video size must be less than 100MB");
            return;
        }

        // Create preview URL
        const url = URL.createObjectURL(file);
        
        // Get video duration
        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';
        videoElement.onloadedmetadata = () => {
            window.URL.revokeObjectURL(videoElement.src);
            const duration = Math.round(videoElement.duration);
            setVideoDuration(duration);
            
            // Validate duration (max 60 seconds for reels)
            if (duration > 60) {
                toast.error("Reel duration must be 60 seconds or less");
                URL.revokeObjectURL(url);
                setSelectedVideo(null);
                setPreviewUrl(null);
                return;
            }
        };
        videoElement.src = url;
        
        setSelectedVideo(file);
        setPreviewUrl(url);
    };

    const removeVideo = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedVideo(null);
        setPreviewUrl(null);
        setVideoDuration(0);
    };

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Clear previous errors
        setErrorMessage(null);

        // Validation
        if (!selectedVideo) {
            setErrorMessage("Please select a video");
            return;
        }

        setLoading(true);
        try {
            const response = await createReel({
                caption: caption.trim(),
                visibility,
                video: selectedVideo,
            });
            
            toast.success("Reel uploaded successfully!");
            
            // Clean up object URL
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            
            // Navigate to reels
            router.push("/reels");
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || "Failed to upload reel";
            setErrorMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Visibility options based on account type
    const visibilityOptions = isPrivateAccount
        ? [
              {
                  value: "followers" as Visibility,
                  label: "Followers",
                  description: "Only your followers can see",
                  icon: Users,
              },
              {
                  value: "private" as Visibility,
                  label: "Private",
                  description: "Only you can see this reel",
                  icon: Lock,
              },
          ]
        : [
              {
                  value: "public" as Visibility,
                  label: "Public",
                  description: "Anyone can see this reel",
                  icon: Globe,
              },
              {
                  value: "private" as Visibility,
                  label: "Private",
                  description: "Only you can see this reel",
                  icon: Lock,
              },
          ];

    return (
        <div className="min-h-screen bg-background pb-16 lg:pb-0">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
                <div className="container max-w-3xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/">
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold">Create Reel</h1>
                                <p className="text-sm text-muted-foreground">
                                    Share a short video
                                </p>
                            </div>
                        </div>
                        <Button 
                            onClick={handleSubmit}
                            disabled={loading || !selectedVideo}
                            className="gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Film className="h-4 w-4" />
                                    Upload
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container max-w-3xl mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Video Upload Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Video className="w-5 h-5 text-primary" />
                                Video
                            </CardTitle>
                            <CardDescription>
                                Upload a video up to 60 seconds (max 100MB)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Video Preview */}
                            {previewUrl && (
                                <div className="relative aspect-9/16 max-w-sm mx-auto rounded-lg overflow-hidden border border-border bg-black">
                                    <video
                                        src={previewUrl}
                                        controls
                                        className="w-full h-full object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeVideo}
                                        className="absolute top-3 right-3 p-2 rounded-full bg-destructive/90 text-destructive-foreground hover:bg-destructive transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    {videoDuration > 0 && (
                                        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white text-sm font-medium flex items-center gap-1.5">
                                            <Play className="w-3.5 h-3.5" />
                                            {formatDuration(videoDuration)}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Upload Button */}
                            {!selectedVideo && (
                                <div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="video/*"
                                        onChange={handleVideoSelect}
                                        className="hidden"
                                        disabled={loading}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={loading}
                                        className="w-full h-48 border-dashed hover:bg-muted/50"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 rounded-full bg-primary/10">
                                                <Upload className="w-8 h-8 text-primary" />
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-semibold text-primary">
                                                    Click to upload video
                                                </span>
                                                <span className="text-muted-foreground block mt-1">
                                                    or drag and drop
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                MP4, MOV, AVI up to 100MB
                                            </p>
                                        </div>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Caption Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Caption</CardTitle>
                            <CardDescription>
                                Write a caption for your reel (optional)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Write your caption here... Use #hashtags to reach more people"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                className="min-h-32 resize-none"
                                disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                {caption.length} characters
                            </p>
                        </CardContent>
                    </Card>

                    {/* Visibility Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Visibility</CardTitle>
                            <CardDescription>
                                Choose who can see your reel
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {visibilityOptions.map((option) => {
                                const Icon = option.icon;
                                const isSelected = visibility === option.value;
                                
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setVisibility(option.value)}
                                        disabled={loading}
                                        className={`w-full flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                                            isSelected
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                                        }`}
                                    >
                                        <div className={`p-2 rounded-lg ${
                                            isSelected ? "bg-primary/10" : "bg-muted"
                                        }`}>
                                            <Icon className={`w-5 h-5 ${
                                                isSelected ? "text-primary" : "text-muted-foreground"
                                            }`} />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold">{option.label}</p>
                                                {isSelected && (
                                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-0.5">
                                                {option.description}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
                            {errorMessage}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
