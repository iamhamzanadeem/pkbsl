import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Settings, 
  Shield, 
  Truck, 
  FileText, 
  Database,
  LogOut
} from 'lucide-react';
import pkbslLogo from '@/assets/pkbsl-logo.png';

export function AdminSidebar() {
  const { logout, user } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      url: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Customers',
      url: '/admin/customers',
      icon: Building2,
    },
    {
      title: 'HSE Monitoring',
      url: '/admin/hse',
      icon: Shield,
    },
    {
      title: 'All Shipments',
      url: '/admin/shipments',
      icon: Truck,
    },
    {
      title: 'Invoices',
      url: '/admin/invoices',
      icon: FileText,
    },
    {
      title: 'Data Management',
      url: '/admin/data',
      icon: Database,
    },
    {
      title: 'Users',
      url: '/admin/users',
      icon: Users,
    },
    {
      title: 'System Settings',
      url: '/admin/settings',
      icon: Settings,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
      : 'hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground';

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-4">
          <img 
            src={pkbslLogo} 
            alt="PKBSL Logo" 
            className="h-10 w-auto object-contain"
          />
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold text-sidebar-foreground">
              PKBSL Admin
            </h2>
            <p className="text-xs text-sidebar-foreground/60">
              System Administration
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
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