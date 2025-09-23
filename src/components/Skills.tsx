/**
 * @file Renders the "Skills" section of the portfolio
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description Defines the skills data and the components required to display them
 * in categorised groups with a cyberpunk theme.
 */
import React from 'react';
import { SectionTitle } from './SectionTitle';

// Object containing all skills grouped by category from resume
const skillsData = {
  "IT Service Management": ["Incident Logging & Tracking", "User Issue Resolution", "Ticketing Systems (Spiceworks)"],
  "Operating Systems & Virtualisation": ["Windows 11/10", "Linux (Ubuntu)", "Android", "iOS", "VirtualBox", "VMware"],
  "Helpdesk Tools & Applications": ["Microsoft 365", "Remote Desktop (TeamViewer)"],
  "Scripting, Automation & Databases": ["Python", "PowerShell", "Bash", "Git & Git Actions", "MySQL", "PostgreSQL", "SQLite"],
  "Soft Skills": ["Empathetic Communication", "Collaborative Problem Solving", "Adaptable"],
};

const SkillCategory: React.FC<{ title: string; skills: string[] }> = ({ title, skills }) => (
  <div>
    <h3 className="font-mono text-sm text-blue-300/80 mb-3 tracking-wider">// MODULE: {title}</h3>
    <div className="flex flex-wrap gap-3">
      {skills.map(skill => (
        <span 
          key={skill} 
          className="font-mono text-gray-300 text-sm px-4 py-1 bg-gray-900/60 border border-blue-900/80 cursor-default transition-all duration-300 hover:bg-blue-900/50 hover:text-blue-300 hover:border-blue-400 hover:shadow-[0_0_10px_rgba(96,165,250,0.3)]"
          style={{ clipPath: 'polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
);

export const Skills: React.FC = () => {
  return (
    <section id="skills">
      <SectionTitle>System Diagnostics</SectionTitle>
      <div className="cyber-card p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {Object.entries(skillsData).map(([category, skills]) => (
          <SkillCategory key={category} title={category} skills={skills} />
        ))}
      </div>
    </section>
  );
};