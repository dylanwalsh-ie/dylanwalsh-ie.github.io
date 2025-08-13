

import React from 'react';
import { Section } from './Section';
import { projects } from '../data/portfolioData';
import { ProjectShowcase } from './ProjectShowcase';

export const Projects = () => {
    return (
        <Section id="projects">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                My Projects
            </h2>
            <div className="space-y-24">
                {projects.map((project, index) => (
                    <ProjectShowcase key={project.title} project={project} index={index} />
                ))}
            </div>
        </Section>
    );
};
