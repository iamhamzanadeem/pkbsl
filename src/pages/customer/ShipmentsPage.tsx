import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download, ExternalLink, CalendarDays } from 'lucide-react';
import { usePortal } from '@/contexts/PortalContext';

interface Shipment {
  biltyNo: string;
  origin: string;
  destination: string;
  status: 'On-time' | 'At Risk' | 'Delayed' | 'Delivered';
  eta: string;
  driver: string;
  progress: number;
  client: string;
}

const mockShipments: Shipment[] = [
  {
    biltyNo: 'PKB-2024-001',
    origin: 'Karachi Port',
    destination: 'Shell Depot Lahore',
    status: 'On-time',
    eta: '14:30 Today',
    driver: 'Ahmad Khan',
    progress: 75,
    client: 'Shell Pakistan',
  },
  {
    biltyNo: 'PKB-2024-002',
    origin: 'Siemens Factory Lahore',
    destination: 'Siemens Karachi Office',
    status: 'At Risk',
    eta: '16:45 Today',
    driver: 'Muhammad Ali',
    progress: 60,
    client: 'Siemens',
  },
  // ... more shipments
];

export function ShipmentsPage() {
  const { currentPortal } = usePortal();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('7days');

  if (!currentPortal?.features.shipments) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
            <p className="text-muted-foreground">Shipment management is not enabled for your portal.</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredShipments = mockShipments.filter(shipment => {
    const matchesStatus = statusFilter === 'all' || shipment.status.toLowerCase().replace(' ', '-') === statusFilter;
    const matchesSearch = shipment.biltyNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shipment.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shipment.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'On-time':
        return <Badge className="bg-success text-success-foreground">On-time</Badge>;
      case 'At Risk':
        return <Badge className="bg-at-risk text-at-risk-foreground">At Risk</Badge>;
      case 'Delayed':
        return <Badge className="bg-destructive text-destructive-foreground">Delayed</Badge>;
      case 'Delivered':
        return <Badge variant="secondary">Delivered</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
            <p className="text-muted-foreground">
              Comprehensive shipment management for {currentPortal.displayName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
          <CardDescription>Find and filter shipments by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by Bilty #, origin, or destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="on-time">On-time</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <Select value={dateRange} onValueChange={setDateRange}>
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
        </CardContent>
      </Card>

      {/* Shipments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Shipments</CardTitle>
              <CardDescription>
                Showing {filteredShipments.length} shipments
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bilty #</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.map((shipment) => (
                  <TableRow key={shipment.biltyNo}>
                    <TableCell className="font-medium">
                      {shipment.biltyNo}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{shipment.origin}</div>
                        <div className="text-xs text-muted-foreground">→ {shipment.destination}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(shipment.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{shipment.eta}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{shipment.driver}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${shipment.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {shipment.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}