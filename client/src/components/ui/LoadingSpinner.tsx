import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  withText?: boolean;
  text?: string;
}

export default function LoadingSpinner({
  size = "md",
  className,
  withText = false,
  text = "Loading..."
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative">
        {/* Outer glow */}
        <div className={cn(
          "absolute inset-0 rounded-full bg-purple-500/30 blur-md animate-pulse-scale",
          sizeClasses[size]
        )}></div>
        
        {/* Spinner SVG */}
        <svg 
          className={cn(
            "animate-rotate relative z-10",
            sizeClasses[size]
          )} 
          viewBox="0 0 50 50"
        >
          <circle
            className="animate-dash"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="url(#gradient-spinner)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient-spinner" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {withText && (
        <span className="ml-3 text-sm font-medium text-foreground animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
}