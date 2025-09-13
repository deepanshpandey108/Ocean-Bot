import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTA: React.FC = () => {
  const navigate = useNavigate();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
 
  const words = [
    { text: "Ocean Data", color: "from-blue-400 to-cyan-400" },
    { text: "Marine Life", color: "from-teal-400 to-emerald-400" },
    { text: "Deep Waters", color: "from-indigo-400 to-blue-500" },
    { text: "Sea Mysteries", color: "from-purple-400 to-blue-400" },
    { text: "Coral Reefs", color: "from-orange-400 to-pink-400" },
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
     
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsVisible(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/10 backdrop-blur-sm">
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
       
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
       
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out;
        }
       
        .gradient-animation {
          background-size: 200% 200%;
          animation: gradientShift 3s ease-in-out infinite;
        }
      `}</style>
     
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-4 relative">
          <span className="inline-block">Ready to Explore </span>
          <span
            className={`inline-block bg-gradient-to-r ${words[currentWordIndex].color} bg-clip-text text-transparent font-extrabold transform transition-all duration-500 gradient-animation ${
              isVisible
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 translate-y-2'
            }`}
          >
            {words[currentWordIndex].text}
          </span>
          <span className="inline-block">?</span>
         
          {/* Floating particles animation */}
          <div className="absolute -top-4 -left-4 w-2 h-2 bg-blue-400 rounded-full opacity-70 animate-ping"></div>
          <div className="absolute -top-6 right-12 w-1.5 h-1.5 bg-cyan-300 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute -bottom-2 left-8 w-1 h-1 bg-teal-400 rounded-full opacity-80 animate-bounce"></div>
        </h2>
       
        <p className="text-xl text-white/90 mb-8 drop-shadow-md animate-fade-in-up">
          Join researchers, scientists, and ocean enthusiasts in discovering the world's oceans through AI-powered conversation.
        </p>
       
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={() => navigate('/chat')}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-12 py-4 text-xl shadow-lg shadow-blue-900/20 border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <MessageSquare className="mr-2 h-6 w-6" />
            Start Your Ocean Journey
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/data')}
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 px-12 py-4 text-xl backdrop-blur-sm shadow-lg transform transition-all duration-300 hover:scale-105"
          >
            <Database className="mr-2 h-6 w-6" />
            Contribute Ocean Data
          </Button>
        </div>
      </div>
    </section>
  );
};
export default CTA;