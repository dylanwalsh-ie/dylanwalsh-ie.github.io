import { renderSection } from './Section.js';
import { projects } from '../data/portfolioData.js';
import { renderProjectShowcase, attachTerminalListeners } from './ProjectShowcase.js';

export function renderProjects() {
    const content = `
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">
            My Projects
        </h2>
        <div class="space-y-24">
            ${projects.map((project, index) => renderProjectShowcase(project, index)).join('')}
        </div>
    `;
    return renderSection('projects', content);
}

export function attachProjectListeners() {
    // Only terminals need listeners after render
    attachTerminalListeners();
}
