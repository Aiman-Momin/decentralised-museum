import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Web3Provider } from "@/lib/web3Context";
import { Header } from "@/components/Header";
import Home from "@/pages/Home";
import Gallery from "@/pages/Gallery";
import ArtistDashboard from "@/pages/ArtistDashboard";
import VisitorDashboard from "@/pages/VisitorDashboard";
import DaoGovernance from "@/pages/DaoGovernance";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/artist" component={ArtistDashboard} />
        <Route path="/visitor" component={VisitorDashboard} />
        <Route path="/dao" component={DaoGovernance} />
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
          <div className="min-h-screen bg-background text-foreground">
            <Router />
          </div>
          <Toaster />
        </Web3Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
