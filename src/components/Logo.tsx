import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "w-10 h-10" }: LogoProps) {
  return (
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1B3A8F" />
          <stop offset="100%" stopColor="#102560" />
        </linearGradient>
        <filter id="dropShadow" x="-5%" y="-5%" width="120%" height="120%">
          <feDropShadow dx="3" dy="8" stdDeviation="4" floodColor="#000" floodOpacity="0.25"/>
        </filter>
        <filter id="innerShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="2" stdDeviation="1" floodColor="#000" floodOpacity="0.15"/>
        </filter>
      </defs>
      
      {/* 3D Base (Shadow/Depth) */}
      <rect x="20" y="20" width="160" height="160" rx="30" fill="#0a1536" filter="url(#dropShadow)" />
      
      {/* Outer dark blue rounded square */}
      <rect x="15" y="10" width="160" height="160" rx="30" fill="url(#blueGrad)" />
      
      {/* Inner white rounded square */}
      <rect x="30" y="25" width="130" height="130" rx="15" fill="#F4F6FA" />
      
      <g fill="#1B3A8F" filter="url(#innerShadow)">
        {/* J */}
        <path d="M 65 40 v 35 a 15 15 0 0 1 -15 15 h -15 v -15 h 12 a 3 3 0 0 0 3 -3 v -32 h 15 z" />
        
        {/* O with play button */}
        <circle cx="95" cy="60" r="22" />
        
        {/* Dot */}
        <circle cx="130" cy="75" r="8" />
        
        {/* MED */}
        <path d="M 40 135 v -35 h 12 l 8 20 l 8 -20 h 12 v 35 h -10 v -20 l -8 15 h -4 l -8 -15 v 20 h -10 z" />
        <path d="M 85 135 v -35 h 25 v 8 h -15 v 5 h 12 v 8 h -12 v 6 h 15 v 8 h -25 z" />
        <path d="M 115 135 v -35 h 15 a 17 17 0 0 1 17 17 a 17 17 0 0 1 -17 18 h -15 z m 10 -8 h 5 a 9 9 0 0 0 9 -9 a 9 9 0 0 0 -9 -10 h -5 v 19 z" />
      </g>
      
      {/* Play Button inside O */}
      <polygon points="88,48 88,72 108,60" fill="#E31B23" filter="url(#innerShadow)" />
    </svg>
  );
}
