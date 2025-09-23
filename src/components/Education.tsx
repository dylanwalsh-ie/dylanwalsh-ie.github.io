/**
 * @file Renders the Education and Certifications section.
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description This file defines the data and components for displaying academic qualifications
 * and professional certifications in a structured grid layout.
 */
import type { EducationItem } from '../../types';
import React, { useRef } from 'react';
import { SectionTitle } from './SectionTitle';
import { useOnScreen } from './useOnScreen';
import { BinaryScrambleText } from './BinaryScrambleText';

const certifications: EducationItem[] = [
  {
    degree: "Artificial Intelligence",
    institution: "ICDL",
    duration: "September 2025",
    location: "Online Certification",
    details: [
        "Distinguished between the core principles of Artificial Intelligence, Machine Learning, Neural Networks, and Deep Learning methodologies.",
        "Identified and assessed the utility of AI in various applications, including data mining, image recognition, Natural Language Processing, and automated decision-making.",
        "Explored the potential and challenges of AI adoption by evaluating its limits, ethical guidelines, and socio-economic impact across sectors like finance, healthcare, and law."
    ],
    syllabusUrl: "https://icdl.org/insights/artificial-intelligence/",
    transcriptUrl: "https://certificates.skillsbox.com/dpc/3aa3df93-0dbb-43ea-b31d-44c2cabea0e5/a2215ff0b0/ipcie",
  },
  {
    degree: "CompTIA A+ Certificate",
    institution: "CompTIA",
    duration: "September 2025",
    location: "Global Certification",
    details: [
      "Expertise in IT operations, device/OS configuration, data backup, and malware removal.",
      "Proficient in client-side virtualisation and cloud concepts."
    ],
    transcriptUrl: "https://www.credly.com/badges/74380a8e-29d1-45bf-bfe7-8e842302bcbb/public_url",
  },
  {
    degree: "Cybersecurity",
    institution: "ICDL",
    duration: "August 2025",
    location: "Online Certification",
    details: [
        "Knowledge in identifying and mitigating a wide range of security threats such as malware, social engineering and phishing.",
        "Foundation in understanding data protection (GDPR), privacy and secure file management.",
        "Implemented security controls by managing network security, configuring firewalls, securing wireless networks, applying MFA and performing secure data backup, restoration and destruction."
    ],
    syllabusUrl: "https://icdl.org/workforce/cyber-security/",
    transcriptUrl: "https://certificates.skillsbox.com/dpc/3aa3df93-0dbb-43ea-b31d-44c2cabea0e5/a2215ff0b0/ipcie",
  },
  {
    degree: "Google IT Support Professional Certificate",
    institution: "Google, Coursera",
    duration: "August 2025",
    location: "Online Certification",
    details: [
        "Strong introduction to customer service and incident handling.",
        "Foundation in system administration (Windows 11, Linux), command-line tools and AI in workflows."
    ],
    syllabusUrl: "https://www.coursera.org/professional-certificates/google-it-support",
    transcriptUrl: "https://www.credly.com/badges/b0f5727e-304a-47c8-ad5a-d2c3a873fd6a/public_url",
  },
  {
    degree: "Teamwork",
    institution: "ICDL",
    duration: "August 2025",
    location: "Online Certification",
    details: [
        "Enhanced team coordination, managed shared calendars, created & assigned tasks and customised the environment to optimise workflows on common collaborative platforms such as Teams, Zoom and Meets.",
        "Learned to manage conversations, hosted meetings and webinars and collaborating on shared documents in the cloud."
    ],
    syllabusUrl: "https://icdl.org/workforce/teamwork/",
    transcriptUrl: "https://certificates.skillsbox.com/dpc/3aa3df93-0dbb-43ea-b31d-44c2cabea0e5/a2215ff0b0/ipcie",
  },
  {
    degree: "Computer & Online Essentials",
    institution: "ICDL",
    duration: "July 2025",
    location: "Online Certification",
    details: [
        "Managed computer hardware, software and operating systems (Windows 10, ChomeOS) through file/folder organisation and application management.",
        "Covered fundamental networking concepts, configured network connections, used online communication tools such as Outlook."
    ],
    syllabusUrl: "https://icdl.org/workforce/computer-and-online-essentials/",
    transcriptUrl: "https://certificates.skillsbox.com/dpc/3aa3df93-0dbb-43ea-b31d-44c2cabea0e5/a2215ff0b0/ipcie",
  },
  {
    degree: "Databases",
    institution: "ICDL",
    duration: "August 2024",
    location: "Online Certification",
    details: [
        "Covered core database concepts, such as organising tables, records, fields and relationships.",
        "Skilled in retrieving & managing information by using queries, designing data entry forms and generating reports for data analysis."
    ],
    syllabusUrl: "https://icdl.org/professional/using-databases/",
    transcriptUrl: "https://certificates.skillsbox.com/dpc/3aa3df93-0dbb-43ea-b31d-44c2cabea0e5/a2215ff0b0/ipcie",
  }
];

