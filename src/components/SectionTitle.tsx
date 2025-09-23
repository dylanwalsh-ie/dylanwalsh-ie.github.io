/**
 * @file Renders a reusable, animated title for each major section
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description Displays a section title with a cyberpunk theme and
 * triggers a text scramble animation when it comes into view
 */
import React, { useRef } from 'react';
import { useOnScreen } from './useOnScreen';
import { BinaryScrambleText } from './BinaryScrambleText';

interface SectionTitleProps {
  children: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => {
  const titleText = String(children);
  const ref = useRef<HTMLHeadingElement>(null);
  const isVisible = useOnScreen(ref, { threshold: 0.5, triggerOnce: true });
  
  return (
    <h2 
      ref={ref}
      className="text-2xl font-bold tracking-widest text-blue-400 uppercase mb-8 relative pb-2 cyber-glitch-text"
      data-text={titleText}
      style={{ minHeight: '32px' }}
    >
      <BinaryScrambleText text={titleText} start={isVisible} as="span" speed={40} />
      <span className="absolute bottom-0 left-0 h-0.5 w-16 bg-blue-500"></span>
    </h2>
  );
};
