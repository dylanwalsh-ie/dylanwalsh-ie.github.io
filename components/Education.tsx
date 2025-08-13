
import React from 'react';
import { Section } from './Section';
import { education } from '../data/portfolioData';
import { EducationEntry } from '../types';
import { MortarBoardIcon } from './icons/MortarBoardIcon';
import { CertificateIcon } from './icons/CertificateIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

const GoogleBadge: React.FC<{ className?: string }> = ({ className = "w-32 h-32" }) => (
    <svg className={className} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="2"/>
        <path d="M60 25L30 42.5V77.5L60 95L90 77.5V42.5L60 25Z" fill="#4285F4"/>
        <path d="M60 25V95L90 77.5V42.5L60 25Z" fill="#1A73E8"/>
        <path d="M30 42.5L60 60L90 42.5L60 25L30 42.5Z" fill="#FFFFFF" fillOpacity="0.7"/>
        <text x="60" y="65" fontFamily="Arial, sans-serif" fontSize="10" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">Google IT</text>
    </svg>
);

const EducationCard: React.FC<{ entry: EducationEntry }> = ({ entry }) => {
    const isDegree = entry.credential_type === 'Degree';
    const hasBadge = entry.isBadgeEmbed || entry.badgeImage;

    return (
        <div className="bg-white dark:bg-[var(--bg-card-dark)] rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform duration-300 ease-in-out hover:-translate-y-2">
            <div className="bg-gradient-to-r from-[#007BFF] to-[#0056b3] h-1.5" />
            <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 text-[#007BFF] mt-1">
                        {isDegree ? <MortarBoardIcon className="w-8 h-8" /> : <CertificateIcon className="w-8 h-8" />}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{entry.title}</h3>
                        <p className="text-md font-semibold text-gray-600 dark:text-gray-400">{entry.institution}</p>
                        <p className="text-sm text-gray-500">{entry.date}</p>
                    </div>
                </div>

                {hasBadge && (
                    <a href={entry.verificationUrl} target="_blank" rel="noopener noreferrer" className="my-4 block mx-auto w-fit group" aria-label={`View credential for ${entry.title}`}>
                        <div className="transition-transform duration-300 group-hover:scale-110">
                            {entry.isBadgeEmbed && <GoogleBadge />}
                            {entry.badgeImage && (
                                <img src={entry.badgeImage} alt={`${entry.title} badge`} className="w-32 h-32 object-contain rounded-lg" />
                            )}
                        </div>
                    </a>
                )}
                
                <div className="flex-grow" />

                {(entry.verificationUrl || entry.transcriptUrl) && (
                    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 flex items-center justify-start gap-6">
                        {entry.verificationUrl && (
                             <a href={entry.verificationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#007BFF] font-semibold hover:underline">
                                <ExternalLinkIcon className="w-4 h-4" />
                                <span>Credential</span>
                            </a>
                        )}
                        {entry.transcriptUrl && (
                             <a href={entry.transcriptUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#007BFF] font-semibold hover:underline">
                                 <ExternalLinkIcon className="w-4 h-4" />
                                <span>Transcript</span>
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};


export const Education = () => {
    return (
        <Section id="education">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Education & Certifications
            </h2>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {education.map((entry) => (
                    <EducationCard key={entry.title} entry={entry} />
                ))}
            </div>
        </Section>
    );
};
