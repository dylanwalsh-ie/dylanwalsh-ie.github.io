/**
 * @file Renders the "Interests" section of the portfolio
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description Displays personal interests in a themed "log entry" format
 */
import React, { useRef } from 'react';
import { SectionTitle } from './SectionTitle';
import { useOnScreen } from './useOnScreen';
import { BinaryScrambleText } from './BinaryScrambleText';

export const Interests: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const isVisible = useOnScreen(ref, { threshold: 0.5 });

  return (
    <section id="interests" ref={ref}>
      <SectionTitle>Interests</SectionTitle>
      <div className="cyber-card">
        <div className="px-4 py-2 border-b border-blue-900/50 bg-gray-900/40">
            <h3 className="font-mono text-xs uppercase text-blue-400/70 tracking-widest">
              USER: D.WALSH // TIMESTAMP: {new Date().toISOString()}
            </h3>
        </div>
        <div className="p-6">
          <h4 className="font-mono text-sm uppercase text-blue-400/90 tracking-widest mb-3">[ Personal Log Entry ]</h4>
          <p className="text-gray-300 leading-relaxed font-mono text-base">
            <BinaryScrambleText
                start={isVisible}
                text="I am passionate about learning new technologies and I like to satisfy my curiosity by listening to technology podcasts, deep diving on emerging trends like computer brain interfaces. I manage a long-term personal project, digitally archiving years of my life into a searchable database, which I began 2 years ago, using journal entries I’ve kept from the age of 13 up until now. This requires meticulous documentation and an organised approach to managing the entries"
                as="span"
                speed={5}
            />
          </p>
        </div>
      </div>
    </section>
  );
};
