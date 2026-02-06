"use client";

export function GlobalLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-md">
            <div className="relative flex flex-col items-center gap-6">
                {/* Outer rotating ring */}
                <div className="relative h-24 w-24">
                    {/* Background glow */}
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
                    
                    {/* Main spinner */}
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin" 
                         style={{ animationDuration: '1s' }} />
                    
                    {/* Inner counter-rotating spinner */}
                    <div className="absolute inset-3 rounded-full border-4 border-transparent border-b-purple-500 border-l-purple-500 animate-spin" 
                         style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                    
                    {/* Center dot */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                    </div>
                </div>
                
                {/* Loading text with gradient */}
                <div className="flex flex-col items-center gap-2">
                    <p className="text-2xl font-bold bg-linear-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent animate-pulse">
                        SociaaNet
                    </p>
                    <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
