import React from "react";
import { Card } from "@/components/ui/card";
import { StylePreset } from "@shared/schema";

interface StylePresetCardProps {
  preset: StylePreset;
  onClick?: () => void;
}

export default function StylePresetCard({ preset, onClick }: StylePresetCardProps) {
  return (
    <Card 
      className="bg-background/50 backdrop-blur-lg rounded-xl overflow-hidden hover:shadow-[0_0_15px_rgba(139,92,246,0.7)] transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="h-32 relative">
        {preset.thumbnailUrl && (
          <img 
            src={preset.thumbnailUrl} 
            alt={`${preset.name} style`} 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
        <h3 className="absolute bottom-2 left-2 text-sm font-medium">{preset.name}</h3>
      </div>
    </Card>
  );
}
