import { projects } from '../data/portfolioData.js';

// Converts a project title to a safe DOM ID
function toDomId(title) {
    return `terminal-${title.toLowerCase().replace(/\s+/g, '-')}`;
}

export function renderTerminal(title, scriptDetails) {
    const terminalId = toDomId(title);
    return `
        <div id="${terminalId}" class="terminal-container bg-[#1E1E1E] text-white font-mono rounded-lg h-full flex flex-col overflow-hidden" data-project-title="${title}">
            <div class="bg-gray-700 px-4 py-2 flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span class="text-sm text-gray-300">PowerShell</span>
                <div></div>
            </div>

            <div class="terminal-output p-4 overflow-y-auto flex-grow text-sm" style="scrollbar-width: thin;">
                <pre class="whitespace-pre-wrap text-[#9CDCFE]"><code>${scriptDetails.code}</code></pre>
                <div class="output-content mt-4 border-t border-gray-600 pt-2" style="display: none;"></div>
            </div>

            <div class="bg-gray-700/50 p-2 border-t border-gray-600">
                <button
                    class="run-script-btn w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
                >
                    Run Script
                </button>
            </div>
        </div>
    `;
}

export function attachTerminalListeners(terminalId) {
    const terminalEl = document.getElementById(terminalId);
    if (!terminalEl) return;

    const runBtn = terminalEl.querySelector('.run-script-btn');
    const outputContainer = terminalEl.querySelector('.output-content');
    const terminalOutputScreen = terminalEl.querySelector('.terminal-output');
    const projectTitle = terminalEl.dataset.projectTitle;
    const project = projects.find(p => p.title === projectTitle);
    
    if (!runBtn || !outputContainer || !project || !project.scriptDetails) return;

    let isRunning = false;

    runBtn.addEventListener('click', () => {
        if (isRunning) return;
        isRunning = true;
        
        runBtn.disabled = true;
        runBtn.textContent = 'Executing...';
        outputContainer.innerHTML = '<div class="text-yellow-400">Running script...</div>';
        outputContainer.style.display = 'block';

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
                    isRunning = false;
                    runBtn.disabled = false;
                    runBtn.textContent = 'Run Script';
                }
            }, 300);
        }, 500);
    });
}
