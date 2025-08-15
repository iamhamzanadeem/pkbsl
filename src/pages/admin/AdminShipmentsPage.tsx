import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download, Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { formatCurrencyPKR } from '@/lib/utils';

const shipmentData = [
  {
    id: 'SH001',
    customer: 'Shell Pakistan',
    origin: 'Karachi Port',
    destination: 'Lahore Depot',
    status: 'in-transit',
    value: 12600000,
    driver: 'Ahmed Khan',
    vehicle: 'TRK-001'
  },
  {
    id: 'SH002',
    customer: 'PSO',
    origin: 'Port Qasim',
    destination: 'Islamabad Terminal',
    status: 'delivered',
    value: 8960000,
    driver: 'Muhammad Ali',
    vehicle: 'TRK-002'
  },
  {
    id: 'SH003',
    customer: 'Total Parco',
    origin: 'Bin Qasim',
    destination: 'Faisalabad Hub',
    status: 'delayed',
    value: 7840000,
    driver: 'Hassan Ahmed',
    vehicle: 'TRK-003'
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'delivered':
      return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Delivered</Badge>;
    case 'in-transit':
      return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />In Transit</Badge>;
    case 'delayed':
      return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Delayed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function AdminShipmentsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Shipments</h1>
          <p className="text-muted-foreground">
            Monitor and manage all shipments across the system
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Active shipments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+8% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrencyPKR(588000000)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find specific shipments using filters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by shipment ID, customer, or driver..." 
                className="w-full pl-9"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="shell">Shell Pakistan</SelectItem>
                <SelectItem value="pso">PSO</SelectItem>
                <SelectItem value="total">Total Parco</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shipments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Shipments</CardTitle>
          <CardDescription>Latest shipment activities across all customers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shipment ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipmentData.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-mono">{shipment.id}</TableCell>
                  <TableCell className="font-medium">{shipment.customer}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{shipment.origin}</div>
                      <div className="text-muted-foreground">→ {shipment.destination}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                  <TableCell className="font-medium">{formatCurrencyPKR(shipment.value)}</TableCell>
                  <TableCell>{shipment.driver}</TableCell>
                  <TableCell className="font-mono">{shipment.vehicle}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}