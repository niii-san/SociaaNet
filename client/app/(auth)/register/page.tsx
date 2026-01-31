"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    MessageCircle,
    Loader2,
    Eye,
    EyeOff,
    Check,
    Shield,
    Zap,
    Globe,
    User,
    Mail,
    Lock
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/axios-instance";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const registerSchema = z
    .object({
        fullName: z.string().min(2, "Full name must be at least 2 characters"),
        email: z.string().min(1, "Email is required"),
        password: z
            .string()
            .min(1, "Password is required")
            .min(8, "Password must be at least 8 characters"),
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
    const [resError, setResError] = useState<string | null>(null);

    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            acceptTerms: false
        }
    });

    const password = watch("password", "");

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setResError(null);
        try {
            const reqData = {
                full_name: data.fullName,
                email_address: data.email,
                password: data.password,
                tos_accepted: data.acceptTerms
            };
             await api.post("/auth/signup", reqData);
            toast.success("Registration successful!");
            router.push("/login");
        } catch (error: any) {
            setResError(
                error?.response?.data?.message ||
                "An error occurred. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleRegister = () => {
        console.log("Google register clicked");
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex bg-primary flex-col justify-between p-12 text-white relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-20 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

                {/* Logo */}
                <div className="relative z-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 hover:opacity-90 transition-opacity"
                    >
                        <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                            <MessageCircle className="w-7 h-7" />
                        </div>
                        <span className="text-3xl font-bold tracking-tight">
                            SociaaNet
                        </span>
                    </Link>
                </div>

                {/* Main content */}
                <div className="relative z-10 space-y-12">
                    <div className="space-y-6">
                        <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
                            Join the <br />
                            <span className="text-white/90">Conversation.</span>
                        </h1>
                        <p className="text-xl text-white/80 max-w-md font-light">
                            Connect with friends, share your moments, and
                            discover what's happening around the world.
                        </p>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid gap-6">
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors duration-300">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-semibold text-lg">
                                    Secure & Private
                                </p>
                                <p className="text-sm text-white/60">
                                    Your data is encrypted and protected
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors duration-300">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-semibold text-lg">
                                    Real-time Updates
                                </p>
                                <p className="text-sm text-white/60">
                                    Stay in the loop with instant notifications
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors duration-300">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                <Globe className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-semibold text-lg">
                                    Global Community
                                </p>
                                <p className="text-sm text-white/60">
                                    Connect with millions of users worldwide
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 flex gap-6 text-sm text-white/50">
                    <span>© 2025 SociaaNet</span>
                    <Link
                        href="/privacy"
                        className="hover:text-white transition-colors"
                    >
                        Privacy
                    </Link>
                    <Link
                        href="/terms"
                        className="hover:text-white transition-colors"
                    >
                        Terms
                    </Link>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="flex items-center justify-center p-6 sm:p-12 bg-background lg:overflow-y-auto">
                <div className="w-full max-w-[440px] space-y-8">
                    {/* Header Section */}
                    <div className="space-y-2 text-center">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                                <MessageCircle className="w-7 h-7 text-primary-foreground" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">
                            Create an account
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Enter your details below to get started
                        </p>
                    </div>

                    {/* Google Button */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 text-base font-medium relative hover:bg-muted/50 transition-colors"
                        onClick={handleGoogleRegister}
                        disabled={isLoading}
                    >
                        <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
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
                        Continue with Google
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-4 text-muted-foreground font-medium">
                                Or register with email
                            </span>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        {/* Error Message */}
                        {resError && (
                            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 animate-in fade-in slide-in-from-top-2">
                                {resError}
                            </div>
                        )}

                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="fullName"
                                className="text-sm font-medium"
                            >
                                Full Name
                            </Label>
                            <div className="relative">
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="John Doe"
                                    className={`h-12 pl-11 bg-muted/30 border-input/60 hover:border-input focus:border-primary transition-colors ${errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    {...register("fullName")}
                                    disabled={isLoading}
                                />
                                <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                            </div>
                            {errors.fullName && (
                                <p className="text-sm text-destructive font-medium">
                                    {errors.fullName.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium"
                            >
                                Email Address
                            </Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className={`h-12 pl-11 bg-muted/30 border-input/60 hover:border-input focus:border-primary transition-colors ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    {...register("email")}
                                    disabled={isLoading}
                                />
                                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-destructive font-medium">
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
                                    className={`h-12 pl-11 pr-11 bg-muted/30 border-input/60 hover:border-input focus:border-primary transition-colors ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    {...register("password")}
                                    disabled={isLoading}
                                />
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && !password && (
                                <p className="text-sm text-destructive font-medium">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm your password"
                                    className={`h-12 pl-11 pr-11 bg-muted/30 border-input/60 hover:border-input focus:border-primary transition-colors ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    {...register("confirmPassword")}
                                    disabled={isLoading}
                                />
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-destructive font-medium">
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
                                    <Link
                                        href="/terms"
                                        className="text-primary hover:underline"
                                    >
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                        href="/privacy"
                                        className="text-primary hover:underline"
                                    >
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
