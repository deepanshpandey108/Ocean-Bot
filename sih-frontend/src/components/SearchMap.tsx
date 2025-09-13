import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SearchMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMarker, setCurrentMarker] = useState<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([20, 0], 2);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Add custom zoom control
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map.current);

    // Add attribution
    L.control.attribution({
      position: 'bottomleft',
      prefix: false
    }).addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const searchLocation = async () => {
    if (!searchQuery.trim() || !map.current) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const coordinates: [number, number] = [parseFloat(lat), parseFloat(lon)];

        // Remove previous marker
        if (currentMarker) {
          map.current.removeLayer(currentMarker);
        }

        // Fly to location with smooth animation
        map.current.flyTo(coordinates, 14, {
          duration: 2,
          easeLinearity: 0.1
        });

        // Add new marker
        const marker = L.marker(coordinates)
          .addTo(map.current)
          .bindPopup(`<strong>${searchQuery}</strong><br/>${display_name}`)
          .openPopup();

        setCurrentMarker(marker);

        toast({
          title: "Location found!",
          description: `Successfully located: ${searchQuery}`,
        });
      } else {
        toast({
          title: "Location not found",
          description: "Try searching with a different location name",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);
      toast({
        title: "Search error",
        description: "Unable to search location. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchLocation();
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-subtle">
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="absolute inset-0 z-0"
      />

      {/* Search Panel */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-[1000] w-full max-w-md px-4">
        <div className="glass backdrop-blur-xl rounded-2xl p-6 shadow-glass animate-float">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Location Search
            </h1>
          </div>
          
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search for any location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-4 pr-4 py-3 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm 
                         text-foreground placeholder-muted-foreground 
                         focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-300 shadow-input"
                disabled={isLoading}
              />
            </div>
            
            <Button
              onClick={searchLocation}
              disabled={isLoading || !searchQuery.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-primary hover:shadow-elegant
                       transition-all duration-300 transform hover:scale-105
                       disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:transform-none"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-6 left-6 z-[1000] max-w-sm">
        <div className="glass backdrop-blur-xl rounded-xl p-4 shadow-glass">
          <h3 className="font-semibold text-foreground mb-2">How to use:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Enter any location name or address</li>
            <li>• Click search or press Enter</li>
            <li>• Zoom and pan to explore the map</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchMap;