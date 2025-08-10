import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  Truck, 
  FileText, 
  Shield, 
  AlertTriangle,
  TrendingUp,
  Server,
  CalendarDays
} from 'lucide-react';

const systemKPIs = [
  {
    title: 'Total Customers',
    value: '6',
    change: '+1 this month',
    trend: 'up',
    icon: Building2,
    color: 'primary',
  },
  {
    title: 'Active Users',
    value: '24',
    change: '+3 this week',
    trend: 'up',
    icon: Users,
    color: 'success',
  },
  {
    title: 'Total Shipments',
    value: '1,247',
    change: '+89 this week',
    trend: 'up',
    icon: Truck,
    color: 'primary',
  },
  {
    title: 'System Health',
    value: '99.9%',
    change: 'All systems operational',
    trend: 'up',
    icon: Server,
    color: 'success',
  },
];

const customerActivity = [
  { name: 'Shell Pakistan', shipments: 45, status: 'Active', health: 98 },
  { name: 'Siemens', shipments: 32, status: 'Active', health: 95 },
  { name: 'UniLever', shipments: 28, status: 'Active', health: 92 },
  { name: 'AGS', shipments: 19, status: 'Active', health: 89 },
  { name: 'Exide', shipments: 15, status: 'Warning', health: 76 },
];

const systemAlerts = [
  {
    id: 1,
    type: 'warning',
    message: 'API rate limit approaching for Tracking Service',
    time: '5 minutes ago',
  },
  {
    id: 2,
    type: 'info',
    message: 'Scheduled maintenance completed successfully',
    time: '2 hours ago',
  },
  {
    id: 3,
    type: 'success',
    message: 'New customer portal deployed for AGS',
    time: '1 day ago',
  },
];

export function AdminDashboard() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              System overview and administration center
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <Select defaultValue="7days">
            <SelectTrigger className="w-[150px]">
              <SelectValue />
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

      {/* System KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemKPIs.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${
                kpi.color === 'success' ? 'text-success' :
                kpi.color === 'primary' ? 'text-primary' :
                'text-muted-foreground'
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customer Activity and System Status */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customer Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Activity</CardTitle>
            <CardDescription>Customer portal usage and health status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerActivity.map((customer) => (
                <div key={customer.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{customer.name}</p>
                      <Badge variant={customer.status === 'Active' ? 'secondary' : 'destructive'}>
                        {customer.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {customer.shipments} shipments this week
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm font-medium">{customer.health}%</div>
                    <Progress value={customer.health} className="w-16 h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Recent system notifications and status updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {alert.type === 'warning' && (
                      <AlertTriangle className="h-5 w-5 text-warning" />
                    )}
                    {alert.type === 'info' && (
                      <Shield className="h-5 w-5 text-primary" />
                    )}
                    {alert.type === 'success' && (
                      <TrendingUp className="h-5 w-5 text-success" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">HSE Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">12</div>
            <p className="text-xs text-muted-foreground">This week across all customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">PKR 2.4M</div>
            <p className="text-xs text-muted-foreground">This month from all customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">API Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847K</div>
            <p className="text-xs text-muted-foreground">This week across all services</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}