import React from "react";

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
      {/* Background animation elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-purple-500/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-[10%] right-[20%] w-80 h-80 bg-blue-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: "0.5s" }}></div>
        <div className="absolute top-[40%] right-[30%] w-40 h-40 bg-indigo-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: "1s" }}></div>
      </div>
      
      {/* Spinner - SVG based loader */}
      <div className="relative">
        {/* Outer glowing circle */}
        <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-xl animate-pulse-scale"></div>
        
        {/* Main spinner */}
        <svg className="w-20 h-20 animate-rotate" viewBox="0 0 50 50">
          <circle
            className="animate-dash"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center icon or logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center animate-pulse-scale">
            <i className="ri-vip-diamond-fill text-white text-sm"></i>
          </div>
        </div>
      </div>
      
      {/* Loading message with animated dots */}
      <div className="mt-8 text-center">
        <h3 className="text-xl font-medium text-white mb-2 animate-slide-up-fade-in">
          {message}
        </h3>
        
        <div className="flex space-x-2 justify-center">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse-scale animate-delay-100"></div>
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse-scale animate-delay-200"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-scale animate-delay-300"></div>
        </div>
        
        <p className="text-gray-400 text-sm mt-4 max-w-xs mx-auto animate-slide-up-fade-in animate-delay-200">
          We're preparing something amazing for you. Just a moment...
        </p>
      </div>
    </div>
  );
}