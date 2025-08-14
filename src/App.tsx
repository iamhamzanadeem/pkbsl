import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PortalProvider } from "@/contexts/PortalContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PortalLayout } from "@/layouts/PortalLayout";
import { LoginPage } from "@/pages/LoginPage";
import { CustomerDashboard } from "@/pages/customer/CustomerDashboard";
import { HSEPage } from "@/pages/customer/HSEPage";
import { ShipmentsPage } from "@/pages/customer/ShipmentsPage";
import { InvoicesPage } from "@/pages/customer/InvoicesPage";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminShipmentsPage } from "@/pages/admin/AdminShipmentsPage";
import { AdminHSEPage } from "@/pages/admin/AdminHSEPage";
import { AdminInvoicesPage } from "@/pages/admin/AdminInvoicesPage";
import { DataManagementPage } from "@/pages/admin/DataManagementPage";
import { SystemSettingsPage } from "@/pages/admin/SystemSettingsPage";
import { UnauthorizedPage } from "@/pages/UnauthorizedPage";
import { RootRedirect } from "@/components/auth/RootRedirect";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PortalProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/login/:portal" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              {/* Admin Portal Routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute requiredRole="admin">
                  <PortalLayout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="customers" element={<div className="p-6"><h1 className="text-2xl font-bold">Customer Management</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                      <Route path="users" element={<div className="p-6"><h1 className="text-2xl font-bold">User Management</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                      <Route path="shipments" element={<AdminShipmentsPage />} />
                      <Route path="hse" element={<AdminHSEPage />} />
                      <Route path="invoices" element={<AdminInvoicesPage />} />
                      <Route path="data" element={<DataManagementPage />} />
                      <Route path="settings" element={<SystemSettingsPage />} />
                      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                  </PortalLayout>
                </ProtectedRoute>
              } />

              {/* Customer Portal Routes */}
              <Route path="/customer-portal/*" element={
                <ProtectedRoute>
                  <PortalLayout>
                    <Routes>
                      <Route path="dashboard" element={<CustomerDashboard />} />
                      <Route path="hse" element={<HSEPage />} />
                      <Route path="shipments" element={<ShipmentsPage />} />
                      <Route path="invoices" element={<InvoicesPage />} />
                      <Route path="*" element={<Navigate to="/customer-portal/dashboard" replace />} />
                    </Routes>
                  </PortalLayout>
                </ProtectedRoute>
              } />

              {/* Root redirect */}
              <Route path="/" element={<RootRedirect />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PortalProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
