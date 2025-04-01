import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AiModel } from "@shared/schema";

interface AIModelCardProps {
  model: AiModel;
  onSelect?: () => void;
}

export default function AIModelCard({ model, onSelect }: AIModelCardProps) {
  return (
    <Card className="bg-background/50 backdrop-blur-lg rounded-xl p-6 hover:shadow-[0_0_15px_rgba(139,92,246,0.7)] transition-all relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{model.name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          model.isActive 
            ? "bg-green-500/10 text-green-400" 
            : "bg-amber-500/10 text-amber-400"
        }`}>
          {model.isActive ? "Active" : "Beta"}
        </span>
      </div>
      
      <p className="text-sm text-gray-400 mb-4">{model.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {model.capabilities?.tags?.map((tag: string, index: number) => (
          <Badge 
            key={index}
            variant="outline" 
            className={`
              ${index % 3 === 0 ? "bg-purple-500/10 text-purple-500 border-purple-500/30" : ""}
              ${index % 3 === 1 ? "bg-blue-500/10 text-blue-500 border-blue-500/30" : ""}
              ${index % 3 === 2 ? "bg-pink-500/10 text-pink-500 border-pink-500/30" : ""}
            `}
          >
            {tag}
          </Badge>
        ))}
      </div>
      
      <Button
        onClick={onSelect}
        disabled={!model.isActive}
        className={`w-full ${
          model.isActive 
            ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.7)]" 
            : "bg-gray-500 text-white opacity-70 cursor-not-allowed"
        }`}
      >
        {model.isActive ? "Use Model" : "Coming Soon"}
      </Button>
      
      {/* Gradient border effect */}
      <div className="absolute inset-0 -z-10 border border-white/5 rounded-xl"></div>
    </Card>
  );
}
