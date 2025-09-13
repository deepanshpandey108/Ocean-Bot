import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cover } from '@/components/ui/cover';
import { Brain, Map, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

const words = `FloatChat revolutionizes ocean data exploration through natural language queries, interactive visualizations, and intelligent insights from ARGO profiling floats worldwide.`
const Hero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="relative flex flex-col items-center justify-start text-center min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl">
        {/* Badge */}
        <Badge className="mb-4 bg-white/30 text-blue-900 border-white/40 backdrop-blur-sm">
          <Brain className="mr-1 h-3 w-3" />
          AI-Powered Ocean Data Discovery
        </Badge>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-20">
          Discover <Cover>Ocean Data</Cover> with
          <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            {" "}Conversational AI
          </span>
        </h1>

        {/* Paragraph */}
        {/* Paragraph */}
<TextGenerateEffect 
  words={words} 
  textClassName="text-white"
/>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-20">
          <Button 
            size="lg"
            onClick={() => navigate('/chat')}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3 text-lg shadow-lg shadow-blue-900/20"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Start Chatting
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-white/50 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm px-8 py-3 text-lg"
          >
            <Map className="mr-2 h-5 w-5" />
            Explore Map
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
