import React from 'react';

interface TerminalProps {
    scriptDetails: {
        code: string;
        output: string[];
    };
}

export const Terminal: React.FC<TerminalProps> = ({ scriptDetails }) => {
    const [isRunning, setIsRunning] = React.useState(false);
    const [displayedOutput, setDisplayedOutput] = React.useState<string[]>([]);
    const outputEndRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        let timeoutId: number;
        let intervalId: number;

        if (isRunning) {
            setDisplayedOutput([]);
            timeoutId = window.setTimeout(() => {
                let i = 0;
                intervalId = window.setInterval(() => {
                    if (i < scriptDetails.output.length) {
                        setDisplayedOutput(prev => [...prev, scriptDetails.output[i]]);
                        i++;
                    } else {
                        clearInterval(intervalId);
                        setIsRunning(false);
                    }
                }, 300);
            }, 500);
        }

        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, [isRunning, scriptDetails.output]);

    React.useEffect(() => {
        outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [displayedOutput]);
    
    const handleRunScript = () => {
        if (!isRunning) {
            setIsRunning(true);
        }
    };

    return (
        <div className="bg-[#1E1E1E] text-white font-mono rounded-lg h-full flex flex-col overflow-hidden">
            <div className="bg-gray-700 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-300">PowerShell</span>
                <div></div>
            </div>

            <div className="p-4 overflow-y-auto flex-grow text-sm" style={{ scrollbarWidth: 'thin' }}>
                <pre className="whitespace-pre-wrap text-[#9CDCFE]">
                    <code dangerouslySetInnerHTML={{ __html: scriptDetails.code.trim() }} />
                </pre>
                
                {displayedOutput.length > 0 && (
                    <div className="mt-4 border-t border-gray-600 pt-2">
                        {displayedOutput.map((line, index) => (
                             <p key={index} className="text-gray-300">
                                <span className="text-green-400 mr-2">&gt;</span>{line}
                            </p>
                        ))}
                         <div ref={outputEndRef} />
                    </div>
                )}

                 {isRunning && displayedOutput.length === 0 && (
                    <div className="mt-4 text-yellow-400">Running script...</div>
                 )}
            </div>

            <div className="bg-gray-700/50 p-2 border-t border-gray-600">
                <button
                    onClick={handleRunScript}
                    disabled={isRunning}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
                >
                    {isRunning ? 'Executing...' : 'Run Script'}
                </button>
            </div>
        </div>
    );
};