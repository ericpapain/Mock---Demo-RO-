import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "./components/layout/AppShell";
import Dashboard from "./pages/Dashboard";
import ChainView from "./pages/ChainView";
import Orders from "./pages/Orders";
import BOM from "./pages/BOM";
import Planning from "./pages/Planning";
import Stocks from "./pages/Stocks";
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
            <Route path="/" element={<Dashboard />} />
            <Route path="/chaine" element={<ChainView />} />
            <Route path="/commandes" element={<Orders />} />
            <Route path="/bom" element={<BOM />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/stocks" element={<Stocks />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
