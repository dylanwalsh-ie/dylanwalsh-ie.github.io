/**
 * @file Renders an animated "boot sequence" loading screen
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description Displays a themed loading animation that simulates a system booting up
 */
import React, { useState, useEffect } from 'react';

// Array of obhects defining each step of the animation boot sequence
const bootSequence = [
  { text: 'INITIATING BOOT SEQUENCE...', status: 'INIT' },
  { text: 'BIOS CHECK...', status: 'OK' },
  { text: 'LOADING KERNEL v3.77...', status: 'OK' },
  { text: 'MOUNTING FILE SYSTEMS...', status: 'OK' },
  { text: 'DECRYPTING DATA STREAMS...', status: 'WARN' },
  { text: 'SYNCHING CYBERDECK I/O...', status: 'OK' },
  { text: 'ESTABLISHING NEURAL-LINK...', status: 'OK' },
  { text: 'SYSTEM ONLINE. WELCOME, OPERATOR.', status: 'SUCCESS' },
];

interface LoadingScreenProps {
  isActive: boolean;
  onFinished: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'OK':
    case 'SUCCESS':
      return 'text-green-400';
    case 'WARN':
      return 'text-yellow-400';
    case 'FAIL':
      return 'text-red-400';
    default:
      return 'text-blue-400';
  }
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isActive, onFinished }) => {
  const [displayedLines, setDisplayedLines] = useState<(typeof bootSequence)[number][]>([]);
  const [progress, setProgress] = useState(0);
  const totalDuration = 4000; // Total animation time
  const stepDelay = totalDuration / bootSequence.length;

  useEffect(() => {
    if (!isActive) return;
    
    // Reset for potential re-runs
    setDisplayedLines([]);
    setProgress(0);

    const timeouts: number[] = [];

    bootSequence.forEach((item, index) => {
      const timeoutId = window.setTimeout(() => {
        setDisplayedLines(prev => [...prev, item]);
        setProgress(((index + 1) / bootSequence.length) * 100);

        // After the last item is displayed, wait a moment then finish
        if (index === bootSequence.length - 1) {
          const finishTimeout = window.setTimeout(onFinished, 750);
          timeouts.push(finishTimeout);
        }
      }, index * stepDelay);
      timeouts.push(timeoutId);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isActive, onFinished, stepDelay]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0d1117] transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'} scanline-overlay`}
      aria-live="polite"
      aria-busy={isActive}
    >
      <div className="font-mono text-blue-300 cyber-glow w-full max-w-lg p-4">
        {displayedLines.map((line, index) => (
          <div key={index} className="flex items-center text-sm md:text-base mb-1 animate-fade-in">
            <span className={`w-20 flex-shrink-0 font-bold ${getStatusColor(line.status)}`}>
              [{line.status}]
            </span>
            <p className="ml-4 flex-1 tracking-wider">
              {line.text}
              {index === displayedLines.length - 1 && index < bootSequence.length - 1 && (
                <span className="blinking-cursor">_</span>
              )}
            </p>
          </div>
        ))}

        <div className="w-full h-2 bg-blue-900/50 mt-6 border border-blue-500/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-400 rounded-full" 
            style={{ width: `${progress}%`, transition: `width ${stepDelay / 1000}s linear` }}
          ></div>
        </div>
      </div>
    </div>
  );
};