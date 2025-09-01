
import { MapPin } from 'lucide-react';
import { Device } from '@/lib/mockData';

interface GeoMapProps {
  device: Device;
}

const GeoMap = ({ device }: GeoMapProps) => {
  if (!device.geolocation) {
    return (
      <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <MapPin className="w-8 h-8 mx-auto mb-2" />
          <p>Location data unavailable</p>
        </div>
      </div>
    );
  }

  // For MVP, we'll show a static map representation
  // In production, this would use a real map library like Leaflet or Mapbox
  return (
    <div className="space-y-4">
      <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-red-500 w-6 h-6 rounded-full flex items-center justify-center animate-pulse-glow">
            <div className="bg-white w-2 h-2 rounded-full" />
          </div>
        </div>
        <div className="absolute bottom-4 left-4 text-white font-medium bg-black/50 px-3 py-1 rounded-lg">
          📍 {device.geolocation.city}, {device.geolocation.country}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">City</p>
          <p className="font-medium">{device.geolocation.city}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Country</p>
          <p className="font-medium">{device.geolocation.country}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Latitude</p>
          <p className="font-mono text-sm">{device.geolocation.latitude.toFixed(4)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Longitude</p>
          <p className="font-mono text-sm">{device.geolocation.longitude.toFixed(4)}</p>
        </div>
      </div>
    </div>
  );
};

export default GeoMap;
