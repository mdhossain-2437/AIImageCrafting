import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: string;
  gradientFrom: string;
  gradientTo: string;
  path: string;
}

export default function QuickActionCard({ 
  title, 
  description, 
  icon, 
  gradientFrom, 
  gradientTo, 
  path 
}: QuickActionCardProps) {
  return (
    <Card className="bg-background/50 backdrop-blur-lg rounded-xl p-6 hover:shadow-[0_0_15px_rgba(139,92,246,0.7)] transition-all duration-300 relative overflow-hidden">
      <div className="flex items-center space-x-4 mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${gradientFrom} to-${gradientTo} flex items-center justify-center`}>
          <i className={`${icon} text-xl text-white`}></i>
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      
      <p className="text-sm text-gray-400 mb-4">{description}</p>
      
      <Button 
        variant="outline" 
        className={`w-full border-${gradientFrom}/30 text-${gradientFrom} hover:bg-${gradientFrom}/10`}
        onClick={() => window.location.href = path}
      >
        Get Started
      </Button>
      
      {/* Gradient border effect */}
      <div className="absolute inset-0 -z-10 rounded-xl border-[1px] border-transparent bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-[1px]"></div>
    </Card>
  );
}
