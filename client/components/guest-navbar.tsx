"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export function GuestNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-sm"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
                            <MessageCircle className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            SociaaNet
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        <a
                            href="#features"
                            className="text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-muted/60 transition-all"
                        >
                            Features
                        </a>
                        <a
                            href="#community"
                            className="text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-muted/60 transition-all"
                        >
                            Community
                        </a>
                        <a
                            href="#open-source"
                            className="text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-muted/60 transition-all"
                        >
                            Open Source
                        </a>
                    </div>

                    {/* Desktop actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="text-sm">
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button size="sm" className="text-sm shadow-md shadow-primary/25">
                                Create Account
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-muted/60 transition-colors"
                    >
                        {mobileOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="md:hidden pb-4 pt-2 border-t border-border/50 space-y-1 animate-in slide-in-from-top-2 duration-200">
                        <a
                            href="#features"
                            onClick={() => setMobileOpen(false)}
                            className="block text-sm text-muted-foreground hover:text-foreground px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-all"
                        >
                            Features
                        </a>
                        <a
                            href="#community"
                            onClick={() => setMobileOpen(false)}
                            className="block text-sm text-muted-foreground hover:text-foreground px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-all"
                        >
                            Community
                        </a>
                        <a
                            href="#open-source"
                            onClick={() => setMobileOpen(false)}
                            className="block text-sm text-muted-foreground hover:text-foreground px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-all"
                        >
                            Open Source
                        </a>
                        <div className="flex gap-2 pt-3 px-3">
                            <Link href="/login" className="flex-1">
                                <Button variant="outline" size="sm" className="w-full text-sm">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/register" className="flex-1">
                                <Button size="sm" className="w-full text-sm">
                                    Create Account
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
