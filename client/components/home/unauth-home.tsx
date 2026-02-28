import { Button } from "@/components/ui/button";
import {
    Users,
    Heart,
    Share2,
    Bell,
    TrendingUp,
    Shield,
    Zap,
    ArrowRight,
    Check,
    Star,
    MessageCircle
} from "lucide-react";

export function UnAuthHome() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Zap className="w-4 h-4" />
                            <span>Now with AI-powered content suggestions</span>
                        </div>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                            Connect, Share, and{" "}
                            <span className="text-primary">
                                Thrive Together
                            </span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                            Join millions of people sharing moments, building
                            communities, and discovering content that matters.
                            Your story deserves to be heard.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button size="lg" className="text-lg px-8 py-6">
                                Start Your Journey
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="text-lg px-8 py-6"
                            >
                                Watch Demo
                            </Button>
                        </div>
                        <div className="flex items-center justify-center gap-8 mt-10 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-primary" />
                                <span>Free to join</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-primary" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-primary" />
                                <span>Cancel anytime</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className="mt-16 relative">
                        <div className="bg-linear-to-b from-primary/20 to-transparent rounded-3xl p-1">
                            <div className="bg-card rounded-3xl border border-border shadow-2xl overflow-hidden">
                                <div className="p-6 space-y-4">
                                    {/* Mock Feed */}
                                    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                            <Users className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold">
                                                    Sarah Johnson
                                                </span>
                                                <span className="text-muted-foreground text-sm">
                                                    @sarahj
                                                </span>
                                            </div>
                                            <p className="text-foreground mb-3">
                                                Just launched my new project! So
                                                grateful for this amazing
                                                community 🚀✨
                                            </p>
                                            <div className="flex items-center gap-6 text-muted-foreground">
                                                <button className="flex items-center gap-2 hover:text-pink-500 transition-colors">
                                                    <Heart className="w-5 h-5" />
                                                    <span>2.4k</span>
                                                </button>
                                                <button className="flex items-center gap-2 hover:text-primary transition-colors">
                                                    <MessageCircle className="w-5 h-5" />
                                                    <span>128</span>
                                                </button>
                                                <button className="flex items-center gap-2 hover:text-primary transition-colors">
                                                    <Share2 className="w-5 h-5" />
                                                    <span>56</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Floating elements */}
                        <div className="absolute -left-4 top-1/4 bg-card border border-border rounded-2xl p-4 shadow-lg hidden lg:block">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                                    <Heart className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <p className="font-semibold">+1.2M</p>
                                    <p className="text-xs text-muted-foreground">
                                        Daily likes
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-4 top-1/3 bg-card border border-border rounded-2xl p-4 shadow-lg hidden lg:block">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                    <Users className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold">50M+</p>
                                    <p className="text-xs text-muted-foreground">
                                        Active users
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section
                id="features"
                className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Everything you need to connect
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Powerful features designed to help you build
                            meaningful connections and grow your community.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: MessageCircle,
                                title: "Real-time Messaging",
                                description:
                                    "Connect instantly with friends through secure, lightning-fast messaging."
                            },
                            {
                                icon: Users,
                                title: "Community Groups",
                                description:
                                    "Create and join communities around your interests and passions."
                            },
                            {
                                icon: TrendingUp,
                                title: "Trending Content",
                                description:
                                    "Discover what's popular and stay updated with personalized feeds."
                            },
                            {
                                icon: Bell,
                                title: "Smart Notifications",
                                description:
                                    "Never miss important updates with intelligent notification management."
                            },
                            {
                                icon: Shield,
                                title: "Privacy First",
                                description:
                                    "Your data is protected with enterprise-grade security measures."
                            },
                            {
                                icon: Zap,
                                title: "AI Powered",
                                description:
                                    "Get smart content suggestions and enhanced discovery features."
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-primary rounded-3xl p-12 text-primary-foreground">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                            {[
                                { value: "50M+", label: "Active Users" },
                                { value: "1B+", label: "Posts Shared" },
                                { value: "100M+", label: "Communities" },
                                { value: "99.9%", label: "Uptime" }
                            ].map((stat, index) => (
                                <div key={index}>
                                    <p className="text-4xl sm:text-5xl font-bold mb-2">
                                        {stat.value}
                                    </p>
                                    <p className="text-primary-foreground/80">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section
                id="testimonials"
                className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Loved by millions worldwide
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            See what our community members have to say about
                            their experience.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Alex Chen",
                                handle: "@alexc",
                                content:
                                    "Sociaa has completely transformed how I connect with my audience. The engagement is incredible!",
                                rating: 5
                            },
                            {
                                name: "Maria Garcia",
                                handle: "@mariag",
                                content:
                                    "Finally, a social platform that prioritizes privacy without sacrificing features. Love it!",
                                rating: 5
                            },
                            {
                                name: "James Wilson",
                                handle: "@jamesw",
                                content:
                                    "The community features are amazing. I've found my tribe and grown my business here.",
                                rating: 5
                            }
                        ].map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-card border border-border rounded-2xl p-6"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map(
                                        (_, i) => (
                                            <Star
                                                key={i}
                                                className="w-5 h-5 fill-accent text-accent"
                                            />
                                        )
                                    )}
                                </div>
                                <p className="text-foreground mb-6">
                                    {testimonial.content}
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                        <span className="font-semibold text-primary">
                                            {testimonial.name[0]}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {testimonial.handle}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Ready to join the conversation?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Start connecting with millions of people today. It's
                        free to get started.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="text-lg px-8 py-6">
                            Create Your Account
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-lg px-8 py-6"
                        >
                            Contact Sales
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
