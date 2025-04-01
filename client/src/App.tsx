import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import TextToImage from "@/pages/TextToImage";
import ImageToImage from "@/pages/ImageToImage";
import FaceCloning from "@/pages/FaceCloning";
import FaceEditor from "@/pages/FaceEditor";
import Gallery from "@/pages/Gallery";
import Login from "@/pages/Login";
import { useAuth } from "./hooks/useAuth";
import MainLayout from "./components/ui/layout/MainLayout";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    window.location.href = "/login";
    return null;
  }
  
  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      <Route path="/">
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </Route>
      
      <Route path="/text-to-image">
        <MainLayout>
          <TextToImage />
        </MainLayout>
      </Route>
      
      <Route path="/image-to-image">
        <MainLayout>
          <ImageToImage />
        </MainLayout>
      </Route>
      
      <Route path="/face-cloning">
        <MainLayout>
          <FaceCloning />
        </MainLayout>
      </Route>
      
      <Route path="/face-editor">
        <MainLayout>
          <FaceEditor />
        </MainLayout>
      </Route>
      
      <Route path="/gallery">
        <MainLayout>
          <Gallery />
        </MainLayout>
      </Route>
      
      <Route>
        <MainLayout>
          <NotFound />
        </MainLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
