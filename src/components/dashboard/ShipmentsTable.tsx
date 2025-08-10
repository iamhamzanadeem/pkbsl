import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TruckIcon, FilterIcon, ExternalLinkIcon } from "lucide-react";

interface Shipment {
  biltyNo: string;
  client: string;
  status: 'on-time' | 'at-risk' | 'delayed' | 'delivered';
  eta: string;
  origin: string;
  destination: string;
  driver: string;
}

const mockShipments: Shipment[] = [
  {
    biltyNo: "PKB-001",
    client: "Shell Pakistan",
    status: "on-time",
    eta: "2 hours",
    origin: "Karachi",
    destination: "Lahore",
    driver: "Ahmed Khan"
  },
  {
    biltyNo: "PKB-002",
    client: "Siemens",
    status: "at-risk", 
    eta: "45 minutes",
    origin: "Islamabad",
    destination: "Faisalabad",
    driver: "Mohammad Ali"
  },
  {
    biltyNo: "PKB-003",
    client: "UniLever",
    status: "delayed",
    eta: "Overdue by 30 min",
    origin: "Lahore", 
    destination: "Multan",
    driver: "Hassan Sheikh"
  },
  {
    biltyNo: "PKB-004",
    client: "AGS",
    status: "delivered",
    eta: "Completed",
    origin: "Karachi",
    destination: "Hyderabad", 
    driver: "Tariq Mahmood"
  },
  {
    biltyNo: "PKB-005",
    client: "Exide",
    status: "on-time",
    eta: "4.5 hours",
    origin: "Faisalabad",
    destination: "Lahore",
    driver: "Imran Siddique"
  }
];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    'on-time': { label: 'On Time', variant: 'default' as const, className: 'bg-success text-success-foreground' },
    'at-risk': { label: 'At Risk', variant: 'secondary' as const, className: 'bg-warning text-warning-foreground' },
    'delayed': { label: 'Delayed', variant: 'destructive' as const, className: 'bg-destructive text-destructive-foreground' },
    'delivered': { label: 'Delivered', variant: 'outline' as const, className: 'bg-muted text-muted-foreground' }
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

export const ShipmentsTable = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const filteredShipments = mockShipments.filter(shipment => 
    statusFilter === "all" || shipment.status === statusFilter
  );

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <TruckIcon className="h-5 w-5 text-primary" />
          <CardTitle>Active Shipments</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="on-time">On Time</SelectItem>
              <SelectItem value="at-risk">At Risk</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bilty #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead className="w-[80px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.map((shipment) => (
                <TableRow key={shipment.biltyNo} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{shipment.biltyNo}</TableCell>
                  <TableCell>{shipment.client}</TableCell>
                  <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                  <TableCell>{shipment.eta}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {shipment.origin} → {shipment.destination}
                  </TableCell>
                  <TableCell>{shipment.driver}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <ExternalLinkIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};