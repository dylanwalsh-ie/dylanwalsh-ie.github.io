/**
 * @file Renders the "Interactive Projects" section
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description Displays a grid of project cards
 * Clicking a card launches the project component in an overlay
 */
import React, { useState } from 'react';
import { SectionTitle } from './SectionTitle';
import InfrastructureBuilder from './projects/InfrastructureBuilder';
import DataPlayground from './projects/DataPlayground';
import PresentationViewer from './projects/PresentationViewer';
import PhishingSimulator from './projects/PhishingSimulator';
import HelpdeskSimulator from './projects/HelpdeskSimulator';
import SentimentAnalyzer from './projects/SentimentAnalyzer';

const ProjectCard: React.FC<{ title: string; description: string; onLaunch: () => void }> = ({ title, description, onLaunch }) => (
    <div className="cyber-card p-6 flex flex-col items-start">
        <h3 className="font-mono text-lg text-blue-300/90 tracking-wider mb-3">// {title}</h3>
        <p className="text-gray-400 text-base mb-6 flex-grow">{description}</p>
        <button 
            onClick={onLaunch}
            className="text-center px-4 py-2 rounded-md border border-blue-900/50 bg-blue-900/50 text-blue-300 font-mono text-sm uppercase tracking-wider transition-all duration-200 hover:bg-blue-800/70 hover:scale-105 hover:shadow-[0_0_8px_rgba(59,130,246,0.5)]"
        >
            // View Project
        </button>
    </div>
);

export const Projects: React.FC = () => {
    const [activeProject, setActiveProject] = useState<string | null>(null);

    const renderActiveProject = () => {
        if (!activeProject) return null;

        const handleClose = () => setActiveProject(null);

        return (
            <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 animate-fade-in">
                <div className="cyber-card w-full h-full max-w-7xl max-h-[95vh] overflow-hidden bg-[#0d1117]">
                    {activeProject === 'infra-builder' && <InfrastructureBuilder onClose={handleClose} />}
                    {activeProject === 'data-playground' && <DataPlayground onClose={handleClose} />}
                    {activeProject === 'phishing-simulator' && <PhishingSimulator onClose={handleClose} />}
                    {activeProject === 'helpdesk-simulator' && <HelpdeskSimulator onClose={handleClose} />}
                    {activeProject === 'it-operations-presentation' && <PresentationViewer onClose={handleClose} />}
                    {activeProject === 'sentiment-analyzer' && <SentimentAnalyzer onClose={handleClose} />}
                </div>
            </div>
        );
    };

    return (
        <section id="projects">
            <SectionTitle>Interactive Projects</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProjectCard 
                    title="Home Network Simulator"
                    description="A concept design tool to visualise potential home network setups. Drag and drop different components, connect them and run simulations to test your configurations."
                    onLaunch={() => setActiveProject('infra-builder')}
                />
                <ProjectCard 
                    title="Cloud CSV Query Engine"
                    description="A serverless BI tool that connects to cloud-hosted CSV files (Google Sheets, Excel) and performs complex multi-table SQL queries such as joins and aggregations. You can also visualise the results with interactive charts."
                    onLaunch={() => setActiveProject('data-playground')}
                />
                <ProjectCard 
                    title="Phishing Awareness Simulator"
                    description="An interactive simulation of a phishing attempt. Users are presented with a fake email and login page to identify 'red flags' and learn about social engineering tactics."
                    onLaunch={() => setActiveProject('phishing-simulator')}
                />
                 <ProjectCard 
                    title="Helpdesk Ticket Simulator"
                    description="A simple, interactive ticket simulation that allows you to submit tickets, view ticket status', resolve tickets and search a knowledge base (note: only 2 knowledge articles are integrated, of which I created during my I.T. Support bootcamp)"
                    onLaunch={() => setActiveProject('helpdesk-simulator')}
                />
                <ProjectCard 
                    title="CX De-escalation Simulator"
                    description="An interactive customer service simulation where you need to navigate a difficult conversation, maintaining professionalism and empathy. Utilises sentiment analysis to provide further insights into customer impact in realt-ime."
                    onLaunch={() => setActiveProject('sentiment-analyzer')}
                />
                 <ProjectCard 
                    title="IT Operations Improvement Proposal"
                    description="During my time in Generation Ireland's IT Support bootcamp, I was apart of a group project tasked with improving a companies' IT operations which is currently impacting business efficiency, security, and employee satisfaction. We suggested industry-standard improvements in areas such as security, knowledge bases, appropriate ticketing systems and networking."
                    onLaunch={() => setActiveProject('it-operations-presentation')}
                />
            </div>
            {renderActiveProject()}
        </section>
    );
};