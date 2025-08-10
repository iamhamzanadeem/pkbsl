import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePortal } from '@/contexts/PortalContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Shield, Truck, FileText, LogOut, Building2 } from 'lucide-react';

export function CustomerSidebar() {
  const { logout, user } = useAuth();
  const { currentPortal, portalName } = usePortal();
  const location = useLocation();

  if (!currentPortal || !portalName) return null;

  const menuItems = [
    {
      title: 'Dashboard',
      url: `/${portalName}/dashboard`,
      icon: LayoutDashboard,
      enabled: currentPortal.features.dashboard,
    },
    {
      title: 'HSE Monitoring',
      url: `/${portalName}/hse`,
      icon: Shield,
      enabled: currentPortal.features.hse,
    },
    {
      title: 'Shipments',
      url: `/${portalName}/shipments`,
      icon: Truck,
      enabled: currentPortal.features.shipments,
    },
    {
      title: 'Invoices',
      url: `/${portalName}/invoices`,
      icon: FileText,
      enabled: currentPortal.features.invoices,
    },
  ].filter(item => item.enabled);

  const isActive = (path: string) => location.pathname === path;

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
      : 'hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground';

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold text-sidebar-foreground">
              {currentPortal.displayName}
            </h2>
            <p className="text-xs text-sidebar-foreground/60">
              Logistics Portal
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="p-3">
          <div className="mb-3 text-xs text-sidebar-foreground/60">
            Welcome, {user?.name}
          </div>
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <LogOut className="h-4 w-4" />
            <span className="ml-2">Sign Out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}