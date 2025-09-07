import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ShipmentMapProps {
  origin?: string;
  destination?: string;
}

const cityCoordinates: Record<string, [number, number]> = {
  'Karachi': [24.8607, 67.0011],
  'Lahore': [31.5804, 74.3587],
  'Islamabad': [33.6844, 73.0479],
  'Peshawar': [34.0151, 71.5249],
  'Quetta': [30.1798, 66.9750]
};

export function ShipmentMap({ origin, destination }: ShipmentMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([30.3753, 69.3451], 5);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    }

    // Clear existing markers
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstance.current?.removeLayer(layer);
      }
    });

    const markers: L.Marker[] = [];

    // Add origin marker
    if (origin && cityCoordinates[origin]) {
      const originMarker = L.marker(cityCoordinates[origin])
        .addTo(mapInstance.current!)
        .bindPopup(`Origin: ${origin}`);
      markers.push(originMarker);
    }

    // Add destination marker
    if (destination && cityCoordinates[destination]) {
      const destMarker = L.marker(cityCoordinates[destination])
        .addTo(mapInstance.current!)
        .bindPopup(`Destination: ${destination}`);
      markers.push(destMarker);
    }

    // Draw route line if both points exist
    if (origin && destination && cityCoordinates[origin] && cityCoordinates[destination]) {
      const routeLine = L.polyline([
        cityCoordinates[origin],
        cityCoordinates[destination]
      ], {
        color: 'hsl(var(--primary))',
        weight: 3,
        opacity: 0.7
      }).addTo(mapInstance.current!);

      // Fit map to show both points
      const group = new L.FeatureGroup([...markers, routeLine]);
      mapInstance.current!.fitBounds(group.getBounds(), { padding: [20, 20] });
    } else if (markers.length > 0) {
      // Fit map to show markers
      const group = new L.FeatureGroup(markers);
      mapInstance.current!.fitBounds(group.getBounds(), { padding: [50, 50] });
    }

    return () => {
      // Cleanup is handled by the map instance
    };
  }, [origin, destination]);

  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-64 rounded-lg border"
      style={{ minHeight: '256px' }}
    />
  );
}