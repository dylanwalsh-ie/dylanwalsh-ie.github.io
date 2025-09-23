/**
 * @file Displays an embedded Google Slides presentation
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description Provides a themed viewer for an embedded presentation,
 * complete with a side panel for context and a close button
 */
import React from 'react';
import { XIcon } from '../icons/ProjectIcons';

const PresentationViewer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // URL for generation UK and Ireland group project presentation
  const presentationUrl = "https://docs.google.com/presentation/d/e/2PACX-1vQy9YUVaj86L_pw6i-bIC9yyeB51YJwU-Ssd61SXlCy5j2BA4ZGNfrjmIxsln3oCFxqr87w21-ojB2L/embed?start=false&loop=false&delayms=3000&rm=minimal";
  const title = "// BOOTCAMP_PROJECT :: IT_OPERATIONS_PROPOSAL";
  const description = "During my time in Generation Ireland's IT Support bootcamp, I was apart of a group project tasked with improving a companies' IT operations which is currently impacting business efficiency, security, and employee satisfaction. We suggested industry-standard improvements in areas such as security, knowledge bases, appropriate ticketing systems and networking.";

  return (
    <div className="h-full w-full flex flex-col relative text-white bg-black/30">
      <header className="w-full bg-gray-900/50 backdrop-blur-lg border-b cyber-border p-2 flex items-center justify-between z-10 flex-shrink-0">
        <h2 className="font-mono text-lg text-blue-300 cyber-glow px-2 cyber-glitch-text" data-text={title}>{title}</h2>
        <button onClick={onClose} className="px-3 py-1 rounded-md hover:bg-red-500/50 transition-colors font-sans text-xl leading-none">×</button>
      </header>
      
      <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
        <main className="flex-grow relative p-4 lg:p-8 flex items-center justify-center bg-grid-pattern">
            <div className="w-full max-w-6xl aspect-video relative border-2 border-blue-500/50 shadow-lg shadow-blue-500/20">
                <iframe
                    src={presentationUrl}
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    allowFullScreen={true}
                    className="absolute top-0 left-0 w-full h-full"
                ></iframe>
                <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-40"></div>
            </div>
        </main>

        <aside className="w-full lg:w-80 flex-shrink-0 bg-black/30 border-t-2 lg:border-t-0 lg:border-l-2 border-blue-500/30 p-4 overflow-y-auto cyber-scrollbar">
            <div className="cyber-panel p-4 relative h-full">
                <span className="corner corner-tl"></span>
                <span className="corner corner-tr"></span>
                <span className="corner corner-bl"></span>
                <span className="corner corner-br"></span>
                <div className="border-b cyber-border -mx-4 px-4 pb-2 mb-4">
                    <h3 className="font-mono text-md text-blue-300/90 tracking-wider">// PROJECT_BRIEFING</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed font-mono">{description}</p>
            </div>
        </aside>
      </div>
    </div>
  );
};

export default PresentationViewer;