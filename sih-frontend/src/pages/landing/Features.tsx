import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, BarChart3, Map, Brain, Waves, Globe } from 'lucide-react';

const features = [
  { icon: <MessageSquare className="h-8 w-8 text-blue-400" />, title: 'AI-Powered Chat', description: 'Natural language interface for ocean data queries with intelligent responses' },
  { icon: <BarChart3 className="h-8 w-8 text-green-400" />, title: 'Data Visualization', description: 'Interactive charts, graphs, and visual representations of ocean data' },
  { icon: <Map className="h-8 w-8 text-purple-400" />, title: 'Interactive Maps', description: 'Geographic visualization with city-based zoom and location tracking' },
  { icon: <Brain className="h-8 w-8 text-orange-400" />, title: 'ARGO Integration', description: 'Direct access to ARGO ocean profiling float data and real-time information' },
  { icon: <Waves className="h-8 w-8 text-cyan-400" />, title: 'Ocean Analytics', description: 'Comprehensive oceanographic data analysis and trend identification' },
  { icon: <Globe className="h-8 w-8 text-indigo-400" />, title: 'Global Coverage', description: 'Worldwide ocean data access with regional and temporal filtering' },
];

const Features: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-4">
            Powerful Features for Ocean Data Discovery
          </h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto drop-shadow">
            Everything you need to explore, analyze, and understand ocean data through intelligent conversation and visualization.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-white/20 bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  {feature.icon}
                  <CardTitle className="text-lg text-white drop-shadow">
                    {feature.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-100 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