const academicQualifications: EducationItem[] = [
  {
    degree: "Master of Science in Data Science",
    grade: "1.1",
    institution: "South East Technological University Carlow",
    duration: "September 2023 - September 2024",
    location: "Carlow (Part-time, Online)",
    details: [
        "Developed automated ETL workflows using Python and SQL.",
        "Gained practical skills in server management, connectivity troubleshooting and log analysis."
    ],
    syllabusUrl: "https://www.setu.ie/courses/msc-in-data-science"
  },
  {
    degree: "Bachelor of Science in Computer Science",
    grade: "2.1",
    institution: "Atlantic Technological University Donegal",
    duration: "September 2021 - May 2023",
    location: "Letterkenny, Donegal",
    details: [
        "Learned to automate system administration tasks in python in my scripting module.",
        "Applied network configuration and troubleshooting (TCP/IP, DNS, DHCP, VPNs) in my IT infrastructure module."
    ],
    syllabusUrl: "https://www.atu.ie/courses/bachelor-of-science-honours-computer-science#:~:text=Course%20Overview,Minimum%20grades%20apply."
  },
  {
    degree: "Higher Certificate in Computing in Programming",
    grade: "Distinction",
    institution: "South East Technological University Carlow",
    duration: "September 2019 - May 2021",
    location: "Carlow",
    details: [
        "Hands-on experience building, repairing and upgrading computers in my hardware module."
    ],
    syllabusUrl: "https://www.setu.ie/courses/higher-certificate-science-in-computing-with-options-in-applications-or-programming#:~:text=Course%20Structure,in%20computer%20applications%20or%20programming."
  },
  {
    degree: "Advanced Certificate in Software Development",
    grade: "Distinction",
    institution: "St.Conleth's Community College",
    duration: "September 2018 - April 2019",
    location: "Newbridge, Kildare",
    details: [
      "Built foundation in the Agile methodology specifically within the Software Development Lifecycle (SDLC)",
      "Introduced to software design for business applications and games",
      "Developed desktop applications using C#"
    ],
    syllabusUrl: "https://qsdocs.qqi.ie//sites/docs/AwardsLibraryPdf/6M0691_AwardSpecifications_English.pdf"
  }
];


const EducationCard: React.FC<{ item: EducationItem, startAnimation: boolean }> = ({ item, startAnimation }) => (
    <div className="group relative h-full cyber-card flex flex-col overflow-hidden">
        <div className="p-4 border-b border-blue-900/50">
            <h3 className="text-lg font-bold text-blue-300">{item.degree}</h3>
            <p className="text-sm text-gray-400">{item.institution}</p>
        </div>
        <div className="p-4 flex-grow">
            <div className="mb-4 text-sm font-mono text-blue-400 space-y-1">
                {item.grade && <p>GRADE: {item.grade}</p>}
                <p>DATE: {item.duration}</p>
                <p>ORIGIN: {item.location}</p>
            </div>
            <ul className="space-y-2 text-gray-400 text-base">
                {item.details.map((detail, index) => (
                    <li key={index} className="flex">
                      <span className="text-blue-400 mr-3 font-mono">{'>'}</span>
                      <span>
                        <BinaryScrambleText text={detail} start={startAnimation} as="span" speed={10} />
                      </span>
                    </li>
                ))}
            </ul>
        </div>
        
        {(item.syllabusUrl || item.transcriptUrl) && (
            <div className="transition-all duration-300 ease-in-out max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 overflow-hidden">
                <div className="border-t border-blue-900/50 p-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    {item.syllabusUrl && (
                        <a 
                            href={item.syllabusUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-center px-4 py-2 rounded-md border border-blue-900/50 bg-blue-900/50 text-blue-300 font-mono text-sm uppercase tracking-wider transition-all duration-200 hover:bg-blue-800/70 hover:scale-105 hover:shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                        >
                            View Syllabus
                        </a>
                    )}
                    {item.transcriptUrl && (
                        <a 
                            href={item.transcriptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-center px-4 py-2 rounded-md border border-blue-900/50 bg-blue-900/50 text-blue-300 font-mono text-sm uppercase tracking-wider transition-all duration-200 hover:bg-blue-800/70 hover:scale-105 hover:shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                        >
                            View Transcript
                        </a>
                    )}
                </div>
            </div>
        )}
    </div>
);


export const Education: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const isVisible = useOnScreen(ref, { threshold: 0.1 });

  return (
    <section id="education" ref={ref}>
      <SectionTitle>Education & Certifications</SectionTitle>
      <div className="space-y-12">
        <div>
          <h3 className="font-mono text-lg text-blue-300/90 mb-6 tracking-wider border-b-2 border-blue-900/50 pb-2">
            // Professional Certifications
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {certifications.map((item, index) => <EducationCard key={index} item={item} startAnimation={isVisible} />)}
          </div>
        </div>

        <div>
          <h3 className="font-mono text-lg text-blue-300/90 mb-6 tracking-wider border-b-2 border-blue-900/50 pb-2">
            // Academic Qualifications
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {academicQualifications.map((item, index) => <EducationCard key={index} item={item} startAnimation={isVisible} />)}
          </div>
        </div>
      </div>
    </section>
  );
};