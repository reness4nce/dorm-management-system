import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ResidentProvider } from "./contexts/ResidentContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./pages/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Residents from "./pages/Residents";
import CheckoutForms from "./pages/CheckoutForms";
import Clearance from "./pages/Clearance";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ResidentProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/residents"
                element={
                  <ProtectedRoute allowedRoles={["admin", "staff"]}>
                    <Layout>
                      <Residents />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/checkout-forms"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CheckoutForms />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/clearance"
                element={
                  <ProtectedRoute allowedRoles={["admin", "staff"]}>
                    <Layout>
                      <Clearance />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/reports"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Layout>
                      <Reports />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ResidentProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;