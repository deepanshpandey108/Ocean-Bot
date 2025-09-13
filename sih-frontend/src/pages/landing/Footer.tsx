import React from 'react';
import { Waves } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Waves className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">FloatChat</span>
            </div>
            <p className="text-gray-400">AI-powered conversational interface for ARGO ocean data discovery and visualization.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-400">
              <li>AI Chat Interface</li>
              <li>Data Visualization</li>
              <li>Interactive Maps</li>
              <li>ARGO Integration</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Documentation</li>
              <li>API Reference</li>
              <li>Data Sources</li>
              <li>Support</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-gray-400">
              <li>GitHub</li>
              <li>Twitter</li>
              <li>LinkedIn</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 FloatChat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


