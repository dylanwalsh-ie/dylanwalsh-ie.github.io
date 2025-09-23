/**
 * @file Renders the "Phishing Awareness Simulator" project
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description Educational tool that simulates a phishing attack, allowing users to
 * identify red flags in a fake email and login page
 */
import React, { useState } from 'react';
import { XIcon, AlertTriangleIcon, CheckCircleIcon, MousePointerIcon } from '../icons/ProjectIcons';

// Data for the red flags
const redFlags = [
  { id: 'sender', title: 'Suspicious Sender Address', description: "The sender's email ('security-alert@megacorp-login.net') is not from the official domain ('megacorp.com'). Phishers often use look-alike domains to trick you.", position: { top: '15%', left: '10%' } },
  { id: 'urgency', title: 'Sense of Urgency', description: "The email uses threatening language ('account will be suspended') to create panic and rush you into acting without thinking.", position: { top: '48%', left: '10%' } },
  { id: 'link', title: 'Deceptive Link', description: "Hovering over the link reveals the true destination is a suspicious URL, not the official MegaCorp website. Always check where a link goes before clicking.", position: { top: '65%', left: '45%' } },
  { id: 'grammar', title: 'Spelling & Grammar Mistakes', description: "Phrases like 'your account have unusual activity' are grammatically incorrect. Professional companies usually proofread their emails carefully.", position: { top: '38%', left: '10%' } },
  { id: 'generic', title: 'Generic Greeting', description: "The email uses a vague greeting like 'Dear Valued Customer' instead of your actual name. Legitimate companies usually personalize their communications.", position: { top: '30%', left: '10%' } },
  { id: 'url', title: 'Incorrect URL', description: "The address bar shows 'megacorp-login.net', not the official 'megacorp.com'. The 'Not Secure' warning is also a major red flag.", position: { top: '5.5%', left: '20%' } },
  { id: 'design', title: 'Poor Design', description: "The login page might look slightly 'off'—low-quality logos, misaligned elements, or an outdated design are common in phishing sites.", position: { top: '25%', left: '45%' } },
];

