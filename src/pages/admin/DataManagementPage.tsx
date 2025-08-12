import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Database, 
  Upload, 
  Download, 
  RefreshCw, 
  FileText, 
  HardDrive,
  Activity,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Archive,
  Shield
} from 'lucide-react';

const systemStats = [
  { label: 'Database Size', value: '2.4 GB', usage: 68, limit: '5 GB' },
  { label: 'Active Records', value: '124,567', growth: '+2.3%' },
  { label: 'Backup Status', value: 'Current', lastBackup: '2 hours ago' },
  { label: 'Data Integrity', value: '99.9%', status: 'healthy' }
];

const recentJobs = [
  {
    id: 'JOB001',
    type: 'Data Export',
    description: 'Customer shipment report - Shell Pakistan',
    status: 'completed',
    time: '2 minutes ago',
    size: '4.2 MB'
  },
  {
    id: 'JOB002',
    type: 'Data Import',
    description: 'Vehicle tracking data batch update',
    status: 'running',
    time: '5 minutes ago',
    progress: 78
  },
  {
    id: 'JOB003',
    type: 'Backup',
    description: 'Scheduled daily database backup',
    status: 'completed',
    time: '2 hours ago',
    size: '1.2 GB'
  }
];

export function DataManagementPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Management</h1>
          <p className="text-muted-foreground">
            System data management, backups, and maintenance operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Data
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Create Backup
          </Button>
        </div>
      </div>

      {/* System Health Alert */}
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">System Health: Excellent</AlertTitle>
        <AlertDescription className="text-green-700">
          All data systems are operating normally. Last backup completed successfully 2 hours ago.
        </AlertDescription>
      </Alert>

      {/* System Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 GB</div>
            <Progress value={68} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">68% of 5 GB limit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Records</CardTitle>
            <Database className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124.5K</div>
            <p className="text-xs text-muted-foreground">+2.3% this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Integrity</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">System health excellent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Archive className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h ago</div>
            <p className="text-xs text-muted-foreground">Automatic daily backup</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="import">Data Import</TabsTrigger>
          <TabsTrigger value="export">Data Export</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Data Operations</CardTitle>
                <CardDescription>Latest import, export, and backup activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{job.type}</Badge>
                          <span className="font-mono text-sm">{job.id}</span>
                        </div>
                        <p className="text-sm font-medium">{job.description}</p>
                        <p className="text-xs text-muted-foreground">{job.time}</p>
                      </div>
                      <div className="text-right">
                        {job.status === 'running' ? (
                          <div className="space-y-1">
                            <Badge variant="secondary">
                              <Activity className="h-3 w-3 mr-1 animate-pulse" />
                              Running
                            </Badge>
                            <Progress value={job.progress} className="w-20" />
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <Badge variant="default">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                            {job.size && <p className="text-xs text-muted-foreground">{job.size}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Storage Analysis</CardTitle>
                <CardDescription>Database storage breakdown by data type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Shipment Data</span>
                    <div className="flex items-center gap-2">
                      <Progress value={45} className="w-20" />
                      <span className="text-sm font-medium">1.1 GB</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">User & Customer Data</span>
                    <div className="flex items-center gap-2">
                      <Progress value={20} className="w-20" />
                      <span className="text-sm font-medium">480 MB</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Vehicle Tracking</span>
                    <div className="flex items-center gap-2">
                      <Progress value={25} className="w-20" />
                      <span className="text-sm font-medium">600 MB</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System Logs</span>
                    <div className="flex items-center gap-2">
                      <Progress value={10} className="w-20" />
                      <span className="text-sm font-medium">220 MB</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Import</CardTitle>
              <CardDescription>Import data from external sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-6 border-2 border-dashed rounded-lg">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">Shipment Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">Import shipment records from CSV or Excel</p>
                  <Button size="sm">Choose File</Button>
                </div>
                <div className="text-center p-6 border-2 border-dashed rounded-lg">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">Customer Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">Import customer information</p>
                  <Button size="sm">Choose File</Button>
                </div>
                <div className="text-center p-6 border-2 border-dashed rounded-lg">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">Vehicle Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">Import vehicle and tracking data</p>
                  <Button size="sm">Choose File</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>Export system data for analysis or backup</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="font-medium">All Shipments</h3>
                        <p className="text-sm text-muted-foreground">Complete shipment database</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">CSV</Button>
                      <Button size="sm" variant="outline">Excel</Button>
                      <Button size="sm" variant="outline">PDF</Button>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="h-8 w-8 text-green-500" />
                      <div>
                        <h3 className="font-medium">Customer Reports</h3>
                        <p className="text-sm text-muted-foreground">Customer-specific data</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">CSV</Button>
                      <Button size="sm" variant="outline">Excel</Button>
                      <Button size="sm" variant="outline">PDF</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>Manage system backups and restore operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Automatic Daily Backup</h4>
                    <p className="text-sm text-muted-foreground">Last backup: 2 hours ago</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button className="h-20">
                    <div className="text-center">
                      <Archive className="h-6 w-6 mx-auto mb-1" />
                      <div>Create Manual Backup</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-20">
                    <div className="text-center">
                      <RefreshCw className="h-6 w-6 mx-auto mb-1" />
                      <div>Restore from Backup</div>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
              <CardDescription>Database optimization and maintenance tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Database Optimization</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Optimize database performance and clean up unused data
                    </p>
                    <Button size="sm">Run Optimization</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Data Cleanup</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Remove old logs and temporary files
                    </p>
                    <Button size="sm" variant="outline">Start Cleanup</Button>
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