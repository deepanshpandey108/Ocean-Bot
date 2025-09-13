// Gemini AI Service for FloatChat
// This service handles integration with Google's Gemini 2.0 Flash API

import { GeminiOceanResponse, OceanProfile, TimeSeriesData, ArgoFloatData, OceanConditions } from '@/types/OceanData';

export interface GeminiResponse {
  text: string;
  locations?: string[];
  dataType?: 'temperature' | 'salinity' | 'trends' | 'argo' | 'general';
}

class GeminiService {
  private apiKey = ''; // Replace with your actual Gemini API key
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

  async generateResponse(prompt: string): Promise<GeminiResponse> {
    try {
      const systemPrompt = `You are FloatChat, an AI assistant specialized in ocean data discovery and ARGO float information. 

Your role:
- Help users explore ocean data through natural language queries
- Provide information about temperature, salinity, pressure, and other ocean parameters
- Explain ARGO float network and oceanographic concepts
- Identify locations/cities mentioned in user queries
- Be conversational and helpful

When responding:
1. Always identify any cities or locations mentioned in the user's query
2. Provide accurate oceanographic information
3. Suggest relevant data visualizations
4. Keep responses concise but informative
5. If a location is mentioned, acknowledge it and suggest showing data for that area

Example responses:
- "I can help you explore temperature data for Miami. Let me show you the ocean temperature profile for that region."
- "You're asking about salinity trends near Tokyo. I'll display the salinity data for that area."
- "I found information about ARGO floats in the London area. Let me show you the float locations and data."

Current user query: ${prompt}`;

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I encountered an error processing your request.';

      // Extract locations from the response
      const locations = this.extractLocations(generatedText);
      
      // Determine data type based on content
      const dataType = this.determineDataType(generatedText);

      return {
        text: generatedText,
        locations,
        dataType
      };

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return {
        text: 'I apologize, but I\'m having trouble connecting to the AI service right now. Please try again in a moment.',
        locations: [],
        dataType: 'general'
      };
    }
  }

