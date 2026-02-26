"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createPost } from "@/features/posts/posts.api";
import { useAuth } from "@/contexts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { 
    ArrowLeft, 
    Loader2, 
    Image as ImageIcon, 
    X, 
    Upload,
    Globe,
    Lock,
    Users
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Visibility = "public" | "private" | "followers";

export default function CreatePostPage() {
    const router = useRouter();
    const { data: user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [loading, setLoading] = useState(false);
    const [caption, setCaption] = useState("");
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Check if user's account is private
    const isPrivateAccount = user?.is_private_account || false;
    
    // Set default visibility based on account type
    const [visibility, setVisibility] = useState<Visibility>(
        isPrivateAccount ? "followers" : "public"
    );

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        if (files.length === 0) return;

        // Limit to 10 images
        if (selectedImages.length + files.length > 10) {
            toast.error("You can upload maximum 10 images");
            return;
        }

        // Validate file types
        const validFiles = files.filter(file => {
            if (!file.type.startsWith("image/")) {
                toast.error(`${file.name} is not a valid image`);
                return false;
            }
            return true;
        });

        // Create preview URLs
        const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
        
        setSelectedImages(prev => [...prev, ...validFiles]);
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    };

    const removeImage = (index: number) => {
        // Revoke the object URL to free up memory
        URL.revokeObjectURL(previewUrls[index]);
        
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Clear previous errors
        setErrorMessage(null);

        // Validation
        if (selectedImages.length === 0) {
            setErrorMessage("Please select at least one image");
            return;
        }

        setLoading(true);
        try {
            const response = await createPost({
                caption: caption.trim(),
                visibility,
                images: selectedImages,
            });
            
            toast.success("Post created successfully!");
            
            // Clean up object URLs
            previewUrls.forEach(url => URL.revokeObjectURL(url));
            
            // Navigate to home
            router.push("/");
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || "Failed to create post";
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
                  description: "Only you can see this post",
                  icon: Lock,
              },
          ]
        : [
              {
                  value: "public" as Visibility,
                  label: "Public",
                  description: "Anyone can see this post",
                  icon: Globe,
              },
              {
                  value: "private" as Visibility,
                  label: "Private",
                  description: "Only you can see this post",
                  icon: Lock,
              },
          ];

    return (
        <div className="min-h-screen bg-background">
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
                                <h1 className="text-xl font-bold">Create Post</h1>
                                <p className="text-sm text-muted-foreground">
                                    Share your moment
                                </p>
                            </div>
                        </div>
                        <Button 
                            onClick={handleSubmit}
                            disabled={loading || selectedImages.length === 0}
                            className="gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                "Post"
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container max-w-3xl mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-primary" />
                                Photos
                            </CardTitle>
                            <CardDescription>
                                Upload up to 10 photos for your post
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Image Previews */}
                            {previewUrls.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {previewUrls.map((url, index) => (
                                        <div
                                            key={index}
                                            className="relative aspect-square rounded-lg overflow-hidden border border-border group"
                                        >
                                            <Image
                                                src={url}
                                                alt={`Preview ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive/90 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs font-medium">
                                                {index + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Upload Button */}
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageSelect}
                                    className="hidden"
                                    disabled={loading}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={loading || selectedImages.length >= 10}
                                    className="w-full h-32 border-dashed hover:bg-muted/50"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <Upload className="w-8 h-8 text-muted-foreground" />
                                        <div className="text-sm">
                                            <span className="font-semibold text-primary">
                                                Click to upload
                                            </span>
                                            <span className="text-muted-foreground"> or drag and drop</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {selectedImages.length}/10 images selected
                                        </p>
                                    </div>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Caption Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Caption</CardTitle>
                            <CardDescription>
                                Write a caption for your post
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
                                Choose who can see your post
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
