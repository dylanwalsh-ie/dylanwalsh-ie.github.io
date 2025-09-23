/**
 * @file Contact section component.
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description Renders the contact information, including an email address with a
 * "copy to clipboard" feature and links to social profiles.
 */
import React, { useState, useEffect, useRef } from 'react';
import { SectionTitle } from './SectionTitle';
import { MailIcon, LinkedinIcon, GithubIcon, CopyIcon, CheckIcon, ExternalLinkIcon } from './icons/SocialIcons';

export const Contact: React.FC = () => {
  const email = "dylanwalsh23ie@gmail.com";
  const [copyMessage, setCopyMessage] = useState('');
  // Reference to store timeout ID to clear if user spam clicks copy
  const timeoutRef = useRef<number | null>(null);

  // Uses browser's clipboard API to copy email
  const handleCopyEmail = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Writes email text to user's clipboard
    navigator.clipboard.writeText(email).then(() => {
      // If successful, display confirmation message
      setCopyMessage('// ADDRESS COPIED TO CLIPBOARD');
      // Clear message after 3 seconds
      timeoutRef.current = window.setTimeout(() => {
        setCopyMessage('');
      }, 3000);
    }).catch(err => {
      // If failed, display error message and clear after 3 seconds
      console.error("Failed to copy email: ", err);
      setCopyMessage('// COPY FAILED. CHECK PERMISSIONS.');
      timeoutRef.current = window.setTimeout(() => {
        setCopyMessage('');
      }, 3000);
    });
  };

  // Cleanup timeout on component unmount, prevents memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <section id="contact">
      <SectionTitle>Contact Protocol</SectionTitle>

      {/* Main Hub Container */}
      <div className="cyber-card overflow-hidden">
        
        {/* Hub Header */}
        <div className="px-4 py-2 border-b border-blue-900/50 bg-gray-900/40 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="font-mono text-xs text-green-400/80 tracking-widest">SYSTEM ONLINE</span>
          </div>
          <h3 className="font-mono text-xs uppercase text-blue-400/70 tracking-widest">
            // COMMS_HUB_v2.3
          </h3>
        </div>

        {/* Hub Body */}
        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative z-10">
          
          {/* Primary Panel (Email) */}
          <div className="md:col-span-2 cyber-card p-4 flex flex-col justify-between">
            <div>
              <h4 className="font-mono text-sm text-blue-300/80 mb-2 tracking-wider">// INITIATE CONTACT //</h4>
              <div className="flex items-center gap-4 mb-4">
                <MailIcon className="w-8 h-8 text-blue-400 flex-shrink-0"/>
                <p className="text-base text-gray-200 break-all">{email}</p>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span className="font-mono text-xs text-green-400 tracking-widest">SECURE CONNECTION</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={handleCopyEmail}
                className="flex-grow text-center px-4 py-2 rounded-md border border-blue-900/50 bg-blue-900/50 text-blue-300 font-mono text-sm uppercase tracking-wider transition-all duration-200 hover:bg-blue-800/70 hover:scale-105 hover:shadow-[0_0_8px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2"
              >
                <CopyIcon className="w-4 h-4" />
                <span>Copy Email Address</span>
              </button>
              <div className="h-6 text-center sm:text-left flex-grow">
                {copyMessage && (
                  <p className="font-mono text-xs text-green-400 animate-fade-in">
                    {copyMessage}<span className="blinking-cursor">_</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Secondary Panel (Social) */}
          <div className="cyber-card p-4">
            <h4 className="font-mono text-sm text-blue-300/80 mb-4 tracking-wider">// DATA LINKS //</h4>
            <div className="space-y-4">
              <a href="https://linkedin.com/in/dylanwalshire23" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 transition-colors duration-300 hover:text-blue-300">
                <LinkedinIcon className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
                <span className="flex-grow text-sm">LinkedIn</span>
                <ExternalLinkIcon className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="https://github.com/dylanwalsh-ie" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 transition-colors duration-300 hover:text-blue-300">
                <GithubIcon className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
                <span className="flex-grow text-sm">Github</span>
                <ExternalLinkIcon className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Hub Footer / Dossier Request */}
        <div className="p-4 border-t border-blue-900/50 bg-gray-900/40 text-center relative z-10">
            <h4 className="font-mono text-md text-blue-300 uppercase tracking-widest cyber-glow">// SECURE DOCUMENT REQUEST //</h4>
            <p className="text-xs text-gray-400 mt-2 font-mono">[ Includes: Professional References & Academic Transcripts ]</p>
            <p className="text-xs text-blue-400/70 mt-1 font-mono">// Please request via email for access //</p>
        </div>

      </div>
    </section>
  );
};