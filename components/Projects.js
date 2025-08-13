import { renderSection } from './Section.js';
import { projects } from '../data/portfolioData.js';
import { renderProjectShowcase } from './ProjectShowcase.js';

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

let runningTerminals = new Set();

function runTerminalScript(terminalEl) {
    const terminalId = terminalEl.id;
    if (runningTerminals.has(terminalId)) return;

    runningTerminals.add(terminalId);

    const runBtn = terminalEl.querySelector('.run-script-btn');
    const outputContainer = terminalEl.querySelector('.output-content');
    const terminalOutputScreen = terminalEl.querySelector('.terminal-output');
    const projectTitle = terminalEl.dataset.projectTitle;
    const project = projects.find(p => p.title === projectTitle);
    
    if (!runBtn || !outputContainer || !project || !project.scriptDetails) {
        runningTerminals.delete(terminalId);
        return;
    }

    runBtn.disabled = true;
    runBtn.textContent = 'Executing...';
    outputContainer.innerHTML = '<div class="text-yellow-400">Running script...</div>';
    outputContainer.style.display = 'block';
    terminalOutputScreen.scrollTop = terminalOutputScreen.scrollHeight;

    const outputLines = project.scriptDetails.output;
    let i = 0;
    
    setTimeout(() => {
        outputContainer.innerHTML = ''; // Clear "Running script..."
        const intervalId = setInterval(() => {
            if (i < outputLines.length) {
                const p = document.createElement('p');
                p.className = 'text-gray-300';
                p.innerHTML = `<span class="text-green-400 mr-2">&gt;</span>${outputLines[i]}`;
                outputContainer.appendChild(p);
                terminalOutputScreen.scrollTop = terminalOutputScreen.scrollHeight;
                i++;
            } else {
                clearInterval(intervalId);
                runningTerminals.delete(terminalId);
                runBtn.disabled = false;
                runBtn.textContent = 'Run Script';
            }
        }, 300);
    }, 500);
}

export function attachProjectListeners() {
    const projectsSection = document.getElementById('projects');
    projectsSection?.addEventListener('click', (e) => {
        const runBtn = e.target.closest('.run-script-btn');
        if (runBtn) {
            const terminalEl = runBtn.closest('.terminal-container');
            if (terminalEl) {
                runTerminalScript(terminalEl);
            }
        }
    });
}