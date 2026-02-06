"use client";

export function MiniLoader() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="relative h-16 w-16">
                {/* Background glow */}
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg animate-pulse" />
                
                {/* Main spinner */}
                <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-primary border-r-primary animate-spin" 
                     style={{ animationDuration: '0.8s' }} />
                
                {/* Inner counter-rotating spinner */}
                <div className="absolute inset-2 rounded-full border-3 border-transparent border-b-purple-500 border-l-purple-500 animate-spin" 
                     style={{ animationDuration: '1.2s', animationDirection: 'reverse' }} />
                
                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                </div>
            </div>
        </div>
    );
}
