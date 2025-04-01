import { apiRequest } from "./queryClient";

export interface GenerateImageParams {
  prompt: string;
  model: string;
  width?: number;
  height?: number;
  userId?: number;
}

export interface ImageToImageParams extends GenerateImageParams {
  image: File;
  strength?: number;
}

export interface FaceCloningParams extends GenerateImageParams {
  face: File;
}

export interface FaceEditingParams {
  image: File;
  adjustments: Record<string, number>;
  userId?: number;
}

export interface ObjectEditingParams {
  image: File;
  prompt: string;
  userId?: number;
}

export interface GenerateImageResponse {
  success: boolean;
  imageUrl: string;
  image?: any;
}

// Text to Image API
export async function generateTextToImage(params: GenerateImageParams): Promise<GenerateImageResponse> {
  const response = await apiRequest("POST", "/api/images/text-to-image", params);
  return response.json();
}

// Image to Image API
export async function generateImageToImage(params: ImageToImageParams): Promise<GenerateImageResponse> {
  const formData = new FormData();
  formData.append("image", params.image);
  formData.append("prompt", params.prompt);
  formData.append("model", params.model);
  
  if (params.strength) {
    formData.append("strength", params.strength.toString());
  }
  
  if (params.userId) {
    formData.append("userId", params.userId.toString());
  }
  
  const response = await fetch("/api/images/image-to-image", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  
  return response.json();
}

// Face Cloning API
export async function generateFaceCloning(params: FaceCloningParams): Promise<GenerateImageResponse> {
  const formData = new FormData();
  formData.append("face", params.face);
  formData.append("prompt", params.prompt);
  formData.append("model", params.model);
  
  if (params.userId) {
    formData.append("userId", params.userId.toString());
  }
  
  const response = await fetch("/api/images/face-cloning", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  
  return response.json();
}

// Get images for a user
export async function getUserImages(userId?: number, limit = 20, offset = 0) {
  let url = `/api/images?limit=${limit}&offset=${offset}`;
  if (userId) {
    url += `&userId=${userId}`;
  }
  
  const response = await fetch(url, {
    credentials: "include",
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  
  return response.json();
}

// Get style presets
export async function getStylePresets() {
  const response = await fetch("/api/style-presets", {
    credentials: "include",
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  
  return response.json();
}

// Get AI models
export async function getAiModels() {
  const response = await fetch("/api/ai-models", {
    credentials: "include",
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  
  return response.json();
}

// Authentication
export async function login(username: string, password: string) {
  const response = await apiRequest("POST", "/api/auth/login", { username, password });
  return response.json();
}

export async function register(userData: any) {
  const response = await apiRequest("POST", "/api/auth/register", userData);
  return response.json();
}

// Face Editing API
export async function editFace(params: FaceEditingParams): Promise<GenerateImageResponse> {
  const formData = new FormData();
  formData.append("image", params.image);
  formData.append("adjustments", JSON.stringify(params.adjustments));
  
  if (params.userId) {
    formData.append("userId", params.userId.toString());
  }
  
  const response = await fetch("/api/images/edit-face", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  
  return response.json();
}

// Object Editing API
export async function editObjects(params: ObjectEditingParams): Promise<GenerateImageResponse> {
  const formData = new FormData();
  formData.append("image", params.image);
  formData.append("prompt", params.prompt);
  
  if (params.userId) {
    formData.append("userId", params.userId.toString());
  }
  
  const response = await fetch("/api/images/edit-objects", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  
  return response.json();
}
