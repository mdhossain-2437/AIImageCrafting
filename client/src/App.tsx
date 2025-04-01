import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense } from "react";
import MainLayout from "./components/ui/layout/MainLayout";
import LoadingScreen from "./components/ui/LoadingScreen";

// Lazy load pages to improve performance
const NotFound = lazy(() => import("@/pages/not-found"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const TextToImage = lazy(() => import("@/pages/TextToImage"));
const ImageToImage = lazy(() => import("@/pages/ImageToImage"));
const FaceCloning = lazy(() => import("@/pages/FaceCloning"));
const FaceEditor = lazy(() => import("@/pages/FaceEditor"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const ModelTuning = lazy(() => import("@/pages/ModelTuning"));
const Login = lazy(() => import("@/pages/Login"));

function Router() {
  return (
    <Suspense fallback={<LoadingScreen message="Loading page..." />}>
      <Switch>
        <Route path="/login">
          <Suspense fallback={<LoadingScreen message="Preparing login..." />}>
            <Login />
          </Suspense>
        </Route>
        
        <Route path="/">
          <MainLayout>
            <Suspense fallback={<LoadingScreen message="Loading dashboard..." />}>
              <Dashboard />
            </Suspense>
          </MainLayout>
        </Route>
        
        <Route path="/text-to-image">
          <MainLayout>
            <Suspense fallback={<LoadingScreen message="Loading text-to-image..." />}>
              <TextToImage />
            </Suspense>
          </MainLayout>
        </Route>
        
        <Route path="/image-to-image">
          <MainLayout>
            <Suspense fallback={<LoadingScreen message="Loading image-to-image..." />}>
              <ImageToImage />
            </Suspense>
          </MainLayout>
        </Route>
        
        <Route path="/face-cloning">
          <MainLayout>
            <Suspense fallback={<LoadingScreen message="Loading face cloning..." />}>
              <FaceCloning />
            </Suspense>
          </MainLayout>
        </Route>
        
        <Route path="/face-editor">
          <MainLayout>
            <Suspense fallback={<LoadingScreen message="Loading face editor..." />}>
              <FaceEditor />
            </Suspense>
          </MainLayout>
        </Route>
        
        <Route path="/gallery">
          <MainLayout>
            <Suspense fallback={<LoadingScreen message="Loading gallery..." />}>
              <Gallery />
            </Suspense>
          </MainLayout>
        </Route>
        
        <Route path="/model-tuning">
          <MainLayout>
            <Suspense fallback={<LoadingScreen message="Loading model tuning..." />}>
              <ModelTuning />
            </Suspense>
          </MainLayout>
        </Route>
        
        <Route>
          <MainLayout>
            <Suspense fallback={<LoadingScreen />}>
              <NotFound />
            </Suspense>
          </MainLayout>
        </Route>
      </Switch>
    </Suspense>
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
