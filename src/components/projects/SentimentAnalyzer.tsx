/**
 * @file Renders the "CX De-escalation Simulator" project
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description An interactive, choice-based training simulation where the user navigates
 * a difficult customer conversation, with real-time feedback and data visualization.
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chart, Plugin } from 'chart.js/auto';
import { XIcon, CopyIcon, CheckIcon, AlertTriangleIcon, CheckCircleIcon, TrendingUpIcon, ChevronLeftIcon, ChevronRightIcon, RestartIcon } from '../icons/ProjectIcons';

// --- TYPE DEFINITIONS ---
type Sentiment = 'positive' | 'neutral' | 'negative' | 'escalating';
interface ConversationTurn {
    turn: number;
    speaker: 'Customer' | 'Agent';
    text: string;
    sentiment: Sentiment;
    patience: number;
}
interface Choice {
    text: string;
    targetNode: string;
    feedback: string;
    agentSentiment: Sentiment;
    patienceEffect: number; // e.g., -20, +10
}
interface ScenarioNode {
    speaker: 'Customer';
    text: string;
    altText?: { threshold: number; text: string }; // Alternative text if patience is below a threshold
    sentiment: Sentiment;
    choices: Choice[];
    end?: boolean;
    summary?: string;
}
interface Scenario {
    startNode: string;
    initialPatience: number;
    nodes: Record<string, ScenarioNode>;
}

// Main structure for simulation
// Defines all conversation nodes
const scenario: Scenario = {
    startNode: 'start',
    initialPatience: 70,
    nodes: {
        'start': {
            speaker: 'Customer',
            text: 'Hi, my internet is down again. This is the third time this month!',
            sentiment: 'negative',
            choices: [
                { text: 'Acknowledge their frustration and offer immediate help.', targetNode: 'empathy_path', agentSentiment: 'positive', patienceEffect: 15, feedback: 'Excellent start! Leading with empathy and acknowledging the customer\'s history increases their patience.' },
                { text: 'Ask for their account number right away.', targetNode: 'neutral_path', agentSentiment: 'neutral', patienceEffect: -20, feedback: 'This feels robotic and ignores their frustration, causing their patience to drop significantly.' },
                { text: 'Ask if they have tried turning it off and on again.', targetNode: 'bad_path', agentSentiment: 'negative', patienceEffect: -40, feedback: 'This sounds condescending and implies the user hasn\'t tried the basics, escalating their frustration and tanking their patience.' }
            ]
        },
        'empathy_path': {
            speaker: 'Customer',
            text: 'Okay, thank you. My account number is 12345. I just need this fixed, I have a report due.',
            sentiment: 'negative',
            choices: [
                { text: 'Apologise for the outage and check the network status.', targetNode: 'checking_status', agentSentiment: 'positive', patienceEffect: 20, feedback: 'Perfect. You have the info you need. Taking immediate action reassures the customer and restores more of their patience.' },
                { text: 'Tell them outages happen and you will check.', targetNode: 'bad_path_2', agentSentiment: 'negative', patienceEffect: -30, feedback: 'This response is dismissive. Avoid making excuses for the service; focus on the customer\'s problem instead.' }
            ]
        },
        'neutral_path': {
            speaker: 'Customer',
            text: 'It\'s 12345. Are you even listening? I said this is the third time!',
            altText: { threshold: 40, text: 'The number is 12345. Unbelievable. Just fix it.' },
            sentiment: 'escalating',
            choices: [
                { text: 'Apologise sincerely and refocus on their problem.', targetNode: 'empathy_path', agentSentiment: 'positive', patienceEffect: 25, feedback: 'Good recovery. A sincere apology can pull the conversation back from the brink and regain a significant amount of patience.' },
                { text: 'State that you need to follow procedure.', targetNode: 'bad_path', agentSentiment: 'negative', patienceEffect: -35, feedback: 'Citing "procedure" when a customer is angry often makes them feel like you care more about rules than their problem. This will likely cause further escalation.' }
            ]
        },
        'bad_path': {
            speaker: 'Customer',
            text: 'Of course I\'ve tried that! Do you think I\'m an idiot?! Get me your manager, now!',
            sentiment: 'escalating',
            choices: [],
            end: true,
            summary: 'The customer escalated to a manager request after feeling dismissed. The initial line of questioning was perceived as condescending and destroyed their patience.'
        },
        'bad_path_2': {
            speaker: 'Customer',
            text: 'I don\'t care if "outages happen". I pay for a service that works! This is ridiculous.',
            sentiment: 'escalating',
            choices: [],
            end: true,
            summary: 'The interaction failed because the agent\'s response was dismissive rather than empathetic, making the customer feel their issue was not being taken seriously.'
        },
        'checking_status': {
            speaker: 'Customer',
            text: 'Okay, please be quick. I appreciate you looking into it. What did you find?',
            sentiment: 'neutral',
            choices: [
                { text: 'Explain there\'s a local network outage and provide an estimated fix time.', targetNode: 'technical_branch_start', agentSentiment: 'positive', patienceEffect: 10, feedback: 'Good. You\'ve identified the problem and are setting clear expectations. This transparency helps maintain patience.' },
                { text: 'Inform them the network is fine, but their account was suspended for a billing issue.', targetNode: 'billing_branch_start', agentSentiment: 'neutral', patienceEffect: -15, feedback: 'This is sensitive information. While true, it puts the blame back on the customer and can cause frustration. Let\'s see how you handle it.' },
            ]
        },
        'technical_branch_start': {
            speaker: 'Customer',
            text: 'An outage? I see. Can you tell me what\'s going on? Will I be able to submit my report on time?',
            sentiment: 'negative',
            choices: [
                { text: 'Explain simply: "There\'s a problem with a piece of equipment in your area affecting a few homes. Our team is on it and we expect service back in 45 minutes."', targetNode: 'technical_success', agentSentiment: 'positive', patienceEffect: 20, feedback: 'Excellent! A clear, simple explanation with a specific timeframe is reassuring and professional.' },
                { text: 'Explain with jargon: "We\'ve identified a PTP link failure at the local node, causing packet loss and intermittent sync. We\'ve escalated to Tier 2 to re-provision the DSLAM."', targetNode: 'technical_jargon_fail', agentSentiment: 'negative', patienceEffect: -30, feedback: 'This technical jargon is confusing and unhelpful to the customer. It sounds like you\'re reading from a script and not communicating effectively.' },
            ]
        },
        'technical_success': {
            speaker: 'Customer',
            text: 'Okay, 45 minutes. That\'s not too bad. Thank you for the clear update. I\'ll wait.',
            sentiment: 'positive',
            choices: [],
            end: true,
            summary: 'Success! You handled a technical issue perfectly by providing a clear, jargon-free explanation and setting a realistic expectation for resolution. The customer ended the call feeling informed and understood.'
        },
        'technical_jargon_fail': {
            speaker: 'Customer',
            text: 'What does any of that even mean? Just tell me when it will be fixed! This is useless.',
            sentiment: 'escalating',
            choices: [],
            end: true,
            summary: 'The interaction failed because the agent used confusing technical jargon instead of a simple explanation. This frustrated the customer and made them feel unheard.'
        },
        'billing_branch_start': {
            speaker: 'Customer',
            text: 'A billing issue? I paid my bill last week! Are you telling me you cut off my service by mistake?',
            altText: { threshold: 40, text: 'You cut my service for a billing problem YOU created? This is unbelievable. Fix it.' },
            sentiment: 'escalating',
            choices: [
                { text: 'Apologize for the error, immediately restore service, and offer to credit their account for the trouble.', targetNode: 'billing_success', agentSentiment: 'positive', patienceEffect: 40, feedback: 'Outstanding recovery! Taking full ownership, providing an immediate solution, and offering compensation turns a major error into a positive customer experience.' },
                { text: 'Tell them you can\'t handle billing and they need to call the billing department.', targetNode: 'billing_transfer_fail', agentSentiment: 'negative', patienceEffect: -50, feedback: 'This is a critical error. Transferring a frustrated customer makes them repeat their story and feels like you are passing the buck. Their patience will be exhausted.' },
            ]
        },
        'billing_success': {
            speaker: 'Customer',
            text: 'Wow, okay. Thank you for fixing that so quickly and for the credit. I really appreciate you taking care of it.',
            sentiment: 'positive',
            choices: [],
            end: true,
            summary: 'Excellent work! You turned a company error into a loyalty-building moment. By taking ownership and providing a swift, comprehensive solution, you exceeded the customer\'s expectations.'
        },
        'billing_transfer_fail': {
            speaker: 'Customer',
            text: 'Call ANOTHER number? After all this? No. I want this fixed NOW. Get me your supervisor.',
            sentiment: 'escalating',
            choices: [],
            end: true,
            summary: 'The interaction failed because the agent deflected responsibility. A customer should never be punished for an internal company issue by being forced to make another call.'
        },
        'patience_timeout': {
            speaker: 'Customer',
            text: 'You know what? Forget it. I\'m done. I\'ll be switching providers tomorrow.',
            sentiment: 'escalating',
            choices: [],
            end: true,
            summary: 'The customer\'s patience ran out completely. The conversation failed due to a series of unhelpful or slow responses that made the customer feel their time was being wasted.'
        }
    }
};

const title = "// SIMULATOR :: CX_DE-ESCALATION_v2.0";

// --- MAIN COMPONENT ---
const SentimentAnalyzer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    // Track user's current position in the scenario tree
    const [currentNodeId, setCurrentNodeId] = useState<string>(scenario.startNode);
    // Stores history of conversation turns
    const [conversationHistory, setConversationHistory] = useState<ConversationTurn[]>([]);
    // Numerical value representing customer's willingness to continue with conversation
    const [customerPatience, setCustomerPatience] = useState<number>(scenario.initialPatience);
    // Feedback tip display to user after they make a choice
    const [lastFeedback, setLastFeedback] = useState<string | null>('Your mission is to de-escalate the customer\'s frustration. Choose the best response at each step.');
    // Indicates if scenario has reached end state
    const [isScenarioFinished, setIsScenarioFinished] = useState<boolean>(false);
    const [hoveredTurn, setHoveredTurn] = useState<number | null>(null);

    const timelineChartRef = useRef<HTMLCanvasElement>(null);
    const timelineChartInstanceRef = useRef<Chart | null>(null);

    const currentNode = scenario.nodes[currentNodeId];

    const handleChoice = (choice: Choice) => {
        const newPatience = Math.max(0, Math.min(100, customerPatience + choice.patienceEffect));
        
        const customerText = (currentNode.altText && customerPatience < currentNode.altText.threshold) ? currentNode.altText.text : currentNode.text;
        
        const customerTurn: ConversationTurn = {
            turn: conversationHistory.length + 1,
            speaker: 'Customer',
            text: customerText,
            sentiment: currentNode.sentiment,
            patience: customerPatience,
        };
        const agentTurn: ConversationTurn = {
            turn: conversationHistory.length + 2,
            speaker: 'Agent',
            text: choice.text,
            sentiment: choice.agentSentiment,
            patience: newPatience,
        };

        setConversationHistory(prev => [...prev, customerTurn, agentTurn]);
        setLastFeedback(choice.feedback);
        setCustomerPatience(newPatience);

        if (newPatience <= 0) {
            setCurrentNodeId('patience_timeout');
            setIsScenarioFinished(true);
        } else if (scenario.nodes[choice.targetNode]?.end) {
            setCurrentNodeId(choice.targetNode);
            setIsScenarioFinished(true);
        } else {
            setCurrentNodeId(choice.targetNode);
        }
    };

    const handleReset = () => {
        setCurrentNodeId(scenario.startNode);
        setConversationHistory([]);
        setCustomerPatience(scenario.initialPatience);
        setLastFeedback('Your mission is to de-escalate the customer\'s frustration. Choose the best response at each step.');
        setIsScenarioFinished(false);
        if (timelineChartInstanceRef.current) {
            timelineChartInstanceRef.current.destroy();
        }
    };
    
    useEffect(() => {
        // Automatically add the first customer turn to the history
        if(conversationHistory.length === 0) {
            const firstTurn: ConversationTurn = {
                turn: 1,
                speaker: 'Customer',
                text: scenario.nodes[scenario.startNode].text,
                sentiment: scenario.nodes[scenario.startNode].sentiment,
                patience: scenario.initialPatience,
            };
            setConversationHistory([firstTurn]);
        }
    }, [conversationHistory.length]);

    const renderTimelineChart = useCallback(() => {
        if (timelineChartInstanceRef.current) {
            timelineChartInstanceRef.current.destroy();
        }
        if (!timelineChartRef.current || conversationHistory.length === 0) return;

        const ctx = timelineChartRef.current.getContext('2d');
        if (!ctx) return;

        const sentimentToValue = (s: Sentiment) => ({ 'positive': 1, 'neutral': 0, 'negative': -1, 'escalating': -2 }[s]);
        const sentimentToColor = (s: Sentiment) => ({ 'positive': 'rgba(74, 222, 128, 1)', 'neutral': 'rgba(156, 163, 175, 1)', 'negative': 'rgba(251, 146, 60, 1)', 'escalating': 'rgba(248, 113, 113, 1)' }[s]);
        
        let chartData = [...conversationHistory];
        if (!isScenarioFinished) {
            chartData.push({ 
                turn: conversationHistory.length + 1, 
                speaker: 'Customer',
                sentiment: currentNode.sentiment, 
                patience: customerPatience,
                text: currentNode.text
            });
        }
        
        timelineChartInstanceRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.map(t => `${t.speaker.charAt(0)}: ${t.turn}`),
                datasets: [
                {
                    label: 'Sentiment',
                    data: chartData.map(t => sentimentToValue(t.sentiment)),
                    pointBackgroundColor: chartData.map(t => sentimentToColor(t.sentiment)),
                    borderColor: 'rgba(96, 165, 250, 0.8)',
                    pointRadius: 6,
                    pointHoverRadius: 9,
                    tension: 0.1,
                    yAxisID: 'ySentiment',
                },
                {
                    label: 'Patience',
                    data: chartData.map(t => t.patience),
                    borderColor: 'rgba(250, 204, 21, 0.6)',
                    backgroundColor: 'rgba(250, 204, 21, 0.1)',
                    borderDash: [5, 5],
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    fill: false,
                    tension: 0.1,
                    yAxisID: 'yPatience',
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                onHover: (event, chartElement) => {
                    if (chartElement.length > 0) {
                        setHoveredTurn(chartElement[0].index + 1);
                    } else {
                        setHoveredTurn(null);
                    }
                },
                scales: {
                    ySentiment: {
                        type: 'linear', position: 'left',
                        min: -2.5, max: 1.5,
                        ticks: {
                            color: '#9ca3af',
                            callback: (value) => ({ 1: 'Positive', 0: 'Neutral', '-1': 'Negative', '-2': 'Escalating' }[value as number] || '')
                        }, grid: { color: 'rgba(59, 130, 246, 0.1)' }
                    },
                    yPatience: {
                        type: 'linear', position: 'right',
                        min: 0, max: 100,
                        ticks: { color: 'rgba(250, 204, 21, 0.8)', callback: (value) => `${value}%` },
                        grid: { drawOnChartArea: false }
                    },
                    x: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(59, 130, 246, 0.1)' } }
                },
                plugins: {
                    legend: { labels: { color: '#c9d1d9' } },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(13, 17, 23, 0.9)',
                        titleFont: { family: "'Share Tech Mono', monospace", size: 14 },
                        bodyFont: { family: "'Inter', sans-serif", size: 12 },
                        titleColor: '#60a5fa',
                        bodyColor: '#c9d1d9',
                        borderColor: 'rgba(96, 165, 250, 0.5)',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: false,
                        callbacks: {
                            title: (context) => context[0].label,
                            label: (context) => {
                                const datasetLabel = context.dataset.label || '';
                                let value = context.parsed.y;
                                if (datasetLabel === 'Sentiment') {
                                    const sentimentText = { 1: 'Positive', 0: 'Neutral', '-1': 'Negative', '-2': 'Escalating' }[value as number] || 'Unknown';
                                    return `Sentiment: ${sentimentText}`;
                                }
                                if (datasetLabel === 'Patience') {
                                    return `Patience: ${value}%`;
                                }
                                return `${datasetLabel}: ${value}`;
                            },
                            afterBody: (context) => {
                                const dataIndex = context[0].dataIndex;
                                const turnData = chartData[dataIndex];
                                if (turnData && turnData.text) {
                                    let text = turnData.text;
                                    if (text.length > 50) {
                                        text = text.substring(0, 50) + '...';
                                    }
                                    return `\n"${text}"`;
                                }
                                return '';
                            }
                        }
                    }
                }
            }
        });
    }, [conversationHistory, currentNode, isScenarioFinished, customerPatience]);

    // Re-render chart whenever it's data changes
    useEffect(() => {
        renderTimelineChart();
    }, [renderTimelineChart]);

    const getPatienceColor = (p: number) => {
        if (p > 60) return 'text-green-400';
        if (p > 30) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getSentimentText = () => {
        const lastTurnSentiment = conversationHistory.length > 0 ? conversationHistory[conversationHistory.length - 1].sentiment : scenario.nodes[scenario.startNode].sentiment;
        return lastTurnSentiment.charAt(0).toUpperCase() + lastTurnSentiment.slice(1);
    };

    return (
        <div className="h-full w-full flex flex-col relative text-white bg-black/30 font-sans">
            <header className="w-full bg-gray-900/50 backdrop-blur-lg border-b cyber-border p-2 flex items-center justify-between z-10 flex-shrink-0">
                <h2 className="font-mono text-lg text-blue-300 cyber-glow px-2 cyber-glitch-text" data-text={title}>{title}</h2>
                <div className="flex items-center">
                    <button onClick={handleReset} title="Restart Simulation" className="p-2 rounded-md hover:bg-blue-500/30 transition-colors mr-2">
                        <RestartIcon className="w-5 h-5"/>
                    </button>
                    <button onClick={onClose} className="px-3 py-1 rounded-md hover:bg-red-500/50 transition-colors font-sans text-xl leading-none">×</button>
                </div>
            </header>
            
            <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
                <aside className="w-full lg:w-2/5 xl:w-1/3 flex-shrink-0 bg-black/30 border-b lg:border-b-0 lg:border-r-2 border-blue-500/30 p-4 flex flex-col">
                    <div className="cyber-card p-4 relative flex flex-col scanline-overlay h-full">
                        <div className="border-b border-blue-900/50 -mx-4 px-4 pb-2 mb-4 flex-shrink-0">
                            <h3 className="font-mono text-md text-blue-300/90 tracking-wider">// LIVE_TRANSCRIPT</h3>
                        </div>
                        <div className="flex-grow overflow-y-auto cyber-scrollbar pr-2">
                            {conversationHistory.map((turn, index) => (
                                <div key={index} className={`p-2 my-1.5 rounded-md text-sm transition-all duration-200 ${hoveredTurn === turn.turn ? 'bg-blue-900/50' : ''} ${turn.speaker === 'Agent' ? 'bg-gray-800/30 ml-4' : 'bg-blue-900/20'}`}>
                                    <p className={`font-bold ${turn.speaker === 'Agent' ? 'text-gray-300' : 'text-blue-300'}`}>{turn.speaker}:</p>
                                    <p className="text-gray-200 whitespace-pre-wrap">{turn.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="flex-grow relative overflow-hidden flex flex-col p-4 gap-4 bg-grid-pattern">
                    <div className="flex-grow-[2] flex flex-col overflow-hidden min-h-0">
                         <h3 className="font-mono text-md text-blue-300/90 tracking-wider mb-2 flex-shrink-0">// SENTIMENT_TIMELINE</h3>
                         <div className="flex-grow cyber-panel p-2 relative scanline-overlay flex flex-col">
                            <div className="flex-grow relative">
                                <canvas ref={timelineChartRef}></canvas>
                            </div>
                         </div>
                    </div>
                    <div className="flex-grow-[1] flex flex-col">
                        <h3 className="font-mono text-md text-blue-300/90 tracking-wider mb-2 flex-shrink-0">// AGENT_ACTIONS</h3>
                        <div className="flex-grow cyber-panel p-4 relative scanline-overlay overflow-y-auto cyber-scrollbar">
                            {isScenarioFinished ? (
                                <div className="text-center flex flex-col items-center justify-center h-full animate-fade-in">
                                    {currentNode.sentiment === 'escalating' || currentNode.sentiment === 'negative' ? (
                                        <AlertTriangleIcon className="w-16 h-16 text-red-400 mb-4"/>
                                    ) : (
                                        <CheckCircleIcon className="w-16 h-16 text-green-400 mb-4"/>
                                    )}
                                    <h4 className="font-mono text-xl text-blue-300 tracking-wider mb-2">SCENARIO_COMPLETE</h4>
                                    <p className="text-gray-300 mb-4">{currentNode.summary}</p>
                                    <button onClick={handleReset} className="cyber-button cyber-button-primary text-sm">Run Simulation Again</button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-4">
                                        <h4 className="font-mono text-sm uppercase text-blue-400/90 tracking-widest mb-2">[ Customer Says ]</h4>
                                        <p className="bg-black/30 p-3 rounded-md leading-relaxed text-gray-200 italic">"{(currentNode.altText && customerPatience < currentNode.altText.threshold) ? currentNode.altText.text : currentNode.text}"</p>
                                    </div>
                                    <div>
                                        <h4 className="font-mono text-sm uppercase text-blue-400/90 tracking-widest mb-2">[ Choose Your Reply ]</h4>
                                        <div className="space-y-2">
                                            {currentNode.choices.map((choice, index) => (
                                                <button key={index} onClick={() => handleChoice(choice)} className="w-full text-left p-3 bg-gray-800/50 border border-transparent hover:border-blue-500 hover:bg-blue-900/30 rounded-md transition-all duration-200">
                                                    {choice.text}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </main>

                <aside className="w-full lg:w-96 flex-shrink-0 bg-black/30 border-t lg:border-t-0 lg:border-l-2 border-blue-500/30 p-4 overflow-y-auto cyber-scrollbar">
                    <div className="cyber-panel p-4 relative h-full flex flex-col gap-4">
                        <div>
                            <div className="border-b border-blue-900/50 -mx-4 px-4 pb-2 mb-4">
                                <h3 className="font-mono text-md text-blue-300/90 tracking-wider">// REAL-TIME_COACHING</h3>
                            </div>
                            {lastFeedback && (
                                <div className="animate-fade-in">
                                   <div className={`p-3 rounded-md text-sm flex items-start gap-3 ${lastFeedback.toLowerCase().includes('excellent') || lastFeedback.toLowerCase().includes('perfect') || lastFeedback.toLowerCase().includes('outstanding') ? 'bg-green-900/40' : lastFeedback.toLowerCase().includes('avoid') || lastFeedback.toLowerCase().includes('ignores') || lastFeedback.toLowerCase().includes('error') ? 'bg-red-900/40' : 'bg-yellow-900/40'}`}>
                                        <div>
                                        {lastFeedback.toLowerCase().includes('excellent') || lastFeedback.toLowerCase().includes('perfect') || lastFeedback.toLowerCase().includes('outstanding') ? (
                                            <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5"/>
                                        ) : (
                                            <AlertTriangleIcon className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5"/>
                                        )}
                                        </div>
                                       <p className="text-gray-200 leading-relaxed">{lastFeedback}</p>
                                   </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-auto">
                            <div className="border-b border-blue-900/50 -mx-4 px-4 pb-2 mb-4">
                                <h3 className="font-mono text-md text-blue-300/90 tracking-wider">// LIVE_METRICS</h3>
                            </div>
                            <div className="space-y-3 font-mono text-lg p-2">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-gray-400">Sentiment:</span>
                                    <span className={`font-bold ${{'Positive': 'text-green-400', 'Neutral': 'text-gray-300', 'Negative': 'text-orange-400', 'Escalating': 'text-red-400'}[getSentimentText()]}`}>{getSentimentText()}</span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-gray-400">Patience:</span>
                                    <span className={`font-bold ${getPatienceColor(customerPatience)}`}>{customerPatience}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                                    <div className={`h-2.5 rounded-full transition-all duration-300 ${customerPatience > 60 ? 'bg-green-500' : customerPatience > 30 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${customerPatience}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default SentimentAnalyzer;