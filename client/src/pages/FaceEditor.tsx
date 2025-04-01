import React, { useState, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { editFace, editObjects, FaceEditingParams, ObjectEditingParams } from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FaceFeature {
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

interface FaceEditRequest {
  image: File | null;
  adjustments: Record<string, number>;
  prompt?: string;
}

export default function FaceEditor() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("face");
  const [objectPrompt, setObjectPrompt] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  
  // Face editing features with adjustable sliders
  const [faceFeatures, setFaceFeatures] = useState<FaceFeature[]>([
    { name: "Age", value: 0, min: -50, max: 50, step: 1 },
    { name: "Smile", value: 0, min: -100, max: 100, step: 1 },
    { name: "Eyes", value: 0, min: -50, max: 50, step: 1 },
    { name: "Nose", value: 0, min: -50, max: 50, step: 1 },
    { name: "Mouth", value: 0, min: -50, max: 50, step: 1 },
    { name: "Face Width", value: 0, min: -50, max: 50, step: 1 },
    { name: "Face Height", value: 0, min: -50, max: 50, step: 1 },
    { name: "Jawline", value: 0, min: -50, max: 50, step: 1 },
    { name: "Skin tone", value: 0, min: -50, max: 50, step: 1 },
  ]);
  
  // Object editing features
  const [objectFeatures, setObjectFeatures] = useState<string[]>([
    "Add Object",
    "Remove Object",
    "Replace Object",
    "Modify Object",
  ]);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    
    setSelectedImage(file);
    const imageUrl = URL.createObjectURL(file);
    setPreviewUrl(imageUrl);
    setEditedImageUrl(null); // Reset edited image when new image is selected
    
    toast({
      title: "Image Selected",
      description: "You can now edit the face or objects in this image.",
    });
  };

  // Handle slider changes for face features
  const handleFeatureChange = (index: number, value: number[]) => {
    const updatedFeatures = [...faceFeatures];
    updatedFeatures[index].value = value[0];
    setFaceFeatures(updatedFeatures);
  };

  // Reset all face feature sliders to zero
  const resetFeatures = () => {
    setFaceFeatures(faceFeatures.map(feature => ({ ...feature, value: 0 })));
  };

  // Get adjustments as a record for API request
  const getAdjustments = (): Record<string, number> => {
    return faceFeatures.reduce((acc, feature) => {
      acc[feature.name.toLowerCase().replace(" ", "_")] = feature.value;
      return acc;
    }, {} as Record<string, number>);
  };

  // Apply face or object edits
  const applyEdits = async () => {
    if (!selectedImage) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsEditing(true);

      // Get user ID if available
      const userId = user ? user.id : undefined;
      let response;

      if (activeTab === "face") {
        // Call face editing API
        const faceParams: FaceEditingParams = {
          image: selectedImage,
          adjustments: getAdjustments(),
          userId,
        };

        response = await editFace(faceParams);
      } else {
        // For object editing, check if we have a prompt
        if (!objectPrompt.trim()) {
          toast({
            title: "No Object Prompt",
            description: "Please specify what objects to add, remove, or modify.",
            variant: "destructive",
          });
          setIsEditing(false);
          return;
        }

        // Call object editing API
        const objectParams: ObjectEditingParams = {
          image: selectedImage,
          prompt: objectPrompt,
          userId,
        };

        response = await editObjects(objectParams);
      }

      // Update UI with the result
      if (response && response.imageUrl) {
        setEditedImageUrl(response.imageUrl);
        
        toast({
          title: "Edits Applied",
          description: `Your ${activeTab === "face" ? "face" : "object"} edits have been successfully applied.`,
        });
      } else {
        throw new Error("No image URL returned from the API");
      }
    } catch (error: any) {
      console.error("Error applying edits:", error);
      toast({
        title: "Edit Failed",
        description: error.message || "There was an error applying your edits. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 gradient-text">
        Interactive Face & Object Editor
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column - Image upload and preview */}
        <div className="lg:col-span-3">
          <Card className="w-full feature-card">
            <CardHeader>
              <CardTitle>Image Preview</CardTitle>
              <CardDescription>
                Upload an image to edit facial features or modify objects
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              {/* Image upload area */}
              <div
                className="w-full h-64 border-2 border-dashed border-purple-500/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/40 transition-all duration-300 relative overflow-hidden"
                onClick={() => imageInputRef.current?.click()}
              >
                {previewUrl ? (
                  <div className="w-full h-full relative">
                    <img
                      src={editedImageUrl || previewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <p className="text-white text-sm">Click to change image</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <i className="ri-image-add-line text-4xl text-gray-400 mb-2"></i>
                    <p className="text-gray-400 text-sm">Click to upload an image</p>
                    <p className="text-gray-500 text-xs mt-1">JPG, PNG or GIF, up to 10MB</p>
                  </>
                )}
                <input
                  ref={imageInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {/* Active/inactive states and info */}
              {previewUrl && (
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm text-gray-400">Ready for editing</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPreviewUrl(null);
                        setEditedImageUrl(null);
                        setSelectedImage(null);
                        if (imageInputRef.current) imageInputRef.current.value = "";
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            {previewUrl && (
              <CardFooter>
                <div className="flex flex-col w-full space-y-2">
                  <p className="text-sm text-gray-400">
                    {activeTab === "face" 
                      ? "Adjust the sliders to modify facial features" 
                      : "Describe the objects you want to add, remove, or modify"}
                  </p>
                  <div className="flex justify-end w-full">
                    <Button
                      onClick={applyEdits}
                      disabled={isEditing}
                      className="relative overflow-hidden group"
                    >
                      {isEditing ? (
                        <div className="flex items-center">
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Applying Edits...</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <i className="ri-magic-line mr-2"></i>
                          Apply Edits
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Right column - Edit controls */}
        <div className="lg:col-span-2">
          <Card className="w-full feature-card">
            <CardHeader>
              <CardTitle>Edit Controls</CardTitle>
              <CardDescription>
                Modify facial features or edit objects in your image
              </CardDescription>
            </CardHeader>
            <CardContent>
              {previewUrl ? (
                <Tabs
                  defaultValue="face"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="w-full grid grid-cols-2 mb-4">
                    <TabsTrigger value="face">Face Editing</TabsTrigger>
                    <TabsTrigger value="object">Object Editing</TabsTrigger>
                  </TabsList>

                  {/* Face Editing Tab */}
                  <TabsContent value="face" className="space-y-4">
                    {faceFeatures.map((feature, index) => (
                      <div key={feature.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium">
                            {feature.name}
                          </label>
                          <span className="text-xs text-gray-400">
                            {feature.value > 0 ? "+" : ""}{feature.value}
                          </span>
                        </div>
                        <Slider
                          value={[feature.value]}
                          min={feature.min}
                          max={feature.max}
                          step={feature.step}
                          onValueChange={(value) => handleFeatureChange(index, value)}
                          className="my-2"
                        />
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={resetFeatures}
                    >
                      Reset All Features
                    </Button>
                  </TabsContent>

                  {/* Object Editing Tab */}
                  <TabsContent value="object" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Object Editing Prompt
                      </label>
                      <Input
                        value={objectPrompt}
                        onChange={(e) => setObjectPrompt(e.target.value)}
                        placeholder="E.g., Add sunglasses, Remove background, etc."
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <label className="text-sm font-medium mb-2 block">
                        Quick Actions
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {objectFeatures.map((feature) => (
                          <Button
                            key={feature}
                            variant="outline"
                            className="text-sm py-1 h-auto"
                            onClick={() => setObjectPrompt(feature + ": ")}
                          >
                            {feature}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-background/50 rounded-lg p-3 border border-purple-500/10">
                      <h3 className="text-sm font-medium mb-2">Examples:</h3>
                      <ul className="text-xs text-gray-400 space-y-1">
                        <li>• Add red hat to the person</li>
                        <li>• Remove background objects</li>
                        <li>• Replace glasses with sunglasses</li>
                        <li>• Change hair color to blonde</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="py-20 text-center">
                  <i className="ri-image-add-line text-4xl text-gray-400 mb-2"></i>
                  <p className="text-gray-400">Please upload an image first</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    Upload Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="feature-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <i className="ri-face-recognition-line mr-2 text-purple-400"></i>
              Face Editing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Adjust facial features like age, smile, eyes, nose, and more.
              The AI will maintain realism while applying your desired changes.
            </p>
          </CardContent>
        </Card>
        
        <Card className="feature-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <i className="ri-shape-line mr-2 text-blue-400"></i>
              Object Manipulation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Add, remove, or modify objects in your images with natural blending.
              Specify what you want to change using simple text prompts.
            </p>
          </CardContent>
        </Card>
        
        <Card className="feature-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <i className="ri-magic-line mr-2 text-pink-400"></i>
              AI-Powered Editing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Our AI ensures edits look natural and professional.
              Changes blend seamlessly with the original image for realistic results.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}