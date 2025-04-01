import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { generateTextToImage } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useQuery } from "@tanstack/react-query";
import { getAiModels, getStylePresets } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Slider } from "@/components/ui/slider";

interface TextToImageFormProps {
  onGenerate: (imageUrl: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
}

export default function TextToImageForm({ onGenerate, setIsGenerating }: TextToImageFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("dalle");
  const [imageSize, setImageSize] = useState("1024x1024");
  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false);
  const [quality, setQuality] = useState(80);
  const [styleStrength, setStyleStrength] = useState(70);
  
  const { data: aiModels, isLoading: isLoadingModels } = useQuery({
    queryKey: ["/api/ai-models"],
    staleTime: 60000,
  });
  
  const { data: stylePresets, isLoading: isLoadingPresets } = useQuery({
    queryKey: ["/api/style-presets"],
    staleTime: 60000,
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt is required",
        description: "Please enter a description of the image you want to create",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      // Parse the selected image size
      const [width, height] = imageSize.split('x').map(Number);
      
      const response = await generateTextToImage({
        prompt,
        model,
        width,
        height,
        userId: user?.id
      });
      
      if (response.success && response.imageUrl) {
        onGenerate(response.imageUrl);
      } else {
        throw new Error("Failed to generate image");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate image. Please try again.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const handlePresetSelect = (presetPrompt: string) => {
    setPrompt((current) => {
      if (current.trim() === "") return presetPrompt;
      return `${current}, ${presetPrompt}`;
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-background/50 backdrop-blur-lg rounded-xl p-6">
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium mb-2">Enter your prompt</Label>
            <Textarea
              rows={3}
              placeholder="Describe the image you want to create in detail..."
              className="w-full bg-primary-900/50 border border-white/10 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          
          {stylePresets && stylePresets.length > 0 && (
            <div>
              <Label className="block text-sm font-medium mb-2">Style Presets</Label>
              <div className="flex flex-wrap gap-2">
                {stylePresets.map((preset: any) => (
                  <Button
                    key={preset.id}
                    variant="outline"
                    size="sm"
                    className="border-purple-500/30 text-purple-500 hover:bg-purple-500/10"
                    onClick={() => handlePresetSelect(preset.prompt)}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block text-sm font-medium mb-2">Choose Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="w-full bg-primary-900/50 border border-white/10">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dalle">DALL-E 3</SelectItem>
                  <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-2">Image Size</Label>
              <Select value={imageSize} onValueChange={setImageSize}>
                <SelectTrigger className="w-full bg-primary-900/50 border border-white/10">
                  <SelectValue placeholder="Select image size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1024x1024">1024 x 1024 (Square)</SelectItem>
                  <SelectItem value="1024x1792">1024 x 1792 (Portrait)</SelectItem>
                  <SelectItem value="1792x1024">1792 x 1024 (Landscape)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Advanced Settings */}
      <Collapsible
        open={isAdvancedSettingsOpen}
        onOpenChange={setIsAdvancedSettingsOpen}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white">
            <i className="ri-settings-3-line"></i>
            <span>Advanced Settings</span>
            <i className={`ri-arrow-${isAdvancedSettingsOpen ? 'up' : 'down'}-s-line`}></i>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card className="bg-background/50 backdrop-blur-lg rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm font-medium">Image Quality</Label>
                  <span className="text-xs text-gray-400">{quality}%</span>
                </div>
                <Slider
                  value={[quality]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={(value) => setQuality(value[0])}
                  className="my-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm font-medium">Style Strength</Label>
                  <span className="text-xs text-gray-400">{styleStrength}%</span>
                </div>
                <Slider
                  value={[styleStrength]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={(value) => setStyleStrength(value[0])}
                  className="my-2"
                />
              </div>
            </div>
          </Card>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium py-2 px-6 rounded-lg flex items-center justify-center space-x-2 hover:shadow-[0_0_15px_rgba(139,92,246,0.7)] transition-all"
      >
        <i className="ri-magic-line"></i>
        <span>Generate Image</span>
      </Button>
    </div>
  );
}
