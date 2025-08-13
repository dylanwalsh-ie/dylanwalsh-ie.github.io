import React from 'react';
import { Project } from '../types';
import { Terminal } from './Terminal';
import { GithubIcon } from './icons/GithubIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

interface ProjectShowcaseProps {
    project: Project;
    index: number;
}

const ProjectRunner: React.FC<{ project: Project }> = ({ project }) => {
    switch (project.type) {
        case 'web':
            return (
                <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700">
                    <iframe
                        src={project.liveUrl}
                        title={project.title}
                        className="w-full h-full"
                        loading="lazy"
                    />
                </div>
            );
        case 'script':
            return <Terminal scriptDetails={project.scriptDetails!} />;
        case 'meta':
             return (
                 <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden shadow-inner flex items-center justify-center p-4">
                     <img src={project.image} alt={project.title} className="w-full h-full object-cover rounded-md" />
                 </div>
             );
        default:
            return null;
    }
};

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ project, index }) => {
    const isReversed = index % 2 !== 0;
    const textOrderClass = isReversed ? 'lg:order-2' : 'lg:order-1';
    const runnerOrderClass = isReversed ? 'lg:order-1' : 'lg:order-2';

    return (
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className={textOrderClass}>
                <h3 className="text-2xl font-bold text-[#007BFF] dark:text-white mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map(tech => (
                        <span key={tech} className="bg-gray-200 dark:bg-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                            {tech}
                        </span>
                    ))}
                </div>
                <div className="flex items-center space-x-4">
                    {project.codeUrl && (
                        <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors font-semibold">
                            <GithubIcon className="h-5 w-5" />
                            <span>View Code</span>
                        </a>
                    )}
                    {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors font-semibold">
                            <ExternalLinkIcon className="h-5 w-5" />
                            <span>Live Demo</span>
                        </a>
                    )}
                </div>
            </div>

            <div className={`aspect-video rounded-lg shadow-lg bg-white dark:bg-[var(--bg-card-dark)] p-2 ${runnerOrderClass}`}>
                <ProjectRunner project={project} />
            </div>
        </div>
    );
};