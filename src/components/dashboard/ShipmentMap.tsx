import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, TruckIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Shipment {
  biltyNo: string;
  client: string;
  origin: string;
  destination: string;
  currentLat: number;
  currentLng: number;
  status: 'on-time' | 'at-risk' | 'delayed';
  eta: string;
}

const mockShipments: Shipment[] = [
  {
    biltyNo: "PKB-001",
    client: "Shell Pakistan",
    origin: "Karachi",
    destination: "Lahore",
    currentLat: 25.2048,
    currentLng: 67.0734,
    status: "on-time",
    eta: "2 hours"
  },
  {
    biltyNo: "PKB-002", 
    client: "Siemens",
    origin: "Islamabad",
    destination: "Faisalabad",
    currentLat: 33.6844,
    currentLng: 73.0479,
    status: "at-risk",
    eta: "45 minutes"
  },
  {
    biltyNo: "PKB-003",
    client: "UniLever",
    origin: "Lahore",
    destination: "Multan",
    currentLat: 31.5204,
    currentLng: 74.3587,
    status: "delayed",
    eta: "Overdue by 30 min"
  }
];

export const ShipmentMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on Pakistan
    const map = L.map(mapRef.current).setView([30.3753, 69.3451], 6);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Create custom icons for different statuses
    const createMarkerIcon = (status: string) => {
      const colors = {
        'on-time': '#22c55e',
        'at-risk': '#f59e0b', 
        'delayed': '#ef4444'
      };
      
      return L.divIcon({
        html: `<div style="background-color: ${colors[status as keyof typeof colors]}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        className: 'custom-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
    };

    // Add markers for each shipment
    mockShipments.forEach((shipment) => {
      const marker = L.marker([shipment.currentLat, shipment.currentLng], {
        icon: createMarkerIcon(shipment.status)
      }).addTo(map);

      // Add popup with shipment details
      marker.bindPopup(`
        <div class="p-2">
          <div class="font-semibold text-sm mb-1">Bilty #${shipment.biltyNo}</div>
          <div class="text-xs text-gray-600 mb-1">${shipment.client}</div>
          <div class="text-xs mb-1">${shipment.origin} → ${shipment.destination}</div>
          <div class="text-xs">ETA: ${shipment.eta}</div>
        </div>
      `);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleRefresh = () => {
    // Simulate refresh - in real app would fetch new data
    console.log("Refreshing map data...");
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-5 w-5 text-primary" />
          <CardTitle>Live Shipment Tracking</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCwIcon className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span>On-time</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span>At Risk (≤60 min)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span>Delayed</span>
            </div>
          </div>

          {/* Map Container */}
          <div className="relative">
            <div 
              ref={mapRef} 
              className="h-[400px] w-full rounded-lg border border-border"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};