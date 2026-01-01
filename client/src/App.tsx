import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Gym from "@/pages/Gym";
import PatternDetail from "@/pages/PatternDetail";
import ProblemSolver from "@/pages/ProblemSolver";
import Interview from "@/pages/Interview";
import InterviewSession from "@/pages/InterviewSession";
import NotFound from "@/pages/not-found";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!user) {
    window.location.href = "/api/login"; // Redirect to Replit login
    return null;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard">
          {() => <ProtectedRoute component={Dashboard} />}
        </Route>
        <Route path="/gym" component={Gym} />
        <Route path="/gym/pattern/:id" component={PatternDetail} />
        <Route path="/problem/:id" component={ProblemSolver} />
        <Route path="/interview">
          {() => <ProtectedRoute component={Interview} />}
        </Route>
        <Route path="/interview/session/:id">
          {() => <ProtectedRoute component={InterviewSession} />}
        </Route>
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
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
