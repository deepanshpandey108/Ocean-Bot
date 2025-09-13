import React from 'react';
import { Waves, BarChart3, Globe, Zap } from 'lucide-react';

const stats = [
  { label: 'ARGO Floats', value: '4,000+', icon: <Waves className="h-5 w-5" /> },
  { label: 'Data Points', value: '12M+', icon: <BarChart3 className="h-5 w-5" /> },
  { label: 'Global Coverage', value: '100%', icon: <Globe className="h-5 w-5" /> },
  { label: 'Real-time Updates', value: '24/7', icon: <Zap className="h-5 w-5" /> },
];

const Stats: React.FC = () => {
  return (
    <section className="py-16 bg-white/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-2 text-blue-600">{stat.icon}</div>
              <div className="text-3xl font-bold text-gray-900 drop-shadow mb-1">{stat.value}</div>
              <div className="text-sm text-gray-800">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;