  private extractLocations(text: string): string[] {
    // Common city names and location patterns
    const cityPatterns = [
      /\b(?:in|at|near|around|for|from|to)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g,
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:area|region|coast|waters?)\b/g,
      /\b(?:show|display|find|search)\s+(?:me\s+)?(?:data\s+for\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g
    ];

    const locations: string[] = [];
    
    // Common ocean-related cities
    const oceanCities = [
      'Miami', 'Tokyo', 'London', 'Sydney', 'San Francisco', 'New York', 'Los Angeles',
      'Barcelona', 'Dubai', 'Singapore', 'Hong Kong', 'Cape Town', 'Rio de Janeiro',
      'Vancouver', 'Seattle', 'Boston', 'Marseille', 'Naples', 'Athens', 'Istanbul',
      'Mumbai', 'Chennai', 'Kolkata', 'Bangkok', 'Manila', 'Jakarta', 'Perth',
      'Melbourne', 'Auckland', 'Honolulu', 'Miami Beach', 'Key West', 'Tampa',
      'Charleston', 'Norfolk', 'Baltimore', 'Portland', 'San Diego', 'Monterey'
    ];

    // Check for direct city mentions
    oceanCities.forEach(city => {
      if (text.toLowerCase().includes(city.toLowerCase())) {
        locations.push(city);
      }
    });

    // Extract locations using patterns
    cityPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const location = match[1].trim();
        if (location && location.length > 2 && location.length < 30) {
          locations.push(location);
        }
      }
    });

    // Remove duplicates and filter out common words
    const commonWords = ['the', 'and', 'or', 'but', 'for', 'with', 'data', 'ocean', 'sea', 'water', 'temperature', 'salinity'];
    return [...new Set(locations)].filter(loc => 
      !commonWords.includes(loc.toLowerCase()) && 
      loc.length > 2
    );
  }

  private determineDataType(text: string): 'temperature' | 'salinity' | 'trends' | 'argo' | 'general' {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('temperature') || lowerText.includes('temp')) {
      return 'temperature';
    } else if (lowerText.includes('salinity') || lowerText.includes('salt')) {
      return 'salinity';
    } else if (lowerText.includes('trend') || lowerText.includes('time') || lowerText.includes('over time')) {
      return 'trends';
    } else if (lowerText.includes('argo') || lowerText.includes('float')) {
      return 'argo';
    }
    
    return 'general';
  }

  // Generate ocean data response with dummy data
  async generateOceanResponse(prompt: string): Promise<GeminiOceanResponse> {
    try {
      const systemPrompt = `You are FloatChat, an AI assistant specialized in ocean data discovery and ARGO float information. 

Your role:
- Help users explore ocean data through natural language queries
- Provide information about temperature, salinity, pressure, wind speed, and other ocean parameters
- Explain ARGO float network and oceanographic concepts
- Identify locations/cities mentioned in user queries
- Generate realistic dummy ocean data for visualization

When responding:
1. Always identify any cities or locations mentioned in the user's query
2. Provide accurate oceanographic information
3. Suggest relevant data visualizations
4. Keep responses concise but informative
5. If a location is mentioned, acknowledge it and suggest showing data for that area

Example responses:
- "I can help you explore temperature data for Miami. Let me show you the ocean temperature profile for that region."
- "You're asking about salinity trends near Tokyo. I'll display the salinity data for that area."
- "I found information about ARGO floats in the London area. Let me show you the float locations and data."

Current user query: ${prompt}`;

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I encountered an error processing your request.';

      // Extract locations from the response
      const locations = this.extractLocations(generatedText);
      
      // Determine data type based on content
      const dataType = this.determineOceanDataType(generatedText);

      // Generate dummy ocean data based on the query
      const oceanData = this.generateDummyOceanData(dataType, locations[0]);

      // Generate visualizations
      const visualizations = this.generateVisualizations(dataType, oceanData, locations[0]);

      return {
        text: generatedText,
        dataType,
        locations,
        visualizations,
        oceanData
      };

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return {
        text: 'I apologize, but I\'m having trouble connecting to the AI service right now. Please try again in a moment.',
        dataType: 'general',
        locations: [],
        visualizations: {},
        oceanData: undefined
      };
    }
  }

  private generateDummyOceanData(dataType: string, location?: string): any {
    const baseLocation = location || 'Global';
    
    switch (dataType) {
      case 'temperature':
        return {
          profile: {
            location: baseLocation,
            coordinates: { latitude: 25.7617, longitude: -80.1918 },
            dataPoints: [
              { depth: 0, temperature: 25.2, salinity: 35.1, pressure: 0, timestamp: new Date().toISOString(), latitude: 25.7617, longitude: -80.1918 },
              { depth: 50, temperature: 24.8, salinity: 35.2, pressure: 51, timestamp: new Date().toISOString(), latitude: 25.7617, longitude: -80.1918 },
              { depth: 100, temperature: 23.5, salinity: 35.3, pressure: 102, timestamp: new Date().toISOString(), latitude: 25.7617, longitude: -80.1918 },
              { depth: 200, temperature: 20.1, salinity: 35.4, pressure: 204, timestamp: new Date().toISOString(), latitude: 25.7617, longitude: -80.1918 },
              { depth: 500, temperature: 15.3, salinity: 35.6, pressure: 510, timestamp: new Date().toISOString(), latitude: 25.7617, longitude: -80.1918 }
            ],
            profileType: 'temperature' as const
          }
        };

      case 'salinity':
        return {
          profile: {
            location: baseLocation,
            coordinates: { latitude: 25.7617, longitude: -80.1918 },
            dataPoints: [
              { depth: 0, temperature: 25.2, salinity: 35.1, pressure: 0, timestamp: new Date().toISOString(), latitude: 25.7617, longitude: -80.1918 },
              { depth: 50, temperature: 24.8, salinity: 35.2, pressure: 51, timestamp: new Date().toISOString(), latitude: 25.7617, longitude: -80.1918 },
              { depth: 100, temperature: 23.5, salinity: 35.3, pressure: 102, timestamp: new Date().toISOString(), latitude: 25.7617, longitude: -80.1918 },
              { depth: 200, temperature: 20.1, salinity: 35.4, pressure: 204, timestamp: new Date().toISOString(), latitude: 25.7617, longitude: -80.1918 },
              { depth: 500, temperature: 15.3, salinity: 35.6, pressure: 510, timestamp: new Date().toISOString(), latitude: 25.7617, longitude: -80.1918 }
            ],
            profileType: 'salinity' as const
          }
        };

      case 'wind':
        return {
          timeSeries: {
            location: baseLocation,
            parameter: 'windSpeed' as const,
            data: [
              { date: '2024-01-01', value: 12.5, unit: 'm/s' },
              { date: '2024-01-15', value: 15.2, unit: 'm/s' },
              { date: '2024-02-01', value: 18.7, unit: 'm/s' },
              { date: '2024-02-15', value: 14.3, unit: 'm/s' },
              { date: '2024-03-01', value: 16.8, unit: 'm/s' },
              { date: '2024-03-15', value: 13.1, unit: 'm/s' }
            ],
            trend: 'stable' as const,
            average: 15.1
          }
        };

      case 'pressure':
        return {
          profile: {
            location: baseLocation,
            coordinates: { latitude: 25.7617, longitude: -80.1918 },
            dataPoints: [
              { depth: 0, temperature: 25.2, salinity: 35.1, pressure: 0, timestamp: new Date().toISOString(), latitude: 25.7617, longitude: -80.1918 },
              { depth: 50, temperature: 24.8, salinity: 35.2, pressure: 51, timestamp: new Date().toISOString(), latitude: 25.7617, longitude: -80.1918 },
              { depth: 100, temperature: 23.5, salinity: 35.3, pressure: 102, timestamp: new Date().toISOString(), latitude: 25.7617, longitude: -80.1918 },
              { depth: 200, temperature: 20.1, salinity: 35.4, pressure: 204, timestamp: new Date().toISOString(), latitude: 25.7617, longitude: -80.1918 },
              { depth: 500, temperature: 15.3, salinity: 35.6, pressure: 510, timestamp: new Date().toISOString(), latitude: 25.7617, longitude: -80.1918 }
            ],
            profileType: 'pressure' as const
          }
        };

      case 'argo':
        return {
          argoFloats: [
            {
              floatId: '1901234',
              name: 'ARGO Float 1901234',
              status: 'active' as const,
              lastUpdate: new Date().toISOString(),
              location: { latitude: 25.7617, longitude: -80.1918 },
              currentData: { temperature: 24.5, salinity: 35.2, pressure: 100, depth: 100 },
              mission: 'Temperature and salinity profiling',
              deploymentDate: '2023-06-15'
            },
            {
              floatId: '1901235',
              name: 'ARGO Float 1901235',
              status: 'active' as const,
              lastUpdate: new Date(Date.now() - 3600000).toISOString(),
              location: { latitude: 25.8, longitude: -80.2 },
              currentData: { temperature: 23.8, salinity: 35.1, pressure: 150, depth: 150 },
              mission: 'Deep ocean monitoring',
              deploymentDate: '2023-08-20'
            }
          ]
        };

      default:
        return null;
    }
  }

  private generateVisualizations(dataType: string, oceanData: any, location?: string): any {
    const baseTitle = location ? `${dataType.charAt(0).toUpperCase() + dataType.slice(1)} Data - ${location}` : `${dataType.charAt(0).toUpperCase() + dataType.slice(1)} Profile`;

    switch (dataType) {
      case 'temperature':
        return {
          chart: {
            type: 'line',
            data: oceanData?.profile?.dataPoints?.map((p: any) => ({ depth: p.depth, temperature: p.temperature })) || [],
            xKey: 'depth',
            yKey: 'temperature',
            title: baseTitle,
            unit: '°C'
          }
        };

      case 'salinity':
        return {
          chart: {
            type: 'line',
            data: oceanData?.profile?.dataPoints?.map((p: any) => ({ depth: p.depth, salinity: p.salinity })) || [],
            xKey: 'depth',
            yKey: 'salinity',
            title: baseTitle,
            unit: 'PSU'
          }
        };

      case 'wind':
        return {
          chart: {
            type: 'line',
            data: oceanData?.timeSeries?.data?.map((d: any) => ({ date: d.date, windSpeed: d.value })) || [],
            xKey: 'date',
            yKey: 'windSpeed',
            title: baseTitle,
            unit: 'm/s'
          }
        };

      case 'pressure':
        return {
          chart: {
            type: 'line',
            data: oceanData?.profile?.dataPoints?.map((p: any) => ({ depth: p.depth, pressure: p.pressure })) || [],
            xKey: 'depth',
            yKey: 'pressure',
            title: baseTitle,
            unit: 'dbar'
          }
        };

      case 'argo':
        return {
          map: {
            center: [25.7617, -80.1918] as [number, number],
            zoom: 10,
            markers: oceanData?.argoFloats?.map((float: any) => ({
              position: [float.location.latitude, float.location.longitude] as [number, number],
              data: float
            })) || []
          }
        };

      default:
        return {};
    }
  }

  private determineOceanDataType(text: string): 'temperature' | 'salinity' | 'pressure' | 'wind' | 'waves' | 'argo' | 'conditions' | 'trends' | 'general' {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('temperature') || lowerText.includes('temp')) {
      return 'temperature';
    } else if (lowerText.includes('salinity') || lowerText.includes('salt')) {
      return 'salinity';
    } else if (lowerText.includes('pressure')) {
      return 'pressure';
    } else if (lowerText.includes('wind')) {
      return 'wind';
    } else if (lowerText.includes('wave')) {
      return 'waves';
    } else if (lowerText.includes('argo') || lowerText.includes('float')) {
      return 'argo';
    } else if (lowerText.includes('trend') || lowerText.includes('time') || lowerText.includes('over time')) {
      return 'trends';
    } else if (lowerText.includes('condition')) {
      return 'conditions';
    }
    
    return 'general';
  }
}

export const geminiService = new GeminiService();
