import React from 'react';
import { MessageSquare, BarChart3, Map } from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-white/10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-4">
            How FloatChat Works
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Three simple steps to unlock ocean data insights
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/90 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white drop-shadow">
              1. Ask Questions
            </h3>
            <p className="text-gray-200">
              Use natural language to ask about ocean data, temperatures, salinity, or any location-specific queries.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/90 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white drop-shadow">
              2. Get Visualizations
            </h3>
            <p className="text-gray-200">
              Receive interactive charts, graphs, and maps that visualize the data you requested.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500/90 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
              <Map className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white drop-shadow">
              3. Explore & Analyze
            </h3>
            <p className="text-gray-200">
              Zoom into specific locations, analyze trends, and discover patterns in ocean data.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
