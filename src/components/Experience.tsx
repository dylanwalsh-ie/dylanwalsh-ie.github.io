/**
 * @file Renders the Professional Experience section.
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description This file defines the data and components for displaying professional
 * work history in an interactive, cyberpunk-themed accordion layout.
 */
import type { ExperienceItem as ExperienceItemType } from '../../types';
import React, { useState, useRef } from 'react';
import { SectionTitle } from './SectionTitle';
import { FolderIcon, ChevronDownIcon } from './icons/SocialIcons';
import { useOnScreen } from './useOnScreen';
import { BinaryScrambleText } from './BinaryScrambleText';

const experienceData: ExperienceItemType[] = [
  {
    role: "GCX Risk Teammate",
    company: "eBay",
    duration: "October 2025 - Present",
    location: "Remote, Ireland",
    points: [
      "As part of eBay's Global Customer Protection Operations, my role is on the front-line, safeguarding platform integrity by managing the end-to-end lifecycle of account-related security incidents, to proactive fraud mitigation.",
      "Handling Identity & Access Management through multi-layered identity verification protocols to combat social engineering and ensure the highest standard of account security",
      "Perform risk assessments and user-behavioural analysis to identify fraudulent patterns and suspicious activity to maintain platform integrity",
      "Ensure strict compliance with international data privacy laws and consumer protection regulations to maintain platform governance",
      "Empower customers to adopt best security practices to mitigate future account vulnerabilities"
    ]
  },
  {
    role: "I.T. Support with Cybersecurity Bootcamp",
    company: "Generation UK & Ireland",
    duration: "June 2025 - August 2025",
    location: "Remote, Ireland",
    points: [
      "Diagnosed complex hardware, software and network problems across Windows, Linux, Android and iOS.",
      "Adapted communication style for empathetic customer service via phone, email, and webchat.",
      "Integrated AI tools like Gemini into Spiceworks to accelerate ticket resolutions.",
      "Enhanced teamwork and organisation skills through collaborative group projects.",
      "Gained a strong foundation in cybersecurity, password hygiene, and incident management."
    ],
    syllabusUrl: "https://docs.google.com/document/d/1vxxcbH-FUhHLJpB8OMbtR_PI_iyWh5D6V3ySBS5p_9g/edit?usp=sharing",
    transcriptUrl: "https://www.virtualbadge.io/certificate-validator?credential=df6eded3-2176-450a-b3bc-0b61e2e0e9a9"
  },
  {
    role: "Database Administrator",
    company: "CoLab ATU",
    duration: "June 2023 - May 2024",
    location: "Letterkenny, Donegal",
    points: [
      "Managed a PostgreSQL cluster with over 4,200 records, sustaining 99% uptime.",
      "Performed daily backups and recovery for Microsoft SQL Server, reducing data loss by 25%.",
      "Moved data into Snowflake using SQL queries and Python ETL processes.",
      "Ensured proper access permissions and provided off-site support using TeamViewer."
    ]
  },
  {
    role: "Data Analyst",
    company: "TELUS Digital AI Data Solutions",
    duration: "June 2024 - January 2025",
    location: "Remote",
    points: [
      "Enhanced ML models for large search engines and digital mapping applications",
      "Performed high-stakes relevance rating and quality checks across geospatial data to refine models during post-training",
      "Utilised data annotation platforms and internal rating UIs to classify, tag and structure training data for ML pipelines",
      "Applied advanced search operators within online mapping software to verify geospatial data and evaluate result quality vs user intent",
      "Strictly adhered to project guidelines and QA standards while classifying and structuring datasets which included NLU segmentation"
    ]
  },
  {
    role: "Admin Assistant",
    company: "Atlantic Technological University",
    duration: "November 2021 - April 2023",
    location: "Letterkenny, Donegal",
    points: [
      "Served as main point of contact for student queries to enhance service delivery.",
      "Managed over 600 student records in PLSS, TACS and PeopleXD.",
      "Maintained 100% GDPR compliance and protected sensitive information.",
      "Optimised Outlook use for scheduling, increasing student attendance by 40%."
    ]
  },
];


const ExperienceFile: React.FC<{ item: ExperienceItemType, defaultOpen?: boolean, startAnimation: boolean }> = ({ item, defaultOpen = false, startAnimation }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left transition-colors duration-200 hover:bg-blue-900/20 focus:outline-none focus:bg-blue-900/30 group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <FolderIcon className="w-5 h-5 text-blue-400 flex-shrink-0 transition-colors duration-300 group-hover:text-blue-300" />
          <span className="font-medium text-gray-200 transition-colors duration-300 group-hover:text-blue-300">{item.role}</span>
        </div>
        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} group-hover:text-gray-200`} />
      </button>

      <div
        className={`grid overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
            <div className={`pl-8 pr-4 pb-6 pt-2 ${isOpen ? 'animate-fade-in' : ''}`}>
                <div className="relative pl-6">
                    <div className="absolute left-0 top-1.5 h-full w-px bg-blue-900/50"></div>
                    <div className="absolute left-[-2.5px] top-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 timeline-node-ping"></div>

                    <h3 className="text-xl font-bold text-blue-300">{item.company}</h3>
                    <p className="font-mono text-sm text-blue-400/70 tracking-widest mt-1 mb-4">{`[ ${item.duration} // ${item.location} ]`}</p>

                    <ul className="space-y-2 text-gray-400 text-base">
                        {item.points.map((point, index) => (
                        <li key={index} className="flex">
                            <span className="text-blue-400 mr-3 font-mono cyber-glow">{'>'}</span>
                            <span>
                                <BinaryScrambleText text={point} start={startAnimation && isOpen} as="span" speed={10} />
                            </span>
                        </li>
                        ))}
                    </ul>

                    {(item.syllabusUrl || item.transcriptUrl) && (
                        <div className="mt-4 pt-4 border-t border-blue-900/50 flex flex-wrap items-center justify-start gap-4">
                            {item.syllabusUrl && (
                                <a 
                                    href={item.syllabusUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-center px-4 py-2 rounded-md border border-blue-900/50 bg-blue-900/50 text-blue-300 font-mono text-sm uppercase tracking-wider transition-all duration-200 hover:bg-blue-800/70 hover:scale-105 hover:shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                >
                                    View Syllabus
                                </a>
                            )}
                            {item.transcriptUrl && (
                                <a 
                                    href={item.transcriptUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-center px-4 py-2 rounded-md border border-blue-900/50 bg-blue-900/50 text-blue-300 font-mono text-sm uppercase tracking-wider transition-all duration-200 hover:bg-blue-800/70 hover:scale-105 hover:shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                >
                                    View Transcript
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};


export const Experience: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const isVisible = useOnScreen(ref, { threshold: 0.1 });

  return (
    <section id="experience" ref={ref}>
      <SectionTitle>Mission Chronology</SectionTitle>
      
      <div className="cyber-card overflow-hidden">
        
        <div className="px-4 py-2 border-b border-blue-900/50 bg-gray-900/40 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
                <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </div>
                <span className="font-mono text-xs text-blue-400/80 tracking-widest">// ACCESSING ARCHIVES //</span>
            </div>
            <h3 className="font-mono text-xs uppercase text-blue-400/70 tracking-widest flex items-center">
                /var/logs/mission_chronology<span className="blinking-cursor">_</span>
            </h3>
        </div>
        
        <div className="divide-y divide-blue-900/50 relative z-10">
          {experienceData.map((item, index) => <ExperienceFile key={index} item={item} defaultOpen={true} startAnimation={isVisible} />)}
        </div>

      </div>
    </section>
  );
};