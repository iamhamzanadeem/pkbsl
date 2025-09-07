import { useState, useMemo } from 'react';
import { Search, Download, Phone, Clock, MapPin, Truck as TruckIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockTrucks } from '@/data/mockTrucks';
import { Truck, TruckStatus, TruckType } from '@/types/truck';
import { format } from 'date-fns';

export default function TrucksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TruckStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<TruckType | 'All'>('All');
  const [locationFilter, setLocationFilter] = useState<string>('All');

  // Get unique locations for filter dropdown
  const locations = useMemo(() => {
    const allLocations = mockTrucks.map(truck => truck.currentLocation);
    return ['All', ...Array.from(new Set(allLocations))];
  }, []);

  // Filter and sort trucks
  const filteredTrucks = useMemo(() => {
    return mockTrucks
      .filter(truck => {
        // Search filter
        const searchMatch = searchTerm === '' || 
          truck.truckId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          truck.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          truck.plateNumber.toLowerCase().includes(searchTerm.toLowerCase());

        // Status filter
        const statusMatch = statusFilter === 'All' || truck.status === statusFilter;

        // Type filter
        const typeMatch = typeFilter === 'All' || truck.truckType === typeFilter;

        // Location filter
        const locationMatch = locationFilter === 'All' || truck.currentLocation === locationFilter;

        return searchMatch && statusMatch && typeMatch && locationMatch;
      })
      .sort((a, b) => a.eta.getTime() - b.eta.getTime()); // Sort by earliest ETA
  }, [searchTerm, statusFilter, typeFilter, locationFilter]);

  const getStatusBadge = (status: TruckStatus) => {
    const variants = {
      'Available': 'default',
      'En Route': 'secondary',
      'In Transit': 'secondary',
      'Maintenance': 'destructive',
      'Loading': 'outline',
      'Unloading': 'outline'
    } as const;

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status}
      </Badge>
    );
  };

  const formatETA = (eta: Date) => {
    const now = new Date();
    const timeDiff = eta.getTime() - now.getTime();
    
    if (timeDiff <= 0) {
      return 'Available Now';
    }
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours === 0) {
      return `${minutes}min`;
    } else if (hours < 24) {
      return `${hours}h ${minutes}min`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h`;
    }
  };

  const exportTruckList = () => {
    const csvContent = [
      ['Truck ID', 'Driver', 'Contact', 'Location', 'Status', 'ETA', 'Type', 'Max Weight (kg)', 'Plate Number'].join(','),
      ...filteredTrucks.map(truck => [
        truck.truckId,
        truck.driverName,
        truck.driverContact,
        truck.currentLocation,
        truck.status,
        format(truck.eta, 'dd/MM/yyyy HH:mm'),
        truck.truckType,
        truck.capacity.maxWeight,
        truck.plateNumber
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `available-trucks-${format(new Date(), 'dd-MM-yyyy')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Available Trucks</h1>
          <p className="text-muted-foreground">
            Track available trucks at origin locations, sorted by earliest ETA
          </p>
        </div>
        <Button onClick={exportTruckList} variant="outline">
          <Download className="h-4 w-4" />
          Export List
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TruckIcon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Trucks</p>
                <p className="text-2xl font-bold">{mockTrucks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Available Now</p>
                <p className="text-2xl font-bold">
                  {mockTrucks.filter(t => t.status === 'Available').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">En Route</p>
                <p className="text-2xl font-bold">
                  {mockTrucks.filter(t => t.status === 'En Route').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Bookable</p>
                <p className="text-2xl font-bold">
                  {mockTrucks.filter(t => t.isAvailableForBooking).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Trucks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search truck ID, driver, or plate..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TruckStatus | 'All')}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="En Route">En Route</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Loading">Loading</SelectItem>
                <SelectItem value="Unloading">Unloading</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as TruckType | 'All')}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Container Truck">Container Truck</SelectItem>
                <SelectItem value="Flatbed">Flatbed</SelectItem>
                <SelectItem value="Refrigerated">Refrigerated</SelectItem>
                <SelectItem value="Tanker">Tanker</SelectItem>
                <SelectItem value="Box Truck">Box Truck</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trucks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trucks ({filteredTrucks.length} found)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Truck Details</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrucks.map((truck) => (
                <TableRow key={truck.truckId}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{truck.truckId}</div>
                      <div className="text-sm text-muted-foreground">
                        {truck.truckType} • {truck.plateNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{truck.driverName}</div>
                      <div className="text-sm text-muted-foreground">
                        {truck.driverContact}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{truck.currentLocation}</span>
                    </div>
                    {truck.destinationLocation && (
                      <div className="text-sm text-muted-foreground">
                        → {truck.destinationLocation}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(truck.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formatETA(truck.eta)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(truck.eta, 'dd/MM HH:mm')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{truck.capacity.maxWeight.toLocaleString()} kg</div>
                      <div className="text-muted-foreground">
                        {truck.capacity.maxVolume} m³
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`tel:${truck.driverContact}`)}
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        disabled={!truck.isAvailableForBooking}
                      >
                        {truck.isAvailableForBooking ? 'Reserve' : 'Unavailable'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredTrucks.length === 0 && (
            <div className="text-center py-8">
              <TruckIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No trucks found matching your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}