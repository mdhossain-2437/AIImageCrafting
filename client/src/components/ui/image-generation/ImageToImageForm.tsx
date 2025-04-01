import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { generateImageToImage } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface ImageToImageFormProps {
  onGenerate: (imageUrl: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
}

export default function ImageToImageForm({ onGenerate, setIsGenerating }: ImageToImageFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("stable-diffusion");
  const [strength, setStrength] = useState(70);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedImage(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      toast({
        title: "Image required",
        description: "Please upload an image to transform",
        variant: "destructive",
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "Prompt is required",
        description: "Please describe how you want to transform the image",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      const strengthValue = strength / 100; // Convert to 0-1 range
      
      const response = await generateImageToImage({
        image: selectedImage,
        prompt,
        model,
        strength: strengthValue,
        userId: user?.id
      });
      
      if (response.success && response.imageUrl) {
        onGenerate(response.imageUrl);
      } else {
        throw new Error("Failed to transform image");
      }
    } catch (error) {
      console.error("Error transforming image:", error);
      toast({
        title: "Transformation Failed",
        description: error instanceof Error ? error.message : "Failed to transform image. Please try again.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-background/50 backdrop-blur-lg rounded-xl p-6">
        <div className="space-y-4">
          {/* Image Upload */}
          <div>
            <Label className="block text-sm font-medium mb-2">Upload Image</Label>
            <div 
              className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center hover:border-purple-500/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-h-48 mx-auto rounded"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-black/50 rounded-full w-8 h-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(null);
                      setPreviewUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    <i className="ri-close-line"></i>
                  </Button>
                </div>
              ) : (
                <div className="py-8">
                  <i className="ri-upload-cloud-line text-3xl text-gray-400 mb-2"></i>
                  <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
              />
            </div>
          </div>
          
          {/* Prompt */}
          <div>
            <Label className="block text-sm font-medium mb-2">Transformation Prompt</Label>
            <Textarea
              rows={3}
              placeholder="Describe how you want to transform the image..."
              className="w-full bg-primary-900/50 border border-white/10 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block text-sm font-medium mb-2">Choose Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="w-full bg-primary-900/50 border border-white/10">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
                  <SelectItem value="dalle">DALL-E 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-sm font-medium">Transformation Strength</Label>
                <span className="text-xs text-gray-400">{strength}%</span>
              </div>
              <Slider
                value={[strength]}
                min={1}
                max={100}
                step={1}
                onValueChange={(value) => setStrength(value[0])}
                className="my-2"
              />
            </div>
          </div>
        </div>
      </Card>
      
      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={!selectedImage}
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium py-2 px-6 rounded-lg flex items-center justify-center space-x-2 hover:shadow-[0_0_15px_rgba(59,130,246,0.7)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i className="ri-image-edit-fill"></i>
        <span>Transform Image</span>
      </Button>
    </div>
  );
}
