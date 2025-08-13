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