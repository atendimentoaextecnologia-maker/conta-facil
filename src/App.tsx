import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import PanelDemo from "./pages/PanelDemo";
import PainelEletrica from "./pages/PainelEletrica";
import PainelVarejo from "./pages/PainelVarejo";
import PainelProvedor from "./pages/PainelProvedor";
import PainelEnem from "./pages/PainelEnem";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/paineis/:slug" element={<PanelDemo />} />
            <Route path="/paineis-eletrica" element={<PainelEletrica />} />
            <Route path="/paineis-varejo" element={<PainelVarejo />} />
            <Route path="/paineis-provedor" element={<PainelProvedor />} />
            <Route path="/paineis-enem" element={<PainelEnem />} />
            <Route path="/app" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
