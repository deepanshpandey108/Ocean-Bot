import React from 'react';
import { Button } from '@/components/ui/button';
import { Waves, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <nav className="border-b border-white/20 bg-white/20 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Title */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Waves className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              FloatChat
            </span>
          </div>

          {/* Button */}
          <Button 
            onClick={() => navigate('/chat')}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            Try FloatChat
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
