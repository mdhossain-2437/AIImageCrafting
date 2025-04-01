import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import LoginDialog from "./LoginDialog";
import { useToast } from "@/hooks/use-toast";

interface ImageDownloadButtonProps {
  imageUrl: string;
  filename?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

export default function ImageDownloadButton({
  imageUrl,
  filename = "artificeai-image.png",
  variant = "default",
  size = "default",
  className = "",
  children,
}: ImageDownloadButtonProps) {
  const { user, isGuest, requireAuth } = useAuth();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const { toast } = useToast();

  const downloadImage = async () => {
    try {
      // Fetch the image as a blob
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to download image");
      }
      
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a link element and trigger a download
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: "Your image is downloading",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "There was a problem downloading your image",
      });
    }
  };

  const handleClick = () => {
    if (isGuest) {
      // Open dialog for guest users
      setLoginDialogOpen(true);
    } else if (user) {
      // Authorized users can download directly
      downloadImage();
    } else {
      // No user at all, use requireAuth to handle redirect
      requireAuth("download images");
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
      >
        {children || (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download
          </>
        )}
      </Button>
      
      <LoginDialog
        isOpen={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        title="Login to Download"
        description="Please sign in to download this AI-generated image"
      />
    </>
  );
}