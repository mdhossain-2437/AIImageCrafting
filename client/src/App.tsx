import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense } from "react";
import MainLayout from "./components/ui/layout/MainLayout";
import LoadingScreen from "./components/ui/LoadingScreen";
import { useAuth } from "./hooks/useAuth";
import AuthGuard from "./components/AuthGuard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";

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
const Profile = lazy(() => import("@/pages/Profile"));

// Protected route wrapper component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
	return (
		<Suspense fallback={<LoadingScreen message="Loading..." />}>
			<AuthGuard requireAuth={true}>
				<MainLayout>{children}</MainLayout>
			</AuthGuard>
		</Suspense>
	);
}

// Public route component - auth not required
function PublicRoute({ children }: { children: React.ReactNode }) {
	return (
		<Suspense fallback={<LoadingScreen message="Loading..." />}>
			<AuthGuard requireAuth={false}>{children}</AuthGuard>
		</Suspense>
	);
}

function Router() {
	return (
		<Suspense fallback={<LoadingScreen message="Loading app..." />}>
			<Switch>
				<Route path="/login">
					<PublicRoute>
						<Login />
					</PublicRoute>
				</Route>

				<Route path="/">
					<ProtectedRoute>
						<Suspense
							fallback={<LoadingScreen message="Loading dashboard..." />}
						>
							<Dashboard />
						</Suspense>
					</ProtectedRoute>
				</Route>

				<Route path="/text-to-image">
					<ProtectedRoute>
						<Suspense
							fallback={<LoadingScreen message="Loading text-to-image..." />}
						>
							<TextToImage />
						</Suspense>
					</ProtectedRoute>
				</Route>

				<Route path="/image-to-image">
					<ProtectedRoute>
						<Suspense
							fallback={<LoadingScreen message="Loading image-to-image..." />}
						>
							<ImageToImage />
						</Suspense>
					</ProtectedRoute>
				</Route>

				<Route path="/face-cloning">
					<ProtectedRoute>
						<Suspense
							fallback={<LoadingScreen message="Loading face cloning..." />}
						>
							<FaceCloning />
						</Suspense>
					</ProtectedRoute>
				</Route>

				<Route path="/face-editor">
					<ProtectedRoute>
						<Suspense
							fallback={<LoadingScreen message="Loading face editor..." />}
						>
							<FaceEditor />
						</Suspense>
					</ProtectedRoute>
				</Route>

				<Route path="/gallery">
					<ProtectedRoute>
						<Suspense fallback={<LoadingScreen message="Loading gallery..." />}>
							<Gallery />
						</Suspense>
					</ProtectedRoute>
				</Route>

				<Route path="/model-tuning">
					<ProtectedRoute>
						<Suspense
							fallback={<LoadingScreen message="Loading model tuning..." />}
						>
							<ModelTuning />
						</Suspense>
					</ProtectedRoute>
				</Route>

				<Route path="/profile">
					<ProtectedRoute>
						<Suspense fallback={<LoadingScreen message="Loading profile..." />}>
							<Profile />
						</Suspense>
					</ProtectedRoute>
				</Route>

				<Route>
					<ProtectedRoute>
						<Suspense fallback={<LoadingScreen />}>
							<NotFound />
						</Suspense>
					</ProtectedRoute>
				</Route>
			</Switch>
		</Suspense>
	);
}

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<Router />
				<Toaster />
			</AuthProvider>
		</QueryClientProvider>
	);
}

export default App;

const queryClient = new QueryClient();
