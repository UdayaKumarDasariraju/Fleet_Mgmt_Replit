import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

import Shell from "@/components/Shell";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import VehicleDetails from "@/pages/VehicleDetails";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Instead of redirecting immediately, we could render Landing or redirect
    // But since this is a protected route wrapper, a redirect is appropriate
    // However, Landing is at /, so for any other protected route, we redirect to login?
    // Actually simpler: if not auth, redirect to / which shows Landing if we set it up that way.
    // BUT Landing is public.
    // Let's just return null and useEffect redirect in real apps, or just render Landing.
    // For this specific structure:
    setLocation("/");
    return null;
  }

  return (
    <Shell>
      <Component />
    </Shell>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/">
        {isAuthenticated ? <Shell><Dashboard /></Shell> : <Landing />}
      </Route>
      
      <Route path="/vehicles/:id">
        {isAuthenticated ? <Shell><VehicleDetails /></Shell> : <Landing />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
