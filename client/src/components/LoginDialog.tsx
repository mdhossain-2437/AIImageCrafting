import React from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function LoginDialog({
  isOpen,
  onClose,
  title = "Login Required",
  description = "Please sign in to download this image",
}: LoginDialogProps) {
  const [_, navigate] = useLocation();
  const { user } = useAuth();

  // If the user is already logged in, close the dialog
  React.useEffect(() => {
    if (user) {
      onClose();
    }
  }, [user, onClose]);

  const handleLoginClick = () => {
    navigate("/login");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-md bg-black/50 border border-white/10 shadow-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>

          <p className="text-center text-sm">
            Signing in allows you to download, save, and share your AI-generated images.
            You'll also get access to premium features and higher resolution options.
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto border-white/10 hover:bg-white/5">
            Continue as Guest
          </Button>
          <Button onClick={handleLoginClick} className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-500">
            Sign In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}