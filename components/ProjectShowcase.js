import { renderTerminal, attachTerminalListeners as attachSingleTerminalListener } from './Terminal.js';
import { GithubIcon } from './icons/GithubIcon.js';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon.js';

const ProjectRunner = (project) => {
    switch (project.type) {
        case 'web':
            return `
                <div class="w-full h-full bg-gray-100 rounded-lg overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700">
                    <iframe
                        src="${project.liveUrl}"
                        title="${project.title}"
                        class="w-full h-full"
                        loading="lazy"
                    ></iframe>
                </div>
            `;
        case 'script':
            return renderTerminal(project.title, project.scriptDetails);
        case 'meta':
             return `
                 <div class="w-full h-full bg-gray-800 rounded-lg overflow-hidden shadow-inner flex items-center justify-center p-4">
                     <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover rounded-md" />
                 </div>
             `;
        default:
            return '';
    }
};

export function renderProjectShowcase(project, index) {
    const isReversed = index % 2 !== 0;
    const textOrderClass = isReversed ? 'lg:order-2' : 'lg:order-1';
    const runnerOrderClass = isReversed ? 'lg:order-1' : 'lg:order-2';

    return `
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div class="${textOrderClass}">
                <h3 class="text-2xl font-bold text-[#007BFF] dark:text-white mb-2">${project.title}</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">${project.description}</p>
                <div class="flex flex-wrap gap-2 mb-6">
                    ${project.technologies.map(tech => `
                        <span class="bg-gray-200 dark:bg-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                            ${tech}
                        </span>
                    `).join('')}
                </div>
                <div class="flex items-center space-x-4">
                    ${project.codeUrl ? `
                        <a href="${project.codeUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center space-x-2 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors font-semibold">
                            ${GithubIcon("h-5 w-5")}
                            <span>View Code</span>
                        </a>
                    ` : ''}
                    ${project.liveUrl ? `
                        <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center space-x-2 hover:text-[#007BFF] dark:hover:text-[#007BFF] transition-colors font-semibold">
                            ${ExternalLinkIcon("h-5 w-5")}
                            <span>Live Demo</span>
                        </a>
                    ` : ''}
                </div>
            </div>

            <div class="aspect-video rounded-lg shadow-lg bg-white dark:bg-[var(--bg-card-dark)] p-2 ${runnerOrderClass}">
                ${ProjectRunner(project)}
            </div>
        </div>
    `;
};

export function attachTerminalListeners() {
    document.querySelectorAll('.terminal-container').forEach(terminalEl => {
        const terminalId = terminalEl.id;
        attachSingleTerminalListener(terminalId);
    });
}
