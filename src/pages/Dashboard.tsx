import { DashboardKPIs } from "@/components/dashboard/DashboardKPIs";
import { ShipmentMap } from "@/components/dashboard/ShipmentMap";
import { ShipmentsTable } from "@/components/dashboard/ShipmentsTable";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, BuildingIcon } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your operational overview.</p>
          </div>
        </div>
        
        {/* Global Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BuildingIcon className="h-4 w-4 text-muted-foreground" />
            <Select defaultValue="shell">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="shell">Shell Pakistan</SelectItem>
                <SelectItem value="siemens">Siemens</SelectItem>
                <SelectItem value="unilever">UniLever</SelectItem>
                <SelectItem value="ags">AGS</SelectItem>
                <SelectItem value="exide">Exide</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <Select defaultValue="7days">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <DashboardKPIs />

      {/* Map and Table Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <ShipmentMap />
        <div className="lg:col-span-3">
          <ShipmentsTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;