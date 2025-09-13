import React from 'react';

interface GlobeProps {
  className?: string;
}

const Globe: React.FC<GlobeProps> = ({ className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Glow */}
      <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl" />

      {/* Rotating Globe */}
      <svg
        viewBox="0 0 200 200"
        className="relative z-[1] w-full h-full rounded-full border border-cyan-300/40 bg-gradient-to-br from-blue-50 via-white to-cyan-50 shadow-lg animate-spin"
        style={{ animationDuration: '20s', animationTimingFunction: 'linear' }}
      >
        <defs>
          <radialGradient id="ocean" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#bae6fd" />
          </radialGradient>
        </defs>

        {/* Ocean fill */}
        <circle cx="100" cy="100" r="95" fill="url(#ocean)" />

        {/* Graticule (lat/lon lines) */}
        {[...Array(12)].map((_, i) => (
          <circle
            key={`lat-${i}`}
            cx="100"
            cy="100"
            r={10 + i * 7}
            fill="none"
            stroke="#22d3ee"
            strokeOpacity="0.25"
            strokeWidth="0.5"
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <line
            key={`lon-${i}`}
            x1="100"
            y1="5"
            x2="100"
            y2="195"
            stroke="#06b6d4"
            strokeOpacity="0.25"
            strokeWidth="0.5"
            transform={`rotate(${i * 15} 100 100)`}
          />
        ))}

        {/* Float dots */}
        {[
          { x: 130, y: 70 },
          { x: 80, y: 120 },
          { x: 150, y: 120 },
          { x: 60, y: 80 },
          { x: 110, y: 150 },
        ].map((p, idx) => (
          <circle key={idx} cx={p.x} cy={p.y} r="2.5" fill="#0ea5e9" opacity="0.9" />
        ))}
      </svg>

      {/* Ring accents */}
      <div className="absolute inset-0 rounded-full border border-cyan-200/60" />
      <div className="absolute inset-2 rounded-full border border-cyan-200/40" />
      <div className="absolute inset-4 rounded-full border border-cyan-200/30" />
    </div>
  );
};

export default Globe;


