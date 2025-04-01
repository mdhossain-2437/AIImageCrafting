import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { 
  getAiModels, 
  getUserModelTunings, 
  saveModelTuning,
  ModelTuningParams 
} from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

export default function ModelTuning() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeModel, setActiveModel] = useState<string>("");
  const [tuningName, setTuningName] = useState<string>("");
  const [tuningDescription, setTuningDescription] = useState<string>("");
  
  // Default parameters - these will vary based on your AI model
  const [parameters, setParameters] = useState({
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    styleFidelity: 0.5,
    detailEnhancement: 0.5,
    creativityBoost: 0.5,
    useFaceCorrection: true,
    useHighDefinition: true,
    maintainOriginalPalette: false
  });

  // Fetch available AI models
  const { 
    data: models, 
    isLoading: isLoadingModels 
  } = useQuery({
    queryKey: ['/api/ai-models'],
    retry: 1
  });

  // Fetch user's saved model tunings
  const { 
    data: userTunings, 
    isLoading: isLoadingTunings 
  } = useQuery({
    queryKey: ['/api/model-tunings', user?.id],
    enabled: !!user?.id,
    retry: 1
  });

  // Mutation for saving a model tuning
  const saveTuningMutation = useMutation({
    mutationFn: saveModelTuning,
    onSuccess: () => {
      toast({
        title: "Model tuning saved",
        description: "Your custom AI model settings have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/model-tunings', user?.id] });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to save",
        description: error.message || "There was an error saving your model tuning.",
        variant: "destructive",
      });
    },
  });

  // Handle saving the model tuning
  const handleSaveTuning = () => {
    if (!activeModel) {
      toast({
        title: "Select a model",
        description: "Please select an AI model to tune.",
        variant: "destructive",
      });
      return;
    }

    if (!tuningName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your model tuning.",
        variant: "destructive",
      });
      return;
    }

    const tuningParams: ModelTuningParams = {
      name: tuningName,
      description: tuningDescription,
      modelId: activeModel,
      parameters,
      userId: user?.id,
    };

    saveTuningMutation.mutate(tuningParams);
  };

  // Reset the form
  const resetForm = () => {
    setTuningName("");
    setTuningDescription("");
    setParameters({
      temperature: 0.7,
      topP: 0.9,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      styleFidelity: 0.5,
      detailEnhancement: 0.5,
      creativityBoost: 0.5,
      useFaceCorrection: true,
      useHighDefinition: true,
      maintainOriginalPalette: false
    });
  };

  // Load a saved tuning for editing
  const loadSavedTuning = (tuning: any) => {
    setActiveModel(tuning.modelId);
    setTuningName(tuning.name);
    setTuningDescription(tuning.description || "");
    setParameters(tuning.parameters);
  };

  // Handle parameter changes for sliders
  const handleParameterChange = (
    parameter: keyof typeof parameters,
    value: number | number[] | boolean
  ) => {
    setParameters((prev) => ({
      ...prev,
      [parameter]: Array.isArray(value) ? value[0] : value,
    }));
  };

  // Set first available model when data loads
  useEffect(() => {
    if (models?.length && !activeModel) {
      setActiveModel(models[0].id.toString());
    }
  }, [models, activeModel]);

  if (isLoadingModels) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[200px]">
        <LoadingSpinner size="lg" withText text="Loading AI models..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 gradient-text">
        AI Model Personalization
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column - Model selection and parameter tuning */}
        <div className="lg:col-span-8">
          <Card className="w-full feature-card">
            <CardHeader>
              <CardTitle>Custom Model Tuning</CardTitle>
              <CardDescription>
                Customize and fine-tune AI model parameters to match your creative style
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Model selection */}
              <div className="space-y-2">
                <Label htmlFor="model-select">Select AI Model</Label>
                <Select 
                  value={activeModel} 
                  onValueChange={setActiveModel}
                >
                  <SelectTrigger id="model-select" className="w-full">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models?.map((model: any) => (
                      <SelectItem key={model.id} value={model.id.toString()}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tuning name and description */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tuning-name">Tuning Name</Label>
                  <Input
                    id="tuning-name"
                    placeholder="E.g., My Photography Style, Anime Character Design"
                    value={tuningName}
                    onChange={(e) => setTuningName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tuning-description">Description (Optional)</Label>
                  <Input
                    id="tuning-description"
                    placeholder="Describe what this tuning is optimized for"
                    value={tuningDescription}
                    onChange={(e) => setTuningDescription(e.target.value)}
                  />
                </div>
              </div>

              {/* Parameter adjustment with tabs */}
              <Tabs defaultValue="basic" className="w-full pt-4">
                <TabsList className="w-full grid grid-cols-3 mb-4">
                  <TabsTrigger value="basic">Basic Parameters</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced Tuning</TabsTrigger>
                  <TabsTrigger value="options">Options</TabsTrigger>
                </TabsList>

                {/* Basic parameters tab */}
                <TabsContent value="basic" className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Temperature</Label>
                        <span className="text-sm text-muted-foreground">
                          {parameters.temperature.toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={2}
                        step={0.1}
                        value={[parameters.temperature]}
                        onValueChange={(value) => handleParameterChange("temperature", value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Controls randomness: Lower values produce more predictable outputs; higher values more creative.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Top P</Label>
                        <span className="text-sm text-muted-foreground">
                          {parameters.topP.toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={1}
                        step={0.05}
                        value={[parameters.topP]}
                        onValueChange={(value) => handleParameterChange("topP", value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Controls diversity via nucleus sampling: 0.5 means half of all probability-mass.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Style Fidelity</Label>
                        <span className="text-sm text-muted-foreground">
                          {parameters.styleFidelity.toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        value={[parameters.styleFidelity]}
                        onValueChange={(value) => handleParameterChange("styleFidelity", value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        How closely the output follows artistic styles described in the prompt.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Creativity Boost</Label>
                        <span className="text-sm text-muted-foreground">
                          {parameters.creativityBoost.toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        value={[parameters.creativityBoost]}
                        onValueChange={(value) => handleParameterChange("creativityBoost", value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Encourages the model to generate more unique and creative outputs.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Advanced parameters tab */}
                <TabsContent value="advanced" className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Frequency Penalty</Label>
                        <span className="text-sm text-muted-foreground">
                          {parameters.frequencyPenalty.toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        min={-2}
                        max={2}
                        step={0.1}
                        value={[parameters.frequencyPenalty]}
                        onValueChange={(value) => handleParameterChange("frequencyPenalty", value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Controls visual repetition: higher values penalize repeating elements.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Presence Penalty</Label>
                        <span className="text-sm text-muted-foreground">
                          {parameters.presencePenalty.toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        min={-2}
                        max={2}
                        step={0.1}
                        value={[parameters.presencePenalty]}
                        onValueChange={(value) => handleParameterChange("presencePenalty", value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Controls inclusion of unusual elements: higher values increase novelty.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Detail Enhancement</Label>
                        <span className="text-sm text-muted-foreground">
                          {parameters.detailEnhancement.toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        value={[parameters.detailEnhancement]}
                        onValueChange={(value) => handleParameterChange("detailEnhancement", value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Increases the level of detail and texture in generated images.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Options tab */}
                <TabsContent value="options" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="face-correction">Face Correction</Label>
                        <p className="text-xs text-muted-foreground">
                          Improves facial features and expressions in generated images
                        </p>
                      </div>
                      <Switch
                        id="face-correction"
                        checked={parameters.useFaceCorrection}
                        onCheckedChange={(checked) => handleParameterChange("useFaceCorrection", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="high-definition">High Definition</Label>
                        <p className="text-xs text-muted-foreground">
                          Generate images with enhanced resolution and clarity
                        </p>
                      </div>
                      <Switch
                        id="high-definition"
                        checked={parameters.useHighDefinition}
                        onCheckedChange={(checked) => handleParameterChange("useHighDefinition", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="maintain-palette">Maintain Original Palette</Label>
                        <p className="text-xs text-muted-foreground">
                          Preserves the original color palette when generating variations
                        </p>
                      </div>
                      <Switch
                        id="maintain-palette"
                        checked={parameters.maintainOriginalPalette}
                        onCheckedChange={(checked) => handleParameterChange("maintainOriginalPalette", checked)}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full">
                <Button variant="outline" onClick={resetForm}>
                  Reset Settings
                </Button>
                <Button 
                  onClick={handleSaveTuning}
                  disabled={saveTuningMutation.isPending}
                >
                  {saveTuningMutation.isPending ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Saving...</span>
                    </div>
                  ) : (
                    "Save Model Tuning"
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Right column - Saved tunings */}
        <div className="lg:col-span-4">
          <Card className="w-full feature-card">
            <CardHeader>
              <CardTitle>Saved Tunings</CardTitle>
              <CardDescription>
                Your custom model tunings for different creative needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTunings ? (
                <div className="flex justify-center items-center py-12">
                  <LoadingSpinner size="md" withText text="Loading your tunings..." />
                </div>
              ) : !userTunings || userTunings.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-md border-gray-700">
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-purple-500/10">
                    <i className="ri-settings-line text-2xl text-purple-500"></i>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Saved Tunings</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Customize and save AI model parameters to create your personal style presets
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userTunings.map((tuning: any) => (
                    <div 
                      key={tuning.id} 
                      className="p-4 border border-border rounded-md hover:bg-background/50 transition-colors cursor-pointer"
                      onClick={() => loadSavedTuning(tuning)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{tuning.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {tuning.modelName}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                          <i className="ri-more-2-fill"></i>
                        </Button>
                      </div>
                      {tuning.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {tuning.description}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2">
                        <div className="text-xs bg-background/50 px-2 py-1 rounded-full">
                          Temp: {tuning.parameters.temperature.toFixed(1)}
                        </div>
                        <div className="text-xs bg-background/50 px-2 py-1 rounded-full">
                          Creativity: {tuning.parameters.creativityBoost.toFixed(1)}
                        </div>
                        {tuning.parameters.useHighDefinition && (
                          <div className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                            HD
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info card */}
          <Card className="w-full feature-card mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <i className="ri-lightbulb-line mr-2 text-yellow-400"></i>
                Tips for Great Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <i className="ri-checkbox-circle-line text-green-400 shrink-0 mt-0.5"></i>
                  <span>Higher temperature (0.8+) creates more varied and creative images</span>
                </li>
                <li className="flex gap-2">
                  <i className="ri-checkbox-circle-line text-green-400 shrink-0 mt-0.5"></i>
                  <span>For photorealistic results, use high style fidelity with face correction</span>
                </li>
                <li className="flex gap-2">
                  <i className="ri-checkbox-circle-line text-green-400 shrink-0 mt-0.5"></i>
                  <span>Create different tunings for different styles (anime, photorealistic, etc.)</span>
                </li>
                <li className="flex gap-2">
                  <i className="ri-checkbox-circle-line text-green-400 shrink-0 mt-0.5"></i>
                  <span>Use negative penalties to emphasize specific elements in your images</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}