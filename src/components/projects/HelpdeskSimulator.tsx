/**
 * @file Renders the "Helpdesk Ticket Simulator" project
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description This component simulates a two-panel helpdesk interface where a user
 * can submit tickets and an agent can view a ticket queue and a knowledge base
 */
import React, { useState, useMemo } from 'react';
import { 
    XIcon, TicketIcon, BookOpenIcon, PcIcon, ServerIcon, GlobeIcon, 
    CogIcon, CheckCircleIcon, PlusCircleIcon, TerminalIcon 
} from '../icons/ProjectIcons';

// Type definitions
type TicketStatus = 'New' | 'In Progress' | 'Resolved' | 'Closed';
type TicketCategory = 'Hardware' | 'Software' | 'Networking' | 'Account';
type TicketUrgency = 'Low' | 'Medium' | 'High' | 'Critical';

interface Ticket {
  id: number;
  user: string;
  title: string;
  description: string;
  category: TicketCategory;
  urgency: TicketUrgency;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface KnowledgeArticle {
  id: string;
  title: string;
  keywords: string[];
  url: string;
}

// Initial Data
const initialTickets: Ticket[] = [
    {
        id: 1693893321,
        user: 'User_7721',
        title: 'Cannot connect to corporate VPN',
        description: 'My VPN client keeps saying "Connection Timed Out" when I try to connect from home. I was able to connect yesterday. I have restarted my computer and my router.',
        category: 'Networking',
        urgency: 'High',
        status: 'New',
        createdAt: new Date(Date.now() - 3600000 * 2),
        updatedAt: new Date(Date.now() - 3600000 * 2),
    },
    {
        id: 1693891487,
        user: 'User_3498',
        title: 'Monitor is flickering',
        description: 'The second monitor on my desk setup has started to flicker intermittently. It goes black for a second and then comes back on. I have checked the cable connections and they seem secure.',
        category: 'Hardware',
        urgency: 'Medium',
        status: 'In Progress',
        createdAt: new Date(Date.now() - 3600000 * 5),
        updatedAt: new Date(Date.now() - 3600000 * 1),
    }
];

// NOTE: For the purposes of this portfolio project two 
// of my own published knowledge articles will be used
const knowledgeBase: KnowledgeArticle[] = [
    {
      id: 'kb-shutdown',
      title: 'Troubleshooting Frequent System Shutdowns',
      keywords: ['shutdown', 'overheating', 'power', 'crash', 'reboot', 'bsod'],
      url: 'https://drive.google.com/file/d/1hBPJNwzqwJ8e0k7nTXaq4S5t9Yy6HsBB/preview'
    },
    {
      id: 'kb-network',
      title: 'Diagnosing Inaccessible Network Issues',
      keywords: ['network', 'internet', 'connection', 'vpn', 'wifi', 'ethernet', 'dns'],
      url: 'https://drive.google.com/file/d/1bHWe4pCBbwtXs9_0XFBEasg3wQsq7z36/preview'
    }
];

// Helper Components & Mappings
const UrgencyIndicator: React.FC<{ urgency: TicketUrgency }> = ({ urgency }) => {
    const color = {
        Low: 'bg-green-500', Medium: 'bg-yellow-500', High: 'bg-orange-500', Critical: 'bg-red-500'
    }[urgency];
    return <span className={`w-3 h-3 rounded-full ${color} border-2 border-gray-900`} title={urgency}></span>;
};

// To provide a tooltip, the icon is wrapped in a `span` with a `title` attribute.
const CategoryIcon: React.FC<{ category: TicketCategory, className?: string }> = ({ category, className = "w-5 h-5" }) => {
    const Icon = {
        Hardware: PcIcon, Software: CogIcon, Networking: GlobeIcon, Account: TerminalIcon
    }[category];
    return (
        <span title={category}>
            <Icon className={className} />
        </span>
    );
};

// Config object to map trick status to specific icons and colours
const statusConfig: { [key in TicketStatus]: { icon: React.FC<any>, color: string } } = {
    New: { icon: PlusCircleIcon, color: 'text-blue-400'},
    'In Progress': { icon: CogIcon, color: 'text-yellow-400' },
    Resolved: { icon: CheckCircleIcon, color: 'text-green-400' },
    Closed: { icon: XIcon, color: 'text-gray-500' }
};

// Main helpdesk simulator object
const HelpdeskSimulator: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    // State management
    // Manages list of all tickets within the simulation
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
    // Tracks which ticket is selected for viewing in the details panel
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(tickets[0] || null);
    // Toggles agent view between ticket queue and knowledge base
    const [agentTab, setAgentTab] = useState<'tickets' | 'kb'>('tickets');
    
