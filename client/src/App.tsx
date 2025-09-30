import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import UserDashboard from "@/pages/user-dashboard";
import AccountSuccess from "@/pages/account-success";
import AccessCodesPage from "@/pages/access-codes";

function Router() {
  // Check if we're on admin domain and redirect appropriately
  const isAdminDomain = window.location.hostname.includes('admin') || window.location.pathname.startsWith('/admin');
  
  return (
    <Switch>
      <Route path="/" component={isAdminDomain ? () => <AdminLogin /> : Home} />
      <Route path="/dashboard" component={UserDashboard} />
      <Route path="/user-dashboard" component={UserDashboard} />
      <Route path="/access-codes" component={AccessCodesPage} />
      <Route path="/account-success/:applicationId" component={AccountSuccess} />
      <Route path="/admin" component={() => <AdminLogin />} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
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
