// Ocean Data Types for FloatChat

export interface OceanDataPoint {
  timestamp: string;
  depth: number;
  temperature: number;
  salinity: number;
  pressure: number;
  windSpeed?: number;
  windDirection?: number;
  waveHeight?: number;
  latitude: number;
  longitude: number;
}

export interface OceanProfile {
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  dataPoints: OceanDataPoint[];
  profileType: 'temperature' | 'salinity' | 'pressure' | 'wind' | 'waves' | 'comprehensive';
}

export interface TimeSeriesData {
  location: string;
  parameter: 'temperature' | 'salinity' | 'pressure' | 'windSpeed' | 'waveHeight';
  data: Array<{
    date: string;
    value: number;
    unit: string;
  }>;
  trend: 'increasing' | 'decreasing' | 'stable';
  average: number;
}

export interface ArgoFloatData {
  floatId: string;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  lastUpdate: string;
  location: {
    latitude: number;
    longitude: number;
  };
  currentData: {
    temperature: number;
    salinity: number;
    pressure: number;
    depth: number;
  };
  mission: string;
  deploymentDate: string;
}

export interface OceanConditions {
  location: string;
  timestamp: string;
  surface: {
    temperature: number;
    salinity: number;
    windSpeed: number;
    windDirection: number;
    waveHeight: number;
  };
  subsurface: {
    temperature: number;
    salinity: number;
    pressure: number;
    depth: number;
  };
  weather: {
    airTemperature: number;
    humidity: number;
    pressure: number;
    visibility: number;
  };
}

export interface GeminiOceanResponse {
  text: string;
  dataType: 'temperature' | 'salinity' | 'pressure' | 'wind' | 'waves' | 'argo' | 'conditions' | 'trends' | 'general';
  locations: string[];
  visualizations: {
    chart?: {
      type: 'line' | 'bar' | 'pie' | 'scatter';
      data: any[];
      xKey: string;
      yKey: string;
      title: string;
      unit?: string;
    };
    map?: {
      center: [number, number];
      zoom: number;
      markers?: Array<{
        position: [number, number];
        data: any;
      }>;
    };
  };
  oceanData?: {
    profile?: OceanProfile;
    timeSeries?: TimeSeriesData;
    argoFloats?: ArgoFloatData[];
    conditions?: OceanConditions;
  };
}
