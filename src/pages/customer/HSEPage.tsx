import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, Car, Clock, Siren, MapPin, CalendarDays } from 'lucide-react';
import { usePortal } from '@/contexts/PortalContext';

const hseKPIs = [
  {
    title: 'Road Incidents',
    value: '3',
    change: '-2 from last week',
    trend: 'down',
    icon: AlertTriangle,
    color: 'destructive',
  },
  {
    title: 'Fatigue Alerts',
    value: '12',
    change: '+3 from last week',
    trend: 'up',
    icon: Clock,
    color: 'warning',
  },
  {
    title: 'Overspeed Events',
    value: '8',
    change: '-5 from last week',
    trend: 'down',
    icon: Car,
    color: 'at-risk',
  },
  {
    title: 'Safety Score',
    value: '87%',
    change: '+2% from last week',
    trend: 'up',
    icon: Shield,
    color: 'success',
  },
];

const recentIncidents = [
  {
    id: '1',
    type: 'Overspeed',
    driver: 'Ahmad Khan',
    location: 'M2 Motorway, KM 45',
    time: '2 hours ago',
    severity: 'Medium',
    status: 'Resolved',
  },
  {
    id: '2',
    type: 'Fatigue Alert',
    driver: 'Muhammad Ali',
    location: 'GT Road, Gujranwala',
    time: '4 hours ago',
    severity: 'High',
    status: 'Under Review',
  },
  {
    id: '3',
    type: 'Harsh Braking',
    driver: 'Hassan Ahmed',
    location: 'Lahore Ring Road',
    time: '6 hours ago',
    severity: 'Low',
    status: 'Acknowledged',
  },
];

export function HSEPage() {
  const { currentPortal } = usePortal();
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  if (!currentPortal?.features.hse) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">HSE Monitoring</h1>
            <p className="text-muted-foreground">HSE monitoring is not enabled for your portal.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">HSE Monitoring</h1>
            <p className="text-muted-foreground">
              Health, Safety & Environmental monitoring for {currentPortal.displayName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
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

      {/* HSE KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {hseKPIs.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${
                kpi.color === 'success' ? 'text-success' :
                kpi.color === 'warning' ? 'text-warning' :
                kpi.color === 'destructive' ? 'text-destructive' :
                kpi.color === 'at-risk' ? 'text-at-risk' : 'text-muted-foreground'
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Safety Metrics and Recent Incidents */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Safety Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Safety Metrics</CardTitle>
            <CardDescription>Weekly safety performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Driver Compliance</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Speed Compliance</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Fatigue Management</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Route Adherence</span>
                <span>96%</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
            <CardDescription>Latest safety and compliance alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIncidents.map((incident) => (
                <div key={incident.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    <Siren className={`h-5 w-5 ${
                      incident.severity === 'High' ? 'text-destructive' :
                      incident.severity === 'Medium' ? 'text-warning' :
                      'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{incident.type}</p>
                      <Badge variant={
                        incident.severity === 'High' ? 'destructive' :
                        incident.severity === 'Medium' ? 'secondary' :
                        'outline'
                      } className="text-xs">
                        {incident.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Driver: {incident.driver}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {incident.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{incident.time}</span>
                      <Badge variant="outline" className="text-xs">
                        {incident.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}