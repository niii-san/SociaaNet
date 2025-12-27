"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Loader2, Eye, EyeOff, Check, Shield, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const registerSchema = z
    .object({
        email: z
            .string()
            .min(1, "Email is required")
            .email("Please enter a valid email address"),
        password: z
            .string()
            .min(1, "Password is required")
            .min(8, "Password must be at least 8 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Password must contain uppercase, lowercase and number"
            ),
        confirmPassword: z.string().min(1, "Please confirm your password"),
        acceptTerms: z.boolean().refine((val) => val === true, {
            message: "You must accept the terms and conditions"
        })
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            acceptTerms: false
        }
    });

    const password = watch("password", "");

    const passwordRequirements = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "One uppercase letter", met: /[A-Z]/.test(password) },
        { label: "One lowercase letter", met: /[a-z]/.test(password) },
        { label: "One number", met: /\d/.test(password) }
    ];

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            console.log("Register data:", data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
            console.error("Register error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleRegister = () => {
        console.log("Google register clicked");
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2">
            {/* Left Side - Branding */}
            <div className="hidden md:flex bg-primary flex-col justify-between p-10 text-white relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-20 right-10 w-32 h-32 bg-white/10 rounded-2xl rotate-12" />
                <div className="absolute bottom-32 left-10 w-24 h-24 bg-white/10 rounded-full" />
                <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-xl -rotate-12" />

                {/* Logo */}
                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold">SociaaNet</span>
                    </Link>
                </div>

                {/* Main content */}
                <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                            Start your
                            <br />
                            journey today.
                        </h1>
                        <p className="text-white/70 text-lg max-w-sm">
                            Create an account and join a community of millions sharing their stories.
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium">Secure & Private</p>
                                <p className="text-sm text-white/60">Your data is always protected</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium">Lightning Fast</p>
                                <p className="text-sm text-white/60">Optimized for the best experience</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium">Global Community</p>
                                <p className="text-sm text-white/60">Connect with people worldwide</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10">
                    <p className="text-white/50 text-sm">
                        © 2025 SociaaNet. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-[420px] space-y-6">
                    {/* Mobile Logo */}
                    <div className="flex justify-center md:hidden">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold">SociaaNet</span>
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-2xl font-bold tracking-tight">
                            Create an account
                        </h2>
                        <p className="text-muted-foreground">
                            Enter your details to get started
                        </p>
                    </div>

                    {/* Google Button */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-11"
                        onClick={handleGoogleRegister}
                        disabled={isLoading}
                    >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Sign up with Google
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                or continue with email
                            </span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                className={`h-11 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                {...register("email")}
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    className={`h-11 pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    {...register("password")}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {/* Password requirements */}
                            {password && (
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    {passwordRequirements.map((req, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center gap-1.5 text-xs ${
                                                req.met ? "text-primary" : "text-muted-foreground"
                                            }`}
                                        >
                                            <div
                                                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                                                    req.met ? "bg-primary" : "bg-muted"
                                                }`}
                                            >
                                                {req.met && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                                            </div>
                                            {req.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {errors.password && !password && (
                                <p className="text-sm text-destructive">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    className={`h-11 pr-10 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    {...register("confirmPassword")}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-destructive">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="space-y-2">
                            <div className="flex items-start gap-3">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        id="acceptTerms"
                                        className="peer h-5 w-5 shrink-0 rounded border border-input bg-background checked:bg-primary checked:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer appearance-none"
                                        {...register("acceptTerms")}
                                        disabled={isLoading}
                                    />
                                    <Check className="absolute h-3.5 w-3.5 text-primary-foreground pointer-events-none left-[3px] hidden peer-checked:block" />
                                </div>
                                <label
                                    htmlFor="acceptTerms"
                                    className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                                >
                                    I agree to the{" "}
                                    <Link href="/terms" className="text-primary hover:underline">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="text-primary hover:underline">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>
                            {errors.acceptTerms && (
                                <p className="text-sm text-destructive">
                                    {errors.acceptTerms.message}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full h-11"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Create account"
                            )}
                        </Button>
                    </form>

                    {/* Sign in link */}
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-primary font-medium hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}