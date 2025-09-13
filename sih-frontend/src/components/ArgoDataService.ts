// ARGO Data Service for FloatChat
// This service handles integration with ARGO ocean data APIs

export interface ArgoFloat {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  lastUpdate: string;
  status: 'active' | 'inactive' | 'maintenance';
  depth: number;
  temperature?: number;
  salinity?: number;
  pressure?: number;
}

export interface OceanDataPoint {
  timestamp: string;
  depth: number;
  temperature: number;
  salinity: number;
  pressure: number;
  latitude: number;
  longitude: number;
}

export interface ArgoDataResponse {
  floats: ArgoFloat[];
  dataPoints: OceanDataPoint[];
  totalFloats: number;
  lastUpdate: string;
}

class ArgoDataService {
  private baseUrl = 'https://api.argo.org'; // Placeholder - would be actual ARGO API
  private cache = new Map<string, any>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  // Simulate ARGO float data (in real implementation, this would call actual APIs)
  async getFloatsInRegion(lat: number, lon: number, radius: number = 100): Promise<ArgoFloat[]> {
    const cacheKey = `floats_${lat}_${lon}_${radius}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate mock data for demonstration
    const mockFloats: ArgoFloat[] = [
      {
        id: '1901234',
        name: 'ARGO Float 1901234',
        latitude: lat + (Math.random() - 0.5) * 2,
        longitude: lon + (Math.random() - 0.5) * 2,
        lastUpdate: new Date().toISOString(),
        status: 'active',
        depth: 2000,
        temperature: 15.2 + Math.random() * 10,
        salinity: 35.1 + Math.random() * 0.5,
        pressure: 2000 + Math.random() * 1000
      },
      {
        id: '1901235',
        name: 'ARGO Float 1901235',
        latitude: lat + (Math.random() - 0.5) * 2,
        longitude: lon + (Math.random() - 0.5) * 2,
        lastUpdate: new Date(Date.now() - 3600000).toISOString(),
        status: 'active',
        depth: 1500,
        temperature: 12.8 + Math.random() * 8,
        salinity: 34.9 + Math.random() * 0.3,
        pressure: 1500 + Math.random() * 500
      }
    ];

    this.setCachedData(cacheKey, mockFloats);
    return mockFloats;
  }

  async getOceanDataForLocation(lat: number, lon: number, days: number = 30): Promise<OceanDataPoint[]> {
    const cacheKey = `data_${lat}_${lon}_${days}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    await new Promise(resolve => setTimeout(resolve, 300));

    // Generate mock time series data
    const dataPoints: OceanDataPoint[] = [];
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const baseTemp = 20 + Math.sin(i * 0.1) * 5;
      const baseSalinity = 35.0 + Math.cos(i * 0.15) * 0.3;
      
      dataPoints.push({
        timestamp: date.toISOString(),
        depth: 0,
        temperature: baseTemp + (Math.random() - 0.5) * 2,
        salinity: baseSalinity + (Math.random() - 0.5) * 0.1,
        pressure: 0,
        latitude: lat,
        longitude: lon
      });
    }

    this.setCachedData(cacheKey, dataPoints);
    return dataPoints;
  }

  async getDepthProfile(lat: number, lon: number): Promise<OceanDataPoint[]> {
    const cacheKey = `profile_${lat}_${lon}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    await new Promise(resolve => setTimeout(resolve, 400));

    const depths = [0, 10, 25, 50, 75, 100, 150, 200, 300, 500, 750, 1000, 1500, 2000];
    const profile: OceanDataPoint[] = depths.map(depth => {
      const temperature = 25 - (depth / 100) * 0.8 + Math.random() * 0.5;
      const salinity = 35.0 + (depth / 1000) * 0.5 + Math.random() * 0.1;
      const pressure = depth * 1.02; // Approximate pressure calculation

      return {
        timestamp: new Date().toISOString(),
        depth,
        temperature: Math.max(0, temperature),
        salinity: Math.max(30, Math.min(40, salinity)),
        pressure,
        latitude: lat,
        longitude: lon
      };
    });

    this.setCachedData(cacheKey, profile);
    return profile;
  }

  async searchFloatsByCity(cityName: string): Promise<ArgoFloat[]> {
    // In a real implementation, this would geocode the city and then search for nearby floats
    const mockCityCoordinates = {
      'miami': { lat: 25.7617, lon: -80.1918 },
      'tokyo': { lat: 35.6762, lon: 139.6503 },
      'london': { lat: 51.5074, lon: -0.1278 },
      'sydney': { lat: -33.8688, lon: 151.2093 },
      'san francisco': { lat: 37.7749, lon: -122.4194 },
      'new york': { lat: 40.7128, lon: -74.0060 }
    };

    const coords = mockCityCoordinates[cityName.toLowerCase() as keyof typeof mockCityCoordinates];
    if (!coords) {
      // Default to a random ocean location
      return this.getFloatsInRegion(20, 0, 200);
    }

    return this.getFloatsInRegion(coords.lat, coords.lon, 100);
  }

  async getGlobalArgoStats(): Promise<{ totalFloats: number; activeFloats: number; dataPoints: number }> {
    const cacheKey = 'global_stats';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    await new Promise(resolve => setTimeout(resolve, 200));

    const stats = {
      totalFloats: 4000 + Math.floor(Math.random() * 200),
      activeFloats: 3800 + Math.floor(Math.random() * 100),
      dataPoints: 2000000 + Math.floor(Math.random() * 100000)
    };

    this.setCachedData(cacheKey, stats);
    return stats;
  }

  private getCachedData(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Clear cache (useful for testing or when fresh data is needed)
  clearCache(): void {
    this.cache.clear();
  }
}

export const argoDataService = new ArgoDataService();
