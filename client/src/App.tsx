import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Web3Provider } from "@/lib/web3Context";
import { AuthProvider, useAuth } from "@/lib/authContext";
import { Header } from "@/components/Header";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GalleryAccess } from "@/components/GalleryAccess";
import Home from "@/pages/Home";
import Gallery from "@/pages/Gallery";
import ArtistDashboard from "@/pages/ArtistDashboard";
import VisitorDashboard from "@/pages/VisitorDashboard";
import DaoGovernance from "@/pages/DaoGovernance";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, user } = useAuth();

  // If not authenticated, show auth page
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route component={Auth} />
      </Switch>
    );
  }

  // If authenticated, show app with role-based navigation
  return (
    <>
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        
        {/* Gallery - wrapped with ticket access check for visitors */}
        {(user?.role === 'visitor' || user?.role === 'artist' || user?.role === 'dao-member') && (
          <Route path="/gallery">
            <GalleryAccess>
              <Gallery />
            </GalleryAccess>
          </Route>
        )}
        
        {/* Artist Portal - visible only to artists */}
        <Route path="/artist">
          <ProtectedRoute requiredRole="artist">
            <ArtistDashboard />
          </ProtectedRoute>
        </Route>
        
        {/* Visitor Portal - visible only to visitors */}
        <Route path="/visitor">
          <ProtectedRoute requiredRole="visitor">
            <VisitorDashboard />
          </ProtectedRoute>
        </Route>
        
        {/* DAO Portal - visible only to DAO members */}
        <Route path="/dao">
          <ProtectedRoute requiredRole="dao-member">
            <DaoGovernance />
          </ProtectedRoute>
        </Route>
        
        <Route path="/auth" component={Auth} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Web3Provider>
          <AuthProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Router />
            </div>
            <Toaster />
          </AuthProvider>
        </Web3Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
