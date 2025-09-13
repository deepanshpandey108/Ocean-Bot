import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Map, Search, MapPin } from 'lucide-react';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  onLocationSearch?: (location: string) => void;
  className?: string;
}

const MapComponent = React.forwardRef<any, MapComponentProps>(({ onLocationSearch, className = "" }, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const currentMarkers = useRef<L.Marker[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([20, 0], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      L.control.zoom({
        position: 'bottomright'
      }).addTo(mapInstance.current);
    }
  }, []);

  const handleCitySearch = async (cityName: string) => {
    if (!mapInstance.current || !cityName.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const coordinates: [number, number] = [parseFloat(lat), parseFloat(lon)];

        mapInstance.current.flyTo(coordinates, 12, {
          duration: 2,
          easeLinearity: 0.1
        });

        // Clear existing markers
        currentMarkers.current.forEach(marker => {
          mapInstance.current?.removeLayer(marker);
        });
        currentMarkers.current = [];

        const marker = L.marker(coordinates)
          .addTo(mapInstance.current)
          .bindPopup(`<strong>${cityName}</strong><br/>${display_name}`)
          .openPopup();
        
        currentMarkers.current.push(marker);

        // Notify parent component
        if (onLocationSearch) {
          onLocationSearch(cityName);
        }
      }
    } catch (error) {
      console.error('Error searching city:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      handleCitySearch(searchQuery.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Public method to zoom to location (can be called from parent)
  const zoomToLocation = async (location: string, zoom: number = 12) => {
    console.log('zoomToLocation called with:', location);
    if (!mapInstance.current) {
      console.log('mapInstance.current is null');
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`
      );
      const data = await response.json();
      console.log('Geocoding response:', data);

      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const coordinates: [number, number] = [parseFloat(lat), parseFloat(lon)];

        // Clear existing markers
        currentMarkers.current.forEach(marker => {
          mapInstance.current?.removeLayer(marker);
        });
        currentMarkers.current = [];

        // Fly to location
        mapInstance.current.flyTo(coordinates, zoom, {
          duration: 2,
          easeLinearity: 0.1
        });

        // Add marker
        const marker = L.marker(coordinates)
          .addTo(mapInstance.current)
          .bindPopup(`<strong>${location}</strong><br/>${display_name}`)
          .openPopup();
        
        currentMarkers.current.push(marker);
      }
    } catch (error) {
      console.error('Error zooming to location:', error);
    }
  };

  // Public method to add markers
  const addMarker = (lat: number, lon: number, popupContent: string) => {
    if (mapInstance.current) {
      const marker = L.marker([lat, lon])
        .addTo(mapInstance.current)
        .bindPopup(popupContent);
      
      currentMarkers.current.push(marker);
    }
  };

  // Expose methods to parent component
  React.useImperativeHandle(ref, () => ({
    zoomToLocation,
    addMarker,
    clearMarkers: () => {
      currentMarkers.current.forEach(marker => {
        mapInstance.current?.removeLayer(marker);
      });
      currentMarkers.current = [];
    }
  }));

  return (
    <div className={`flex flex-col bg-white/10 backdrop-blur-md ${className}`}>
      {/* Map Header */}
      <div className="p-4 border-b border-white/20 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold flex items-center text-white">
            <Map className="mr-2 h-5 w-5" />
            Interactive Map
          </h3>
          <Badge variant="outline" className="bg-white/20 text-white border-white/30">ARGO Coverage</Badge>
        </div>
        
        {/* Manual Search Component */}
        <div className="flex space-x-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for a city or location..."
            className="flex-1 text-sm"
            disabled={isSearching}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
          >
            <Search className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Map Container */}
      <div className="flex-1 p-4">
        <div ref={mapRef} className="h-full rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm relative z-10" />
      </div>
    </div>
  );
});

MapComponent.displayName = 'MapComponent';

export default MapComponent;
