import { ReactNode } from 'react';
import { usePortal } from '@/contexts/PortalContext';
import { CustomerSidebar } from '@/components/layout/CustomerSidebar';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

interface PortalLayoutProps {
  children: ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  const { isAdminPortal, isCustomerPortal } = usePortal();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {isAdminPortal && <AdminSidebar />}
        {isCustomerPortal && <CustomerSidebar />}
        
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}