    // Form State
    const [formState, setFormState] = useState({ title: '', description: '', category: 'Software' as TicketCategory, urgency: 'Medium' as TicketUrgency });
    const [formFeedback, setFormFeedback] = useState('');

    // Knowledge base state for search and selection
    const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
    const [kbSearch, setKbSearch] = useState('');
    
    // Filters knowledge base articles on search input
    const filteredKb = useMemo(() => {
        if (!kbSearch) return knowledgeBase;
        return knowledgeBase.filter(article => 
            article.title.toLowerCase().includes(kbSearch.toLowerCase()) || 
            article.keywords.some(k => k.includes(kbSearch.toLowerCase()))
        );
    }, [kbSearch]);

    // Event Handlers
    // Handles change in user submission form fields
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Handles new ticket submission from user portal
    const handleTicketSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formState.title || !formState.description) {
            setFormFeedback('// ERROR: Title and Description are required.');
            setTimeout(() => setFormFeedback(''), 3000);
            return;
        }

        // Updates new ticket status when an agent action is taken
        const newTicket: Ticket = {
            id: Date.now(),
            user: 'Sim_User_404',
            ...formState,
            status: 'New',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        setTickets(prev => [newTicket, ...prev]);
        setFormState({ title: '', description: '', category: 'Software', urgency: 'Medium' });
        setFormFeedback('// SUCCESS: Ticket logged with ID #' + newTicket.id);
        setTimeout(() => setFormFeedback(''), 4000);
    };

    const updateTicketStatus = (ticketId: number, newStatus: TicketStatus) => {
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus, updatedAt: new Date() } : t));
        setSelectedTicket(prev => prev && prev.id === ticketId ? { ...prev, status: newStatus, updatedAt: new Date() } : prev);
    };
    
    const title = "// HELPDESK_SIMULATOR :: INCIDENT_CORE_v1.0";
    
    return (
        <div className="h-full w-full flex flex-col relative text-white bg-black/30 font-sans">
            <header className="w-full bg-gray-900/50 backdrop-blur-lg border-b cyber-border p-2 flex items-center justify-between z-30 flex-shrink-0">
                <h2 className="font-mono text-lg text-blue-300 cyber-glow px-2 cyber-glitch-text" data-text={title}>{title}</h2>
                <button onClick={onClose} className="px-3 py-1 rounded-md hover:bg-red-500/50 transition-colors font-sans text-xl leading-none">×</button>
            </header>
            
            <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
                {/* User Submission Panel */}
                <aside className="w-full md:w-2/5 xl:w-1/3 bg-black/30 border-b md:border-b-0 md:border-r-2 border-blue-500/30 p-4 overflow-y-auto flex-shrink-0 cyber-scrollbar">
                    <div className="cyber-panel p-4 relative h-full flex flex-col scanline-overlay">
                        <span className="corner corner-tl"></span><span className="corner corner-tr"></span><span className="corner corner-bl"></span><span className="corner corner-br"></span>
                        <div className="border-b cyber-border -mx-4 px-4 pb-2 mb-4">
                            <h3 className="font-mono text-md text-blue-300/90 tracking-wider">// USER_PORTAL :: LOG_INCIDENT</h3>
                        </div>
                        <form onSubmit={handleTicketSubmit} className="flex flex-col flex-grow gap-4 text-sm">
                            <div>
                                <label className="block text-gray-400 text-xs mb-1 font-semibold">USER</label>
                                <input type="text" value="Sim_User_404" disabled className="cyber-input w-full bg-black/60 cursor-not-allowed"/>
                            </div>
                            <div>
                                <label htmlFor="title" className="block text-gray-400 text-xs mb-1 font-semibold">ISSUE_TITLE</label>
                                <input type="text" id="title" name="title" value={formState.title} onChange={handleFormChange} className="cyber-input w-full"/>
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-gray-400 text-xs mb-1 font-semibold">DESCRIPTION</label>
                                <textarea id="description" name="description" value={formState.description} onChange={handleFormChange} className="cyber-textarea w-full" rows={6}></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="category" className="block text-gray-400 text-xs mb-1 font-semibold">CATEGORY</label>
                                    <select id="category" name="category" value={formState.category} onChange={handleFormChange} className="cyber-select w-full">
                                        <option>Hardware</option><option>Software</option><option>Networking</option><option>Account</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="urgency" className="block text-gray-400 text-xs mb-1 font-semibold">URGENCY</label>
                                    <select id="urgency" name="urgency" value={formState.urgency} onChange={handleFormChange} className="cyber-select w-full">
                                        <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-auto pt-4 border-t border-blue-900/50">
                                <button type="submit" className="cyber-button cyber-button-primary w-full text-sm">Submit Ticket</button>
                                {formFeedback && <p className={`mt-2 text-xs font-mono text-center animate-fade-in ${formFeedback.startsWith('// ERROR') ? 'text-red-400' : 'text-green-400'}`}>{formFeedback}</p>}
                            </div>
                            <p className="text-xs text-gray-500 font-mono mt-2 text-center">[NOTE: No real PII is stored. This is a front-end simulation.]</p>
                        </form>
                    </div>
                </aside>

                {/* Agent Panel */}
                <main className="flex-grow relative overflow-hidden flex flex-col p-4 gap-4 bg-grid-pattern">
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => setAgentTab('tickets')} className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors border-b-2 ${agentTab === 'tickets' ? 'border-blue-400 text-blue-300' : 'border-transparent text-gray-400 hover:text-white'}`}>
                            <TicketIcon className="w-5 h-5"/> TICKET_QUEUE [{tickets.filter(t => t.status !== 'Closed').length}]
                        </button>
                        <button onClick={() => setAgentTab('kb')} className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors border-b-2 ${agentTab === 'kb' ? 'border-blue-400 text-blue-300' : 'border-transparent text-gray-400 hover:text-white'}`}>
                            <BookOpenIcon className="w-5 h-5"/> KNOWLEDGE_BASE
                        </button>
                    </div>

                    {agentTab === 'tickets' && (
                        <div className="flex-grow flex gap-4 overflow-hidden">
                            <div className="w-1/3 flex-shrink-0 flex flex-col">
                                <h3 className="font-mono text-md text-blue-300/90 tracking-wider mb-2 flex-shrink-0">// OPEN_TICKETS</h3>
                                <div className="flex-grow cyber-panel p-2 overflow-y-auto cyber-scrollbar">
                                    {tickets.map(ticket => (
                                        <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} className={`p-2 mb-1 cursor-pointer transition-colors duration-200 border-l-4 ${selectedTicket?.id === ticket.id ? 'bg-blue-900/50 border-blue-400' : 'bg-gray-800/20 border-transparent hover:bg-blue-900/30'}`}>
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-semibold truncate pr-2">{ticket.title}</p>
                                                <UrgencyIndicator urgency={ticket.urgency} />
                                            </div>
                                            <div className="flex items-center justify-between text-xs mt-1 text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <CategoryIcon category={ticket.category} className="w-4 h-4" />
                                                    <span>#{ticket.id}</span>
                                                </div>
                                                <span className={`${statusConfig[ticket.status].color} font-mono`}>{ticket.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-grow flex flex-col">
                                <h3 className="font-mono text-md text-blue-300/90 tracking-wider mb-2 flex-shrink-0">// TICKET_DETAILS</h3>
                                <div className="flex-grow cyber-panel p-4 relative scanline-overlay flex flex-col overflow-y-auto cyber-scrollbar">
                                    {selectedTicket ? (
                                        <>
                                            <div className="border-b cyber-border pb-3 mb-3">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-xl font-bold text-blue-300">{selectedTicket.title}</h4>
                                                    <span className={`px-2 py-1 text-xs font-bold rounded-full flex items-center gap-2 ${statusConfig[selectedTicket.status].color}`}>
                                                        {React.createElement(statusConfig[selectedTicket.status].icon, {className: 'w-4 h-4'})}
                                                        {selectedTicket.status}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-2 font-mono">
                                                    <span>[ID]: #{selectedTicket.id}</span>
                                                    <span>[USER]: {selectedTicket.user}</span>
                                                    <span>[URGENCY]: {selectedTicket.urgency}</span>
                                                    <span>[CATEGORY]: {selectedTicket.category}</span>
                                                </div>
                                            </div>
                                            <div className="flex-grow mb-4">
                                                <h5 className="font-mono text-sm uppercase text-blue-400/90 tracking-widest mb-2">[ User Description ]</h5>
                                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedTicket.description}</p>
                                            </div>
                                            <div className="mt-auto pt-4 border-t cyber-border flex-shrink-0">
                                                 <h5 className="font-mono text-sm uppercase text-blue-400/90 tracking-widest mb-2">[ Agent Actions ]</h5>
                                                 <div className="flex gap-2">
                                                     {(['New', 'In Progress', 'Resolved', 'Closed'] as TicketStatus[]).map(status => (
                                                         <button key={status} onClick={() => updateTicketStatus(selectedTicket.id, status)} disabled={selectedTicket.status === status} className="cyber-button cyber-button-info text-xs flex-grow disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none">{status}</button>
                                                     ))}
                                                 </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="m-auto text-center text-gray-600 font-mono">// SELECT_TICKET_FROM_QUEUE //</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {agentTab === 'kb' && (
                        <div className="flex-grow flex gap-4 overflow-hidden">
                             <div className="w-1/3 flex-shrink-0 flex flex-col">
                                <h3 className="font-mono text-md text-blue-300/90 tracking-wider mb-2 flex-shrink-0">// ARTICLES</h3>
                                <input type="text" placeholder="Search KB..." value={kbSearch} onChange={e => setKbSearch(e.target.value)} className="cyber-input mb-2 flex-shrink-0" />
                                <div className="flex-grow cyber-panel p-2 overflow-y-auto cyber-scrollbar">
                                    {filteredKb.map(article => (
                                        <div key={article.id} onClick={() => setSelectedArticle(article)} className={`p-2 mb-1 cursor-pointer transition-colors duration-200 border-l-4 ${selectedArticle?.id === article.id ? 'bg-blue-900/50 border-blue-400' : 'bg-gray-800/20 border-transparent hover:bg-blue-900/30'}`}>
                                            <p className="text-sm font-semibold truncate">{article.title}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-grow flex flex-col">
                                <h3 className="font-mono text-md text-blue-300/90 tracking-wider mb-2 flex-shrink-0">// DOCUMENT_VIEWER</h3>
                                <div className="flex-grow cyber-panel relative scanline-overlay overflow-hidden">
                                    {selectedArticle ? (
                                        <iframe src={selectedArticle.url} className="w-full h-full border-0" title={selectedArticle.title}></iframe>
                                    ) : (
                                        <div className="m-auto text-center text-gray-600 font-mono">// SELECT_ARTICLE_TO_VIEW //</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default HelpdeskSimulator;