const PhishingSimulator: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // Manages current view of the simulation, email, login or phished
  const [stage, setStage] = useState<'email' | 'login' | 'phished'>('email');
  // Tracks which red flag's description is currently being displed in the side panel
  const [activeFlag, setActiveFlag] = useState<typeof redFlags[0] | null>(null);
  // Array of IDs for the flags the user has discovered
  const [revealedFlags, setRevealedFlags] = useState<string[]>([]);
  // State for the fake login input forms
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleFlagClick = (flagId: string) => {
    const flag = redFlags.find(f => f.id === flagId);
    if (flag) {
      setActiveFlag(flag);
      if (!revealedFlags.includes(flagId)) {
        setRevealedFlags(prev => [...prev, flagId]);
      }
    }
  };

  // Handles form submission on fake login page
  // Move simulation to the final phished stage
  const handlePhishAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setStage('phished');
    setActiveFlag(null);
  };
  
  const title = "// SIMULATOR :: PHISHING_AWARENESS_v1.2";

  // Each of the following functions return the JSX
  // for a specific stage of the simulation
  const renderEmailView = () => (
    <div className="bg-white text-black font-sans p-6 rounded-md shadow-lg w-full max-w-3xl mx-auto my-8 relative">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Unusual Sign-in Activity Detected</h2>
        <p className="text-sm text-gray-600 mb-1"><strong>From:</strong> MegaCorp Security &lt;security-alert@megacorp-login.net&gt;</p>
        <p className="text-sm text-gray-600"><strong>To:</strong> valued.customer@email.com</p>
        <hr className="my-4"/>
        <p className="mb-4">Dear Valued Customer,</p>
        <p className="mb-4">Our system detected that your account have unusual activity from a new location. For your protection, we have temporarily limited access to your account.</p>
        <p className="mb-4">Please verify your identity immediately to restore full access. If you do not verify within 24 hours, your account will be permanently suspended.</p>
        <div className="text-center my-6">
            <a href="#" onClick={(e) => { e.preventDefault(); setStage('login'); }} className="bg-blue-600 text-white font-bold py-3 px-6 rounded hover:bg-blue-700 transition-colors">
                Verify Your Account
            </a>
        </div>
        <p className="text-sm">Thank you,<br/>The MegaCorp Security Team</p>

        {/* Interactive Red Flags for Email */}
        {['sender', 'generic', 'grammar', 'urgency', 'link'].map(id => {
            const flag = redFlags.find(f => f.id === id)!;
            return (
                <div key={id} onClick={() => handleFlagClick(id)} className={`absolute p-2 rounded-full cursor-pointer animate-pulse flex items-center justify-center ${revealedFlags.includes(id) ? 'bg-green-500/80' : 'bg-red-500/80'}`} style={flag.position}>
                   <AlertTriangleIcon className="w-5 h-5 text-white" />
                </div>
            )
        })}
    </div>
  );

  const renderLoginView = () => (
    <div className="w-full max-w-3xl mx-auto my-8 flex flex-col items-center">
        <div className="w-full max-w-md bg-gray-200 p-2 rounded-t-lg flex items-center gap-2">
            <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-gray-400"></div>
                <div className="w-3 h-3 bg-gray-400"></div>
                <div className="w-3 h-3 bg-gray-400"></div>
            </div>
            <div className="flex-grow bg-white text-black text-sm rounded-md px-3 py-1 flex items-center">
                <span className="text-red-500 font-bold mr-2">Not Secure</span>
                <span>|</span>
                <span className="text-gray-700 ml-2">https://megacorp-login.net/auth</span>
            </div>
        </div>
        <div className="bg-white text-black font-sans p-8 rounded-b-lg shadow-lg w-full max-w-md relative">
            <img src="https://images.wz.eu.org/images/2024/08/21/MegaCorp_logo.png" alt="MegaCorp Logo" className="mx-auto mb-6 opacity-90 h-12"/>
            <h2 className="text-xl font-bold text-center mb-6 text-gray-800">Sign in to your account</h2>
            <form onSubmit={handlePhishAttempt}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                    <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                    <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded w-full hover:bg-blue-700 transition-colors">
                    Sign In
                </button>
            </form>
            {/* Interactive Red Flags for Login */}
            {['url', 'design'].map(id => {
                const flag = redFlags.find(f => f.id === id)!;
                return (
                    <div key={id} onClick={() => handleFlagClick(id)} className={`absolute p-2 rounded-full cursor-pointer animate-pulse flex items-center justify-center ${revealedFlags.includes(id) ? 'bg-green-500/80' : 'bg-red-500/80'}`} style={flag.position}>
                        <AlertTriangleIcon className="w-5 h-5 text-white" />
                    </div>
                )
            })}
        </div>
    </div>
  );
  
  const renderPhishedView = () => (
    <div className="bg-red-900/50 border-2 border-red-500 text-white p-8 rounded-lg shadow-lg w-full max-w-3xl mx-auto my-8 text-center animate-fade-in">
        <AlertTriangleIcon className="w-20 h-20 text-red-400 mx-auto mb-4"/>
        <h2 className="text-4xl font-bold mb-4 cyber-glow text-red-300">COMPROMISED!</h2>
        <p className="text-lg mb-2">You entered your credentials on a phishing page.</p>
        <p className="text-gray-300 mb-6">In a real attack, a malicious actor would now have your username: <strong className="text-yellow-300">{username || '(blank)'}</strong> and your password.</p>
        <p className="mb-4">You discovered <strong className="text-blue-300">{revealedFlags.length} out of {redFlags.length}</strong> red flags.</p>
        <button onClick={() => { setStage('email'); setRevealedFlags([]); setUsername(''); setPassword(''); }} className="cyber-button cyber-button-primary">
            Try Again
        </button>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col relative text-white bg-black/30">
        <header className="w-full bg-gray-900/50 backdrop-blur-lg border-b cyber-border p-2 flex items-center justify-between z-10 flex-shrink-0">
            <h2 className="font-mono text-lg text-blue-300 cyber-glow px-2 cyber-glitch-text" data-text={title}>{title}</h2>
            <button onClick={onClose} className="px-3 py-1 rounded-md hover:bg-red-500/50 transition-colors font-sans text-xl leading-none">×</button>
        </header>

        <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
            <main className="flex-grow relative overflow-y-auto bg-grid-pattern flex flex-col items-center p-4">
                {stage === 'email' && renderEmailView()}
                {stage === 'login' && renderLoginView()}
                {stage === 'phished' && renderPhishedView()}
            </main>

            <aside className="w-full lg:w-96 flex-shrink-0 bg-black/30 border-t-2 lg:border-t-0 lg:border-l-2 border-blue-500/30 p-4 overflow-y-auto cyber-scrollbar">
                <div className="cyber-panel p-4 relative h-full">
                    <span className="corner corner-tl"></span><span className="corner corner-tr"></span><span className="corner corner-bl"></span><span className="corner corner-br"></span>
                    <div className="border-b cyber-border -mx-4 px-4 pb-2 mb-4 flex justify-between items-center">
                        <h3 className="font-mono text-md text-blue-300/90 tracking-wider">// THREAT_ANALYSIS</h3>
                        <div className="font-mono text-xs text-blue-400">
                           Flags Found: {revealedFlags.length}/{redFlags.length}
                        </div>
                    </div>
                    
                    {activeFlag ? (
                        <div className="animate-fade-in">
                           <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-green-500/30 rounded-full border border-green-400"><CheckCircleIcon className="w-6 h-6 text-green-300"/></div>
                                <h4 className="text-lg font-bold text-blue-300">{activeFlag.title}</h4>
                           </div>
                           <p className="text-gray-300 text-base leading-relaxed font-mono">{activeFlag.description}</p>
                           <button onClick={() => setActiveFlag(null)} className="mt-4 text-sm text-gray-400 hover:text-white transition-colors">← Back to Instructions</button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-blue-300">Your Mission:</h4>
                            <p className="text-gray-300 font-mono text-base leading-relaxed">You've received a security alert. Is it legitimate? Analyze the content for signs of a phishing attack.</p>
                            <div className="p-3 bg-blue-900/30 border border-blue-500/30 rounded-md">
                                <p className="text-sm text-blue-200">Click on the <strong className="text-red-400">pulsating red icons</strong> <AlertTriangleIcon className="w-4 h-4 inline-block mb-0.5"/> to reveal potential red flags.</p>
                            </div>
                            <p className="text-gray-400 font-mono text-sm leading-relaxed">Once a flag is identified, it will turn <strong className="text-green-400">green</strong>. Find all the flags before proceeding, or enter fake credentials to see what happens.</p>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    </div>
  );
};

export default PhishingSimulator;