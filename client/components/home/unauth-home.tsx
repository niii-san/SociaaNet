import { Button } from "@/components/ui/button";
import {
    Users,
    Heart,
    Share2,
    Bell,
    TrendingUp,
    Shield,
    ArrowRight,
    MessageCircle,
    Video,
    Eye,
    Lock,
    Github,
    Sparkles,
    Globe
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";

export function UnAuthHome() {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden">
            {/* ── Hero Section ── */}
            <section className="relative pt-28 pb-24 px-4 sm:px-6 lg:px-8">
                {/* Background glow effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-150 bg-primary/8 rounded-full blur-3xl" />
                    <div className="absolute top-40 -left-40 w-100 h-100 bg-accent/6 rounded-full blur-3xl" />
                    <div className="absolute top-60 -right-40 w-100 h-100 bg-primary/6 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto relative">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-primary/20">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Free & open-source social platform</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                            Your Space to{" "}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/70">
                                Connect
                            </span>
                            ,{" "}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent/70">
                                Create
                            </span>
                            {" & "}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
                                Share
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                            Share posts, create reels, chat in real-time, and
                            build genuine connections — all on a platform that
                            respects your privacy. No ads, no algorithms selling
                            your data.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/register">
                                <Button
                                    size="lg"
                                    className="text-base px-8 py-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                                >
                                    Get Started — It&apos;s Free
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                            <a
                                href="https://github.com/niii-san/SociaaNet"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="text-base px-8 py-6"
                                >
                                    <Github className="w-4 h-4 mr-2" />
                                    View on GitHub
                                </Button>
                            </a>
                        </div>

                        {/* Trust signals */}
                        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-10 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <span>100% Free forever</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <span>No ads or tracking</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <span>Open source</span>
                            </div>
                        </div>
                    </div>

                    {/* ── Hero Visual: Mock Feed ── */}
                    <div className="mt-20 relative max-w-4xl mx-auto">
                        {/* Glow behind card */}
                        <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-primary/5 to-transparent rounded-3xl blur-2xl scale-105" />

                        <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl border border-border/80 shadow-2xl overflow-hidden">
                            {/* Fake browser bar */}
                            <div className="flex items-center gap-2 px-5 py-3 border-b border-border/60 bg-muted/40">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <div className="bg-muted/80 rounded-lg px-4 py-1 text-xs text-muted-foreground max-w-xs w-full text-center">
                                        sociaanet.app/home
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6 space-y-4">
                                {/* Mock Post 1 */}
                                <div className="flex items-start gap-3.5 p-4 bg-muted/40 rounded-2xl border border-border/40">
                                    <div className="w-11 h-11 bg-linear-to-br from-primary/30 to-accent/30 rounded-full flex items-center justify-center shrink-0">
                                        <span className="font-bold text-sm text-primary">
                                            S
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-sm">
                                                Sarah Johnson
                                            </span>
                                            <span className="text-muted-foreground text-xs">
                                                @sarahj · 2h
                                            </span>
                                        </div>
                                        <p className="text-sm text-foreground/90 mb-3">
                                            Just launched my new project! So
                                            grateful for this amazing community
                                            🚀✨
                                        </p>
                                        <div className="flex items-center gap-5 text-muted-foreground text-xs">
                                            <span className="flex items-center gap-1.5 text-pink-500">
                                                <Heart className="w-4 h-4 fill-pink-500" />
                                                2.4k
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <MessageCircle className="w-4 h-4" />
                                                128
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Share2 className="w-4 h-4" />
                                                56
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Mock Post 2 */}
                                <div className="flex items-start gap-3.5 p-4 bg-muted/40 rounded-2xl border border-border/40">
                                    <div className="w-11 h-11 bg-linear-to-br from-accent/30 to-primary/30 rounded-full flex items-center justify-center shrink-0">
                                        <span className="font-bold text-sm text-accent">
                                            M
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-sm">
                                                Mike Rivera
                                            </span>
                                            <span className="text-muted-foreground text-xs">
                                                @mikerivera · 4h
                                            </span>
                                        </div>
                                        <p className="text-sm text-foreground/90 mb-3">
                                            The real-time chat on SociaaNet is
                                            insane. Typing indicators, read
                                            receipts, reactions — it has
                                            everything 💬🔥
                                        </p>
                                        <div className="flex items-center gap-5 text-muted-foreground text-xs">
                                            <span className="flex items-center gap-1.5">
                                                <Heart className="w-4 h-4" />
                                                892
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <MessageCircle className="w-4 h-4" />
                                                64
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Share2 className="w-4 h-4" />
                                                23
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating stats badges */}
                        <div className="absolute -left-6 top-1/4 bg-card border border-border rounded-2xl p-3.5 shadow-lg hidden lg:flex items-center gap-3 animate-in slide-in-from-left-4 duration-700">
                            <div className="w-10 h-10 bg-pink-500/10 rounded-full flex items-center justify-center">
                                <Heart className="w-5 h-5 text-pink-500" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Real-time</p>
                                <p className="text-xs text-muted-foreground">
                                    Instant updates
                                </p>
                            </div>
                        </div>
                        <div className="absolute -right-6 top-1/3 bg-card border border-border rounded-2xl p-3.5 shadow-lg hidden lg:flex items-center gap-3 animate-in slide-in-from-right-4 duration-700">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Private</p>
                                <p className="text-xs text-muted-foreground">
                                    Your data, your rules
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Features Section ── */}
            <section
                id="features"
                className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">
                            Features
                        </p>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
                            Everything you need to connect
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            A full-featured social platform with all the tools
                            for sharing, communicating, and building your
                            community.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            {
                                icon: MessageCircle,
                                title: "Real-Time Chat",
                                description:
                                    "Instant messaging with typing indicators, read receipts, emoji reactions, and media sharing.",
                                color: "text-blue-500",
                                bg: "bg-blue-500/10"
                            },
                            {
                                icon: Video,
                                title: "Reels & Video",
                                description:
                                    "Create and share short-form video content with auto-generated thumbnails and smooth playback.",
                                color: "text-pink-500",
                                bg: "bg-pink-500/10"
                            },
                            {
                                icon: TrendingUp,
                                title: "Smart Feed",
                                description:
                                    "Algorithmic or chronological — you choose. Explore trending content or stick to your circle.",
                                color: "text-green-500",
                                bg: "bg-green-500/10"
                            },
                            {
                                icon: Bell,
                                title: "Live Notifications",
                                description:
                                    "Real-time push notifications for likes, comments, follows, mentions, and messages.",
                                color: "text-amber-500",
                                bg: "bg-amber-500/10"
                            },
                            {
                                icon: Lock,
                                title: "Privacy Controls",
                                description:
                                    "Private accounts, granular permissions for messages, comments, and mentions. You're in control.",
                                color: "text-purple-500",
                                bg: "bg-purple-500/10"
                            },
                            {
                                icon: Users,
                                title: "Follow System",
                                description:
                                    "Follow, follow-back, follow requests for private accounts, and suggested users to discover.",
                                color: "text-cyan-500",
                                bg: "bg-cyan-500/10"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="group bg-card border border-border/60 rounded-2xl p-6 hover:border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <div
                                    className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}
                                >
                                    <feature.icon
                                        className={`w-6 h-6 ${feature.color}`}
                                    />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* More features list */}
                    <div className="mt-12 text-center">
                        <p className="text-sm text-muted-foreground mb-4">
                            Plus so much more:
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {[
                                "Post Sharing",
                                "Bookmarks",
                                "Reposts",
                                "Comment Threads",
                                "Search",
                                "Dark Mode",
                                "Activity History",
                                "Content Reporting",
                                "Moderator Dashboard"
                            ].map((feature) => (
                                <span
                                    key={feature}
                                    className="text-xs px-3 py-1.5 bg-muted rounded-full text-muted-foreground border border-border/60"
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── How It Works Section ── */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">
                            Get Started
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-5">
                            Up and running in seconds
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Create an account",
                                description:
                                    "Sign up with just your name, email and a password. No phone number, no credit card.",
                                icon: Users
                            },
                            {
                                step: "02",
                                title: "Set up your profile",
                                description:
                                    "Add an avatar, write a bio, and configure your privacy settings exactly how you want.",
                                icon: Eye
                            },
                            {
                                step: "03",
                                title: "Start connecting",
                                description:
                                    "Follow people, share posts & reels, join conversations, and explore trending content.",
                                icon: Globe
                            }
                        ].map((item, index) => (
                            <div key={index} className="text-center group">
                                <div className="relative mx-auto w-16 h-16 mb-5">
                                    <div className="absolute inset-0 bg-primary/10 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform" />
                                    <div className="relative w-16 h-16 bg-card border border-border rounded-2xl flex items-center justify-center shadow-sm">
                                        <item.icon className="w-7 h-7 text-primary" />
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">
                                    Step {item.step}
                                </span>
                                <h3 className="text-lg font-semibold mt-1 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Community / Social Proof ── */}
            <section
                id="community"
                className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">
                            Community
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-5">
                            Built for people, not profits
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            SociaaNet is a community-first platform. No
                            targeted ads, no data selling, no algorithmic
                            manipulation — just genuine connections.
                        </p>
                    </div>

                    {/* Stats grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
                        {[
                            {
                                icon: Heart,
                                value: "Zero",
                                label: "Ads on the platform",
                                color: "text-pink-500",
                                bg: "bg-pink-500/10"
                            },
                            {
                                icon: Shield,
                                value: "100%",
                                label: "Privacy focused",
                                color: "text-green-500",
                                bg: "bg-green-500/10"
                            },
                            {
                                icon: Globe,
                                value: "Open",
                                label: "Source codebase",
                                color: "text-blue-500",
                                bg: "bg-blue-500/10"
                            },
                            {
                                icon: Users,
                                value: "Free",
                                label: "Forever, no paywalls",
                                color: "text-amber-500",
                                bg: "bg-amber-500/10"
                            }
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="bg-card border border-border/60 rounded-2xl p-6 text-center hover:border-border transition-colors"
                            >
                                <div
                                    className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}
                                >
                                    <stat.icon
                                        className={`w-6 h-6 ${stat.color}`}
                                    />
                                </div>
                                <p className="text-2xl sm:text-3xl font-bold mb-1">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Testimonial-style quotes */}
                    <div className="grid md:grid-cols-3 gap-5">
                        {[
                            {
                                name: "Alex Chen",
                                handle: "@alexc",
                                content:
                                    "Finally a social platform where I don't feel like a product. The privacy controls are exactly what I've been looking for.",
                                initial: "A",
                                gradient:
                                    "from-blue-500/20 to-purple-500/20"
                            },
                            {
                                name: "Maria Garcia",
                                handle: "@mariag",
                                content:
                                    "The real-time chat is incredible — reactions, typing indicators, read receipts. It feels premium and it's completely free!",
                                initial: "M",
                                gradient:
                                    "from-pink-500/20 to-amber-500/20"
                            },
                            {
                                name: "James Wilson",
                                handle: "@jamesw",
                                content:
                                    "I love that it's open source. I can actually see how my data is handled. Transparency matters.",
                                initial: "J",
                                gradient:
                                    "from-green-500/20 to-cyan-500/20"
                            }
                        ].map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-card border border-border/60 rounded-2xl p-6"
                            >
                                <p className="text-sm text-foreground/90 mb-5 leading-relaxed">
                                    &quot;{testimonial.content}&quot;
                                </p>
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-10 h-10 bg-linear-to-br ${testimonial.gradient} rounded-full flex items-center justify-center`}
                                    >
                                        <span className="font-bold text-sm">
                                            {testimonial.initial}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {testimonial.handle}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Open Source Section ── */}
            <section
                id="open-source"
                className="py-24 px-4 sm:px-6 lg:px-8"
            >
                <div className="max-w-4xl mx-auto">
                    <div className="relative bg-card border border-border/60 rounded-3xl p-8 sm:p-12 overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="relative text-center">
                            <div className="w-16 h-16 bg-foreground/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Github className="w-8 h-8 text-foreground" />
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                Open Source & Transparent
                            </h2>
                            <p className="text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
                                SociaaNet is fully open source. Inspect the
                                code, contribute features, report bugs, or
                                self-host your own instance. Built with
                                Next.js, Express, MongoDB, and Socket.IO.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                                {[
                                    "TypeScript",
                                    "Next.js 16",
                                    "React 19",
                                    "Express 5",
                                    "MongoDB",
                                    "Socket.IO",
                                    "Tailwind CSS"
                                ].map((tech) => (
                                    <span
                                        key={tech}
                                        className="text-xs font-medium px-3 py-1.5 bg-muted rounded-full text-muted-foreground border border-border/60"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                            <a
                                href="https://github.com/niii-san/SociaaNet"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="text-base px-8 py-6"
                                >
                                    <Github className="w-4 h-4 mr-2" />
                                    Star on GitHub
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
                        Ready to join?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                        Create your account in seconds. No credit card, no
                        commitments — just a better social experience.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register">
                            <Button
                                size="lg"
                                className="text-base px-8 py-6 shadow-lg shadow-primary/25"
                            >
                                Create Your Account
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button
                                variant="outline"
                                size="lg"
                                className="text-base px-8 py-6"
                            >
                                I already have an account
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
