/**
 * @file About section component.
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description This component renders the main hero/about section of the portfolio,
 * featuring an animated title and certification badges
 */
import React from 'react';
import { BinaryScrambleText } from './BinaryScrambleText';

interface AboutProps {
  startAnimation: boolean;
}

export const About: React.FC<AboutProps> = ({ startAnimation }) => {
  return (
    <section className="min-h-screen flex flex-col justify-center text-center">
      <div className="container mx-auto px-4">
        {/* Main heading with the glitching animation */}
        <h1 
          className="text-6xl md:text-7xl font-bold text-white tracking-tight cyber-glow cyber-glitch-text"
          data-text="Dylan Walsh"
        >
          <BinaryScrambleText text="Dylan Walsh" start={startAnimation} as="span" speed={40} />
        </h1>
        <p className="mt-4 text-lg md:text-xl text-blue-400 tracking-wider font-mono">
          <BinaryScrambleText text="IT Support Specialist | Cybersecurity Enthusiast | Data Science Graduate" start={startAnimation} as="span" speed={20} />
        </p>
        
        {/* Digital Badges Section */}
        <div className="mt-10 flex justify-center items-center gap-x-6 md:gap-x-8">
          <div className="relative group">
            <a href="https://www.credly.com/badges/74380a8e-29d1-45bf-bfe7-8e842302bcbb/public_url" target="_blank" rel="noopener noreferrer" aria-label="View CompTIA A+ Certification">
              <img 
                src="https://images.credly.com/size/680x680/images/f6d62c5d-1e1d-4de6-92ee-8dc8c80b1c7b/blob" 
                alt="CompTIA A+ ce Certification" 
                className="h-20 md:h-24 w-auto transition-all duration-300 drop-shadow-[0_0_12px_rgba(59,130,246,0.6)] hover:scale-110 hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.9)]"
              />
            </a>
            <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900/90 backdrop-blur-sm text-blue-300 text-xs font-mono rounded-md whitespace-nowrap border border-blue-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform scale-95 group-hover:scale-100">
              view my A+ badge
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900/90 transform rotate-45 border-r border-b border-blue-500/30"></div>
            </div>
          </div>

          <div className="relative group">
            <a href="https://www.credly.com/badges/b0f5727e-304a-47c8-ad5a-d2c3a873fd6a/public_url" target="_blank" rel="noopener noreferrer" aria-label="View Google IT Support Professional Certificate">
              <img 
                src="https://images.credly.com/size/680x680/images/fb97a12f-c0f1-4f37-9b7d-4a830199fe84/GCC_badge_IT_Support_1000x1000.png" 
                alt="Google IT Support Professional Certificate" 
                className="h-20 md:h-24 w-auto transition-all duration-300 drop-shadow-[0_0_12px_rgba(59,130,246,0.6)] hover:scale-110 hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.9)]"
              />
            </a>
            <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900/90 backdrop-blur-sm text-blue-300 text-xs font-mono rounded-md whitespace-nowrap border border-blue-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform scale-95 group-hover:scale-100">
              view my Google IT support badge
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900/90 transform rotate-45 border-r border-b border-blue-500/30"></div>
            </div>
          </div>

          <div className="relative group">
            <a href="https://www.virtualbadge.io/certificate-validator?credential=df6eded3-2176-450a-b3bc-0b61e2e0e9a9" target="_blank" rel="noopener noreferrer" aria-label="View Generation Ireland IT Support Graduate Badge">
              <img 
                src="https://vbeventstorage.blob.core.windows.net/cert-qoxb7isytqyrnukw-ntvw/openbadges/badges/1967e450-de14-4eb0-b97e-7bb1d316a791.png?592" 
                alt="Generation Ireland IT Support Graduate" 
                className="h-20 md:h-24 w-auto transition-all duration-300 drop-shadow-[0_0_12px_rgba(59,130,246,0.6)] hover:scale-110 hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.9)]"
              />
            </a>
            <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900/90 backdrop-blur-sm text-blue-300 text-xs font-mono rounded-md whitespace-nowrap border border-blue-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform scale-95 group-hover:scale-100">
              view my IT Support bootcamp badge
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900/90 transform rotate-45 border-r border-b border-blue-500/30"></div>
            </div>
          </div>
        </div>
        {/* Location tag with the pulsing indicator */}
        <div className="mt-12 flex justify-center">
            <div className="inline-flex items-center gap-4 rounded-lg border cyber-border bg-gray-900/40 px-4 py-2 text-sm backdrop-blur-sm transition-all duration-300 hover:cyber-border-glow">
                <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </div>
                <span className="font-mono text-blue-300/80 tracking-widest">// GEO-TAG:</span>
                <span className="text-gray-200">Kildare, Ireland</span>
            </div>
        </div>

      </div>
    </section>
  );
};