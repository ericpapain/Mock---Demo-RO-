import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "./components/layout/AppShell";
import GlobalNetwork from "./pages/GlobalNetwork";
import FleetRoutes from "./pages/FleetRoutes";
import ContainerFlow from "./pages/ContainerFlow";
import Stowage3D from "./pages/Stowage3D";
import Risk from "./pages/Risk";
import OptimCenter from "./pages/OptimCenter";
import Explainability from "./pages/Explainability";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner theme="dark" />
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<GlobalNetwork />} />
            <Route path="/fleet" element={<FleetRoutes />} />
            <Route path="/containers" element={<ContainerFlow />} />
            <Route path="/stowage" element={<Stowage3D />} />
            <Route path="/risk" element={<Risk />} />
            <Route path="/optim" element={<OptimCenter />} />
            <Route path="/explain" element={<Explainability />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
