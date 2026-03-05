import { MessageCircle, Github, Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link
                            href="/"
                            className="flex items-center gap-2 mb-4"
                        >
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold">
                                SociaaNet
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            A free, open-source social platform built for
                            genuine connections. No ads, no tracking, no
                            paywalls.
                        </p>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="font-semibold text-sm mb-4">
                            Platform
                        </h4>
                        <ul className="space-y-2.5 text-sm text-muted-foreground">
                            <li>
                                <a
                                    href="#features"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#community"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Community
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#open-source"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Open Source
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-semibold text-sm mb-4">
                            Resources
                        </h4>
                        <ul className="space-y-2.5 text-sm text-muted-foreground">
                            <li>
                                <a
                                    href="https://github.com/niii-san/SociaaNet"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-foreground transition-colors"
                                >
                                    GitHub Repository
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/niii-san/SociaaNet/blob/main/docs/API_DOCUMENTATION.md"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-foreground transition-colors"
                                >
                                    API Documentation
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/niii-san/SociaaNet/blob/main/docs/SETUP.md"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Setup Guide
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h4 className="font-semibold text-sm mb-4">
                            Account
                        </h4>
                        <ul className="space-y-2.5 text-sm text-muted-foreground">
                            <li>
                                <Link
                                    href="/register"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Create Account
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/login"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/forgot-password"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Forgot Password
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        Made with{" "}
                        <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />{" "}
                        — open source &amp; free forever
                    </p>
                    <a
                        href="https://github.com/niii-san/SociaaNet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Github className="w-4 h-4" />
                        <span>niii-san/SociaaNet</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
