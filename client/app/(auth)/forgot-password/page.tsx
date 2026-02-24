"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requestForgotPasswordOtp, changePasswordWithOtp } from "@/features/auth/auth.api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Mail, Lock, Key, Clock } from "lucide-react";
import Link from "next/link";

const COOLDOWN_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<"email" | "otp">("email");
    const [loading, setLoading] = useState(false);
    
    // Form state
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    
    // Error state
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    // Cooldown state
    const [lastOtpRequestTime, setLastOtpRequestTime] = useState<number | null>(null);
    const [remainingCooldown, setRemainingCooldown] = useState(0);

    // Update cooldown timer every second
    useEffect(() => {
        const interval = setInterval(() => {
            if (lastOtpRequestTime) {
                const elapsed = Date.now() - lastOtpRequestTime;
                const remaining = Math.max(0, COOLDOWN_DURATION - elapsed);
                setRemainingCooldown(remaining);
                
                if (remaining === 0) {
                    setLastOtpRequestTime(null);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [lastOtpRequestTime]);

    const formatCooldownTime = (ms: number): string => {
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Clear previous errors
        setErrorMessage(null);
        
        // Check if cooldown is active
        if (remainingCooldown > 0) {
            toast.error(`Please wait ${formatCooldownTime(remainingCooldown)} before requesting another OTP`);
            return;
        }
        
        if (!email || !email.includes("@")) {
            setErrorMessage("Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            const response = await requestForgotPasswordOtp(email);
            toast.success(response.message);
            setLastOtpRequestTime(Date.now()); // Set cooldown timer
            setStep("otp");
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || "Failed to send OTP";
            setErrorMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setErrorMessage(null);

        if (!otp || otp.length !== 6) {
            setErrorMessage("Please enter a valid 6-digit OTP");
            return;
        }

        if (!newPassword || newPassword.length < 8) {
            setErrorMessage("Password must be at least 8 characters");
            return;
        }

        setLoading(true);
        try {
            const response = await changePasswordWithOtp({
                email_address: email,
                otp,
                new_password: newPassword,
            });
            toast.success(response.message);
            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || "Failed to change password";
            setErrorMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Link href="/login">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
                    </div>
                    <CardDescription>
                        {step === "email" 
                            ? "Enter your email to receive a password reset OTP"
                            : "Enter the OTP sent to your email and your new password"
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === "email" ? (
                        <form onSubmit={handleRequestOtp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {errorMessage && (
                                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
                                    {errorMessage}
                                </div>
                            )}

                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={loading || remainingCooldown > 0}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending OTP...
                                    </>
                                ) : remainingCooldown > 0 ? (
                                    <>
                                        <Clock className="mr-2 h-4 w-4" />
                                        Wait {formatCooldownTime(remainingCooldown)}
                                    </>
                                ) : (
                                    "Request OTP"
                                )}
                            </Button>

                            <div className="text-center text-sm">
                                <Link href="/login" className="text-primary hover:underline">
                                    Back to login
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email-display">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email-display"
                                        type="email"
                                        value={email}
                                        className="pl-10 bg-muted"
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="otp">OTP Code</Label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        className="pl-10"
                                        maxLength={6}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Check your email for the OTP code
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="new-password"
                                        type="password"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="pl-10"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Must be at least 8 characters
                                </p>
                            </div>

                            {errorMessage && (
                                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
                                    {errorMessage}
                                </div>
                            )}

                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Changing Password...
                                    </>
                                ) : (
                                    "Change Password"
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => setStep("email")}
                                disabled={loading || remainingCooldown > 0}
                            >
                                {remainingCooldown > 0 ? (
                                    <>
                                        <Clock className="mr-2 h-4 w-4" />
                                        Wait {formatCooldownTime(remainingCooldown)}
                                    </>
                                ) : (
                                    "Request New OTP"
                                )}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
