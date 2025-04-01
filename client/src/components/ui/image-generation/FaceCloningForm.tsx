import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { generateFaceCloning } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FaceCloningFormProps {
  onGenerate: (imageUrl: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
}

export default function FaceCloningForm({ onGenerate, setIsGenerating }: FaceCloningFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("stable-diffusion");
  const [selectedFace, setSelectedFace] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [styleType, setStyleType] = useState("realistic");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFaceSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setSelectedFace(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!selectedFace) {
      toast({
        title: "Face image required",
        description: "Please upload a clear image of a face",
        variant: "destructive",
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "Prompt is required",
        description: "Please describe the avatar style you want to create",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      // Enhance prompt with selected style
      let enhancedPrompt = prompt;
      if (styleType === "anime") {
        enhancedPrompt = `${prompt}, anime style, anime character, 2D animation style`;
      } else if (styleType === "cartoon") {
        enhancedPrompt = `${prompt}, cartoon style, stylized character, exaggerated features`;
      } else if (styleType === "fantasy") {
        enhancedPrompt = `${prompt}, fantasy character, magical, fantasy world, detailed`;
      }
      
      const response = await generateFaceCloning({
        face: selectedFace,
        prompt: enhancedPrompt,
        model,
        userId: user?.id
      });
      
      if (response.success && response.imageUrl) {
        onGenerate(response.imageUrl);
      } else {
        throw new Error("Failed to clone face");
      }
    } catch (error) {
      console.error("Error cloning face:", error);
      toast({
        title: "Face Cloning Failed",
        description: error instanceof Error ? error.message : "Failed to clone face. Please try again.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-background/50 backdrop-blur-lg rounded-xl p-6">
        <div className="space-y-4">
          {/* Face Upload */}
          <div>
            <Label className="block text-sm font-medium mb-2">Upload Face Image</Label>
            <div 
              className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center hover:border-purple-500/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Face Preview" 
                    className="max-h-48 mx-auto rounded"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-black/50 rounded-full w-8 h-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFace(null);
                      setPreviewUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    <i className="ri-close-line"></i>
                  </Button>
                </div>
              ) : (
                <div className="py-8">
                  <i className="ri-user-face-line text-3xl text-gray-400 mb-2"></i>
                  <p className="text-sm text-gray-400">Upload a clear photo of a face</p>
                  <p className="text-xs text-gray-500 mt-1">For best results, use a front-facing portrait</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFaceSelect}
              />
            </div>
          </div>
          
          {/* Avatar Style */}
          <div>
            <Label className="block text-sm font-medium mb-2">Avatar Style</Label>
            <Tabs value={styleType} onValueChange={setStyleType}>
              <TabsList className="grid grid-cols-4 mb-2">
                <TabsTrigger value="realistic">Realistic</TabsTrigger>
                <TabsTrigger value="anime">Anime</TabsTrigger>
                <TabsTrigger value="cartoon">Cartoon</TabsTrigger>
                <TabsTrigger value="fantasy">Fantasy</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Prompt */}
          <div>
            <Label className="block text-sm font-medium mb-2">Avatar Description</Label>
            <Textarea
              rows={3}
              placeholder="Describe the avatar style, environment, clothing, etc..."
              className="w-full bg-primary-900/50 border border-white/10 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          
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
        </div>
      </Card>
      
      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={!selectedFace}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium py-2 px-6 rounded-lg flex items-center justify-center space-x-2 hover:shadow-[0_0_15px_rgba(6,182,212,0.7)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i className="ri-user-face-line"></i>
        <span>Create Avatar</span>
      </Button>
    </div>
  );
}
