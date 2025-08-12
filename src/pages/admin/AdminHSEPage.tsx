import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  Users, 
  FileText,
  TrendingUp,
  AlertCircle,
  Download
} from 'lucide-react';

const safetyMetrics = [
  { label: 'Safety Score', value: 94, target: 95, trend: '+2%' },
  { label: 'Incident Rate', value: 0.8, target: 1.0, trend: '-15%' },
  { label: 'Training Compliance', value: 98, target: 100, trend: '+5%' },
  { label: 'Equipment Safety', value: 96, target: 98, trend: '+3%' }
];

const recentIncidents = [
  {
    id: 'INC001',
    type: 'Minor',
    description: 'Vehicle tire puncture on Highway M2',
    driver: 'Ahmed Khan',
    date: '2024-01-15',
    status: 'resolved'
  },
  {
    id: 'INC002',
    type: 'Safety',
    description: 'Driver fatigue reported during rest stop',
    driver: 'Muhammad Ali',
    date: '2024-01-14',
    status: 'investigating'
  }
];

export function AdminHSEPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">HSE Monitoring</h1>
          <p className="text-muted-foreground">
            Health, Safety & Environment monitoring across all operations
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          HSE Report
        </Button>
      </div>

      {/* Safety Alert */}
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Safety Notice</AlertTitle>
        <AlertDescription className="text-yellow-700">
          2 drivers require refresher safety training by end of month. Schedule training sessions immediately.
        </AlertDescription>
      </Alert>

      {/* HSE Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Safety Score</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94%</div>
            <Progress value={94} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Target: 95%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Under investigation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Compliance</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <Progress value={98} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">156/159 drivers certified</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment Health</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <Progress value={96} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">234/244 vehicles compliant</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Safety Metrics</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {safetyMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{metric.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">{metric.value}%</span>
                    <Badge variant={metric.value >= metric.target ? "default" : "secondary"}>
                      {metric.trend}
                    </Badge>
                  </div>
                  <Progress value={metric.value} className="mb-2" />
                  <p className="text-sm text-muted-foreground">Target: {metric.target}%</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
              <CardDescription>Latest safety incidents and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentIncidents.map((incident) => (
                  <div key={incident.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={incident.type === 'Minor' ? 'secondary' : 'destructive'}>
                          {incident.type}
                        </Badge>
                        <span className="font-mono text-sm">{incident.id}</span>
                      </div>
                      <p className="font-medium">{incident.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Driver: {incident.driver} • {incident.date}
                      </p>
                    </div>
                    <Badge variant={incident.status === 'resolved' ? 'default' : 'secondary'}>
                      {incident.status === 'resolved' ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                      {incident.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Overview</CardTitle>
              <CardDescription>Driver training status and upcoming sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">156</div>
                    <p className="text-sm text-muted-foreground">Certified Drivers</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">3</div>
                    <p className="text-sm text-muted-foreground">Pending Training</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <p className="text-sm text-muted-foreground">Upcoming Sessions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Overview</CardTitle>
              <CardDescription>Regulatory compliance status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Vehicle Inspections</h4>
                      <p className="text-sm text-muted-foreground">Monthly safety inspections</p>
                    </div>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Compliant
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Driver Certifications</h4>
                      <p className="text-sm text-muted-foreground">Valid licenses and permits</p>
                    </div>
                    <Badge variant="secondary">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      3 Pending
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Environmental Standards</h4>
                      <p className="text-sm text-muted-foreground">Emission and waste compliance</p>
                    </div>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Compliant
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}