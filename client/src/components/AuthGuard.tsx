import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import LoadingScreen from "@/components/ui/LoadingScreen";

// This component protects routes that require authentication
interface AuthGuardProps {
	children: ReactNode;
	requireAuth?: boolean;
}

export default function AuthGuard({
	children,
	requireAuth = true,
}: AuthGuardProps) {
	const { user, loading } = useAuth();
	const [location, navigate] = useLocation();

	useEffect(() => {
		// Don't perform redirects while authentication is being verified
		if (loading) return;

		// Handle authentication redirects
		if (location === "/login") {
			// If user is logged in and on login page, redirect to dashboard
			if (user) {
				navigate("/");
			}
		} else if (requireAuth && !user) {
			// If auth is required but user is not logged in, redirect to login
			navigate("/login");
		}
	}, [user, loading, location, navigate, requireAuth]);

	// While checking authentication state, show loading screen
	if (loading) {
		return <LoadingScreen message="Verifying authentication..." />;
	}

	// For login page (requireAuth=false): render if user is NOT logged in
	// For protected pages (requireAuth=true): render if user IS logged in
	if (
		(requireAuth && user) ||
		(!requireAuth && !user) ||
		location === "/login"
	) {
		return <>{children}</>;
	}

	// Rendering null while redirecting
	return <LoadingScreen message="Redirecting..." />;
}
