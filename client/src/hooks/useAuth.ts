import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export function useAuth() {
  const authContext = useContext(AuthContext);
  
  if (authContext === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return authContext;
}
