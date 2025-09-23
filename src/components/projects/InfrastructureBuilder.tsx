/**
 * @file Renders the "Infrastructure Builder" project
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description A drag-and-drop network topology simulator that allows users to build,
 * configure, and test virtual network infrastructures.
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  XIcon, RestartIcon, LightbulbIcon, ModemIcon, RouterIcon, SwitchIcon, FirewallIcon,
  ServerIcon, PcIcon, CloudIcon, CogIcon, CheckCircleIcon, PingIcon, GlobeIcon,
  TerminalIcon, FolderIcon, AlertTriangleIcon
} from '../icons/ProjectIcons';

type ComponentType = 'modem' | 'router' | 'firewall' | 'switch' | 'server' | 'pc' | 'cloud';
type Status = 'ok' | 'error' | 'warning' | 'neutral';
type ServerRole = 'ad' | 'file_share' | 'dhcp' | 'dns';
type SimulationService = 'ping' | 'http' | 'smb';

interface FirewallRule {
    id: number;
    source: string; // component id or 'any'
    destination: string; // component id or 'any'
    service: 'any' | SimulationService;
    action: 'allow' | 'deny';
}

interface Vlan {
    id: number;
    name: string;
}

interface PortVlanMapping {
    connectedComponentId: number;
    vlanId: number;
}

interface ComponentConfig {
  firewallRules?: FirewallRule[];
  serverRoles?: ServerRole[];
  ipConfig?: 'dhcp' | 'static';
  ipAddress?: string;
  subnetMask?: string;
  gateway?: string;
  dnsServer?: string;
  // Router DHCP config
  dhcpEnabled?: boolean;
  routerIpAddress?: string;
  dhcpStartAddress?: string;
  dhcpEndAddress?: string;
  // Switch VLAN config
  vlans?: Vlan[];
  portVlanMappings?: PortVlanMapping[];
  // Cloud config
  ispOutage?: boolean;
  publicDnsEnabled?: boolean;
  // Modem config
  connectionQuality?: 'excellent' | 'good' | 'poor';
  isRebooting?: boolean;
}

interface Component {
  id: number;
  type: ComponentType;
  name: string;
  x: number;
  y: number;
  status: Status;
  isErrorSource: boolean;
  config: ComponentConfig;
  description: string;
  assignedIp?: string; // For DHCP clients
}

interface Connection {
  from: number;
  to: number;
}

interface SimulationState {
    status: 'idle' | 'running' | 'success' | 'fail';
    path: number[];
    packetProgress: number; 
    message: string;
    service: SimulationService | null;
}

// List of all available components that can be dragged onto the canvas
const PALETTE_COMPONENTS: { type: ComponentType; name: string; icon: React.FC<any>, description: string, configurable: boolean }[] = [
  { type: 'modem', name: 'Modem', icon: ModemIcon, description: 'Connects your home network to your Internet Service Provider (ISP).', configurable: true },
  { type: 'router', name: 'Router', icon: RouterIcon, description: 'Directs traffic between the internet and your local network. Assigns IP addresses (DHCP).', configurable: true },
  { type: 'firewall', name: 'Firewall', icon: FirewallIcon, description: 'A security device that monitors and filters network traffic based on configured rules.', configurable: true },
  { type: 'switch', name: 'Switch', icon: SwitchIcon, description: 'Connects multiple wired devices on a local network, allowing them to communicate. Can segment network using VLANs.', configurable: true },
  { type: 'server', name: 'Server', icon: ServerIcon, description: 'Provides centralized services like Active Directory (user management) or file storage.', configurable: true },
  { type: 'pc', name: 'PC', icon: PcIcon, description: 'An endpoint device, like a desktop or laptop, used by end-users.', configurable: true },
  { type: 'cloud', name: 'Cloud', icon: CloudIcon, description: 'Represents the public internet or a specific cloud service provider.', configurable: true },
];

interface SimulatedTerminalProps {
  sourceComponent: Component;
  onClose: () => void;
  runSimulation: (sourceId: number, targetId: number, service: SimulationService) => { path: number[], blocked: boolean, message: string };
  findComponent: (nameOrIp: string) => Component | undefined;
  getDhcpServer: () => Component | undefined;
}

// Renders a simulated command-line interface for a given component
const SimulatedTerminal: React.FC<SimulatedTerminalProps> = ({ sourceComponent, onClose, runSimulation, findComponent, getDhcpServer }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>(['Simulated Terminal v1.0', 'Type "help" for a list of commands.']);
    const cliOutputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(cliOutputRef.current) {
            cliOutputRef.current.scrollTop = cliOutputRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommandSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const command = input.trim().toLowerCase();
        const newHistory = [...history, `C:\\Users\\Admin> ${input}`];

        if (command.startsWith('ping')) {
            const targetNameOrIp = input.trim().substring(5);
            if(!targetNameOrIp) {
                 setHistory([...newHistory, 'Ping command requires a target name or IP address.']);
                 setInput('');
                 return;
            }

            const target = findComponent(targetNameOrIp);
            if (!target) {
                setHistory([...newHistory, `Ping request could not find host ${targetNameOrIp}. Please check the name and try again.`]);
            } else if (target.id === sourceComponent.id) {
                 const selfIp = sourceComponent.config.ipConfig === 'dhcp' ? sourceComponent.assignedIp : sourceComponent.config.ipAddress;
                setHistory([...newHistory, `Pinging ${target.name} [${selfIp || '127.0.0.1'}]...`, 'Reply from localhost: Success.']);
            } else {
                const targetIp = (target.config.ipConfig === 'dhcp' ? target.assignedIp : target.config.ipAddress) || 'N/A';
                setHistory([...newHistory, `Pinging ${target.name} [${targetIp}] with 32 bytes of data...`]);
                const { blocked, message } = runSimulation(sourceComponent.id, target.id, 'ping');
                
                await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate ping delay

                if(blocked) {
                    setHistory(prev => [...prev, `Request timed out.`, `Request timed out.`, `Reason: ${message}`]);
                } else {
                     setHistory(prev => [...prev, `Reply from ${target.name}: bytes=32 time<1ms TTL=128`, `Reply from ${target.name}: bytes=32 time<1ms TTL=128`]);
                }
            }
        } else if (command === 'ipconfig') {
            const { config, assignedIp } = sourceComponent;
            let ip, subnet, gateway;
            
            if (config.ipConfig === 'dhcp') {
                const dhcpServer = getDhcpServer();
                ip = `${assignedIp || 'Not Assigned'} (DHCP)`;
                subnet = dhcpServer?.config.subnetMask || 'Not Set';
                gateway = dhcpServer?.config.routerIpAddress || dhcpServer?.config.gateway || 'Not Set';
            } else {
                ip = config.ipAddress || 'Not Set';
                subnet = config.subnetMask || 'Not Set';
                gateway = config.gateway || 'Not Set';
            }

            const output = [
                'Windows IP Configuration',
                `   IP Address...........: ${ip}`,
                `   Subnet Mask..........: ${subnet}`,
                `   Default Gateway......: ${gateway}`
            ];
            setHistory([...newHistory, ...output]);
        } else if (command === 'help') {
             setHistory([...newHistory, 'Available commands:', '  ping <name|ip>   - Test connectivity to another device.', '  ipconfig         - Display IP configuration for this PC.', '  cls              - Clear the terminal screen.', '  help             - Show this help message.']);
        } else if (command === 'cls') {
            setHistory([]);
        } else if (command === '') {
            setHistory(newHistory);
        } else {
            setHistory([...newHistory, `'${input}' is not recognized as an internal or external command.`]);
        }

        setInput('');
    };
    
    return (
        <div className="absolute inset-0 bg-black/50 z-40 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="cyber-card w-full max-w-2xl h-96 shadow-2xl flex flex-col font-mono text-sm text-gray-300 overflow-hidden relative">
                <div className="bg-gray-900/50 p-2 flex justify-between items-center cursor-move border-b border-blue-900/50 relative z-10">
                    <span className="font-sans font-bold text-blue-300">// Terminal: {sourceComponent.name}</span>
                    <button onClick={onClose} className="px-2 py-0.5 rounded-md hover:bg-red-500/50 font-sans text-lg leading-none">×</button>
                </div>
                <div ref={cliOutputRef} className="flex-grow p-3 overflow-y-auto relative z-10 cyber-scrollbar">
                    {history.map((line, index) => (
                        <p key={index} className="whitespace-pre-wrap">{line}</p>
                    ))}
                    <form onSubmit={handleCommandSubmit} className="flex items-center">
                        <span className="text-gray-400">C:\\Users\\Admin&gt;</span>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            className="flex-grow bg-transparent border-none focus:outline-none text-gray-200 pl-2"
                            autoFocus
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};

interface SwitchConfigPanelProps {
    componentId: number;
    currentConfig: ComponentConfig;
    updateComponentConfig: (id: number, newConfig: Partial<ComponentConfig>) => void;
    setFeedback: (feedback: { type: 'success' | 'error' | 'warning'; message: string } | null) => void;
    components: Component[];
}

// Renders configuration panel for network switches (VLAN management)
const SwitchConfigPanel: React.FC<SwitchConfigPanelProps> = ({ componentId, currentConfig, updateComponentConfig, setFeedback, components }) => {
    // Manages VLAN creation and port mapping logic
    const [newVlanId, setNewVlanId] = useState('');
    const [newVlanName, setNewVlanName] = useState('');

    const handleAddVlan = () => {
        const idNum = parseInt(newVlanId, 10);
        if (!idNum || !newVlanName || (currentConfig.vlans || []).some(v => v.id === idNum)) {
             setFeedback({type: 'error', message: 'Invalid VLAN ID or Name. ID must be a unique number.'});
             setTimeout(() => setFeedback(null), 3000);
             return;
        }
        const newVlan: Vlan = { id: idNum, name: newVlanName };
        updateComponentConfig(componentId, { vlans: [...(currentConfig.vlans || []), newVlan] });
        setNewVlanId('');
        setNewVlanName('');
    };
    
    const handleRemoveVlan = (vlanIdToRemove: number) => {
        if(vlanIdToRemove === 1) return; // Cannot remove default VLAN
        updateComponentConfig(componentId, {
            vlans: (currentConfig.vlans || []).filter(v => v.id !== vlanIdToRemove),
            portVlanMappings: (currentConfig.portVlanMappings || []).map(p => p.vlanId === vlanIdToRemove ? { ...p, vlanId: 1 } : p) // Revert ports to default
        });
    };

    const handlePortVlanChange = (connectedId: number, newVlanId: number) => {
        updateComponentConfig(componentId, {
            portVlanMappings: (currentConfig.portVlanMappings || []).map(p => p.connectedComponentId === connectedId ? {...p, vlanId: newVlanId} : p)
        });
    };

    const connectedDevices = (currentConfig.portVlanMappings || []).map(p => ({
        ...p,
        componentName: components.find(c => c.id === p.connectedComponentId)?.name || 'Unknown Device'
    }));

    return (
        <div className="space-y-6">
            <div>
                <h5 className="text-sm font-semibold text-gray-300 mb-2">// MANAGE VLANs</h5>
                 <div className="space-y-2">
                    {(currentConfig.vlans || []).map(vlan => (
                        <div key={vlan.id} className="flex items-center justify-between p-2 bg-black/20 rounded-md">
                            <span className="text-xs font-semibold">VLAN {vlan.id}: {vlan.name}</span>
                            {vlan.id !== 1 && <button onClick={() => handleRemoveVlan(vlan.id)} className="text-red-500 hover:text-red-400 text-xs">Remove</button>}
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 mt-3">
                    <input type="number" placeholder="ID" value={newVlanId} onChange={e => setNewVlanId(e.target.value)} className="cyber-input w-16"/>
                    <input type="text" placeholder="Name" value={newVlanName} onChange={e => setNewVlanName(e.target.value)} className="cyber-input flex-grow"/>
                    <button onClick={handleAddVlan} className="text-xs bg-blue-600 text-white font-semibold py-1 px-2 hover:bg-blue-500">+</button>
                </div>
            </div>
            <div>
                 <h5 className="text-sm font-semibold text-gray-300 mb-2">// PORT ASSIGNMENTS</h5>
                 <div className="space-y-2">
                    {connectedDevices.length === 0 && <p className="text-xs text-gray-500">No devices connected.</p>}
                    {connectedDevices.map(port => (
                       <div key={port.connectedComponentId} className="flex items-center justify-between p-2 bg-black/20 rounded-md">
                            <span className="text-xs font-semibold truncate pr-2">{port.componentName}</span>
                            <select value={port.vlanId} onChange={e => handlePortVlanChange(port.connectedComponentId, parseInt(e.target.value, 10))} className="cyber-select">
                                {(currentConfig.vlans || []).map(vlan => (
                                    <option key={vlan.id} value={vlan.id}>VLAN {vlan.id}</option>
                                ))}
                            </select>
                       </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

// Main object for the infrastructure builder
const InfrastructureBuilder: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    // state management
    // Core state for the builder
  const [components, setComponents] = useState<Component[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>({ type: 'success', message: 'System Initialized. Drag components to the canvas to begin.' });

  // State for managing UI interactions
  const [connectingFrom, setConnectingFrom] = useState<number | null>(null);
  const [movingComponent, setMovingComponent] = useState<{ id: number; offsetX: number; offsetY: number } | null>(null);
  const [configPanelId, setConfigPanelId] = useState<number | null>(null);
  const [configErrors, setConfigErrors] = useState<Record<string, string | null>>({});

  // References to the main canvas area
  const canvasRef = useRef<HTMLDivElement>(null);
  const [simulationState, setSimulationState] = useState<SimulationState>({ status: 'idle', path: [], packetProgress: 0, message: '', service: null });
  const [actionState, setActionState] = useState<{ type: 'ping' | 'browse' | 'share'; sourceId: number} | null>(null);
  const [cliState, setCliState] = useState<{ isOpen: boolean; sourceId: number | null }>({ isOpen: false, sourceId: null });
  const animationFrameRef = useRef<number | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  // Handles logic for dragging and dropping components on the canvas
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => { setConfigErrors({}); }, [configPanelId]);

  const addComponentAtPosition = (type: ComponentType, name: string, description: string, x: number, y: number) => {
    const existingNames = components.filter(c => c.name.startsWith(name)).map(c => c.name);
    let newName = name;
    let counter = 1;
    while(existingNames.includes(newName)) {
        newName = `${name}-${counter}`;
        counter++;
    }

    let defaultConfig: ComponentConfig = {};
    if (type === 'pc') {
        defaultConfig = { ipConfig: 'dhcp', ipAddress: '', subnetMask: '255.255.255.0', gateway: '192.168.1.1', dnsServer: '192.168.1.1' };
    }
    if(type === 'firewall') {
        defaultConfig = { firewallRules: [
            { id: Date.now(), source: 'any', destination: 'any', service: 'any', action: 'allow' }
        ] };
    }
     if(type === 'server') {
        defaultConfig = { serverRoles: [], ipConfig: 'static', ipAddress: `192.168.1.10${components.filter(c => c.type === 'server').length}`, subnetMask: '255.255.255.0', gateway: '192.168.1.1' };
    }
    if (type === 'router') {
        defaultConfig = { 
            dhcpEnabled: true,
            routerIpAddress: '192.168.1.1',
            dhcpStartAddress: '192.168.1.100',
            dhcpEndAddress: '192.168.1.200',
            subnetMask: '255.255.255.0',
            dnsServer: '192.168.1.1'
        };
    }
    if (type === 'switch') {
        defaultConfig = {
            vlans: [{ id: 1, name: 'Default' }],
            portVlanMappings: []
        };
    }
    if (type === 'cloud') {
        defaultConfig = { 
            ispOutage: false,
            publicDnsEnabled: true,
        };
    }
    if (type === 'modem') {
        defaultConfig = {
            connectionQuality: 'excellent',
            isRebooting: false,
        };
    }
    const newComponent: Component = { id: Date.now(), type, name: newName, x, y, status: 'neutral', isErrorSource: false, config: defaultConfig, description };
    setComponents(prev => [...prev, newComponent]);
  };
  
  const handleMouseDown = (e: React.MouseEvent, id: number) => {
    const component = components.find(c => c.id === id);
    if (component && canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const offsetX = e.clientX - canvasRect.left - component.x;
        const offsetY = e.clientY - canvasRect.top - component.y;
        setMovingComponent({ id, offsetX, offsetY });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (movingComponent && canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const newX = e.clientX - canvasRect.left - movingComponent.offsetX;
        const newY = e.clientY - canvasRect.top - movingComponent.offsetY;
        setComponents(prev => prev.map(c => c.id === movingComponent.id ? { ...c, x: newX, y: newY } : c));
    }
  }, [movingComponent]);

  const handleMouseUp = useCallback(() => { setMovingComponent(null); }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && movingComponent) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseUp);
    }
    return () => {
        if (canvas) {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseleave', handleMouseUp);
        }
    };
  }, [movingComponent, handleMouseMove, handleMouseUp]);

  const handleDragStart = (e: React.DragEvent, type: ComponentType, name: string, description: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type, name, description }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dataString = e.dataTransfer.getData('application/json');
    if (!dataString) return;
    try {
        const { type, name, description } = JSON.parse(dataString);
        if (canvasRef.current && PALETTE_COMPONENTS.some(p => p.type === type)) {
            const canvasRect = canvasRef.current.getBoundingClientRect();
            // Adjust for component size (w-24 -> 96px, half is 48px)
            addComponentAtPosition(type, name, description, e.clientX - canvasRect.left - 48, e.clientY - canvasRect.top - 48);
        }
    } catch (error) { console.error("Error handling drop: ", error); }
  };

    const handleConnectionClick = (id: number) => {
        setFeedback(null);
        if (connectingFrom === null) {
            setConnectingFrom(id);
        } else {
            if (connectingFrom === id) {
                setConnectingFrom(null);
                return;
            }
            const existing = connections.find(c => (c.from === connectingFrom && c.to === id) || (c.from === id && c.to === connectingFrom));
            if (existing) {
                // Disconnect
                setConnections(prev => prev.filter(c => !((c.from === connectingFrom && c.to === id) || (c.from === id && c.to === connectingFrom))));
                // If either was a switch, update its port mappings
                [id, connectingFrom].forEach(compId => {
                    const comp = components.find(c => c.id === compId);
                    if (comp?.type === 'switch') {
                        const otherId = compId === id ? connectingFrom : id;
                        updateComponentConfig(compId, {
                            portVlanMappings: (comp.config.portVlanMappings || []).filter(p => p.connectedComponentId !== otherId)
                        });
                    }
                });
            } else {
                // Connect
                setConnections(prev => [...prev, { from: connectingFrom, to: id }]);
                 // If either was a switch, update its port mappings
                [id, connectingFrom].forEach(compId => {
                    const comp = components.find(c => c.id === compId);
                    if (comp?.type === 'switch') {
                        const otherId = compId === id ? connectingFrom : id;
                        const newMapping: PortVlanMapping = { connectedComponentId: otherId, vlanId: 1 }; // Default to VLAN 1
                        updateComponentConfig(compId, {
                            portVlanMappings: [...(comp.config.portVlanMappings || []), newMapping]
                        });
                    }
                });
            }
            setConnectingFrom(null);
        }
    };

    const deleteComponent = (id: number) => {
        // Remove the component itself
        setComponents(prev => prev.filter(c => c.id !== id));

        // Remove connections to the deleted component
        setConnections(prev => prev.filter(c => c.from !== id && c.to !== id));
        
        // Also update switch port mappings on other switches it was connected to
        setComponents(prev => prev.map(comp => {
            if (comp.type === 'switch' && comp.config.portVlanMappings?.some(p => p.connectedComponentId === id)) {
                return {
                    ...comp,
                    config: {
                        ...comp.config,
                        portVlanMappings: comp.config.portVlanMappings.filter(p => p.connectedComponentId !== id)
                    }
                };
            }
            return comp;
        }));

        if (configPanelId === id) setConfigPanelId(null);
    };
  
  const updateComponentConfig = (id: number, newConfig: Partial<ComponentConfig>) => setComponents(prev => prev.map(c => c.id === id ? { ...c, config: {...c.config, ...newConfig} } : c));
  const updateComponentName = (id: number, newName: string) => setComponents(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c));

  // Main pathfinding and simulation logic (Breadth-first)
  // Calculates the path a packet would take and checks for blockers
  // such as firewall rules or VLAN mismatches
  const calculatePath = (startId: number, endId: number, service: SimulationService): { path: number[], blocked: boolean, message: string } => {
    let queue: { id: number, path: number[] }[] = [{ id: startId, path: [startId] }];
    let visited = new Set([startId]);

    while (queue.length > 0) {
        const { id: currentId, path: currentPath } = queue.shift()!;
        if (currentId === endId) return { path: currentPath, blocked: false, message: 'Path found' };

        const currentComponent = components.find(c => c.id === currentId);
        const prevComponentId = currentPath.length > 1 ? currentPath[currentPath.length - 2] : null;
        
        // Cloud Outage Check
        if (currentComponent?.type === 'cloud' && currentComponent.config.ispOutage) {
            return { path: currentPath, blocked: true, message: `Connection failed: ISP Outage is simulated.` };
        }
        
        // Modem Quality/Status Check
        if (currentComponent?.type === 'modem') {
            if (currentComponent.config.isRebooting) {
                return { path: currentPath, blocked: true, message: `Connection failed: Modem is currently rebooting.` };
            }
            if (currentComponent.config.connectionQuality === 'poor' && Math.random() < 0.4) {
                 return { path: currentPath, blocked: true, message: `Connection failed: Unstable connection due to poor modem signal.` };
            }
            if (currentComponent.config.connectionQuality === 'good' && Math.random() < 0.1) {
                 return { path: currentPath, blocked: true, message: `Connection failed: Intermittent packet loss due to fair modem signal.` };
            }
        }

        // Firewall Check
        if (currentComponent?.type === 'firewall') {
            const rules = currentComponent.config.firewallRules || [];
            let action: 'allow' | 'deny' | 'unmatched' = 'unmatched';
            let finalAction : 'allow' | 'deny' = 'deny'; 

            for(const rule of rules) {
                const sourceMatch = rule.source === 'any' || rule.source === String(startId);
                const destMatch = rule.destination === 'any' || rule.destination === String(endId);
                const serviceMatch = rule.service === 'any' || rule.service === service;

                if(sourceMatch && destMatch && serviceMatch) {
                    action = rule.action;
                    break;
                }
            }
            const defaultRule = rules.find(r => r.source === 'any' && r.destination === 'any' && r.service === 'any');
            finalAction = defaultRule ? defaultRule.action : 'deny';
            if (action === 'unmatched') action = finalAction;

            if(action === 'deny') {
                return { path: currentPath, blocked: true, message: `Traffic blocked by Firewall '${currentComponent.name}'.` };
            }
        }
        
        const neighbors = connections
            .filter(c => c.from === currentId || c.to === currentId)
            .map(c => c.from === currentId ? c.to : c.from);

        for (const neighborId of neighbors) {
            // VLAN Check: if we are passing THROUGH a switch
            if (currentComponent?.type === 'switch' && prevComponentId !== null) {
                const mappings = currentComponent.config.portVlanMappings || [];
                const vlanIn = mappings.find(m => m.connectedComponentId === prevComponentId)?.vlanId || 1;
                const vlanOut = mappings.find(m => m.connectedComponentId === neighborId)?.vlanId || 1;
                const neighborIsRouter = components.find(c => c.id === neighborId)?.type === 'router';
                
                if (vlanIn !== vlanOut && !neighborIsRouter) {
                    // Block path by not adding this neighbor to the queue
                    continue; 
                }
            }

            if (!visited.has(neighborId)) {
                visited.add(neighborId);
                queue.push({ id: neighborId, path: [...currentPath, neighborId] });
            }
        }
    }
    return { path: [], blocked: true, message: 'No valid connection path found. (Check VLANs or physical connections)' };
  };

  // Initiates network simulation (http, ping, etc)
  // May perform pre-checks like DNS resolution before calling calculatePath
  const startSimulation = (sourceId: number, targetId: number, service: SimulationService) => {
    let finalTargetId = targetId;
    let initialCheck = { path: [] as number[], blocked: false, message: ''};

    // If browsing web, first check DNS path
    if (service === 'http') {
        const sourcePC = components.find(c => c.id === sourceId);
        if(sourcePC) {
            const dnsServerIp = sourcePC.config.dnsServer;
            const gatewayIp = sourcePC.config.gateway;

            if (!dnsServerIp) {
                initialCheck = { path: [], blocked: true, message: `DNS resolution failed: No DNS server is configured for '${sourcePC.name}'.` };
            } else if (dnsServerIp === '8.8.8.8') {
                const cloud = components.find(c => c.type === 'cloud');
                if (cloud?.config.publicDnsEnabled) {
                    const dnsPathCheck = calculatePath(sourceId, cloud.id, 'http'); // Using 'http' service for firewall rules is a simplification
                    if (dnsPathCheck.blocked) {
                         initialCheck = { ...dnsPathCheck, message: `Cannot resolve DNS. Failed to connect to Public DNS (8.8.8.8). ${dnsPathCheck.message}` };
                    }
                } else {
                     initialCheck = { path: [], blocked: true, message: `DNS resolution failed: Public DNS (8.8.8.8) is not enabled on the Cloud component.` };
                }
            } else {
                const dnsServerComponent = components.find(c => c.type === 'server' && c.config.serverRoles?.includes('dns') && c.config.ipAddress === dnsServerIp);
    
                if (dnsServerComponent) {
                    const dnsPathCheck = calculatePath(sourceId, dnsServerComponent.id, 'http');
                    if (dnsPathCheck.blocked) {
                        initialCheck = { ...dnsPathCheck, message: `Cannot resolve DNS. Failed to connect to DNS server '${dnsServerComponent.name}'. ${dnsPathCheck.message}` };
                    }
                } 
                else if (dnsServerIp === gatewayIp) {
                    const router = components.find(c => c.type === 'router');
                    if (router) {
                        const routerPathCheck = calculatePath(sourceId, router.id, 'http');
                        if (routerPathCheck.blocked) {
                            initialCheck = { ...routerPathCheck, message: `Cannot resolve DNS. Failed to connect to the Gateway/Router. ${routerPathCheck.message}` };
                        }
                    } else {
                         initialCheck = { path: [], blocked: true, message: `DNS resolution failed: The configured gateway '${gatewayIp}' does not exist in the diagram.` };
                    }
                }
                else {
                    initialCheck = { path: [], blocked: true, message: `DNS resolution failed: The configured DNS server '${dnsServerIp}' was not found.` };
                }
            }
        }
    }
    
    if (initialCheck.blocked) {
        setSimulationState({ status: 'fail', message: initialCheck.message, path: initialCheck.path, packetProgress: 0, service });
        return { path: initialCheck.path, blocked: true, message: initialCheck.message };
    }

    const { path, blocked, message } = calculatePath(sourceId, finalTargetId, service);
    if (path.length === 0 || blocked) {
        setSimulationState({ status: 'fail', message, path, packetProgress: 0, service });
    } else {
        setSimulationState({ status: 'running', path, message, packetProgress: 0, service });
    }
    return { path, blocked, message };
  };

  const runAnimation = useCallback(() => {
    setSimulationState(prev => {
        if (prev.status !== 'running') return prev;
        const newProgress = prev.packetProgress + 0.01;
        if (newProgress >= 1) {
            const finalMessage = prev.path.length > 0 ? "Connection successful." : "Connection failed.";
            return { ...prev, status: 'success', message: finalMessage, packetProgress: 1 };
        }
        return { ...prev, packetProgress: newProgress };
    });
    animationFrameRef.current = requestAnimationFrame(runAnimation);
  }, []);


  useEffect(() => {
    if (simulationState.status === 'running') {
        animationFrameRef.current = requestAnimationFrame(runAnimation);
    } else {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (simulationState.status === 'success' || simulationState.status === 'fail') {
            const timer = setTimeout(() => setSimulationState({ status: 'idle', path: [], packetProgress: 0, message: '', service: null }), 4000);
            return () => clearTimeout(timer);
        }
    }
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current) };
  }, [simulationState.status, runAnimation]);

    const ipToNumber = (ip: string) => {
        return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
    };

    const numberToIp = (num: number) => {
        return [(num >> 24) & 255, (num >> 16) & 255, (num >> 8) & 255, num & 255].join('.');
    };
  
  // Analyses network topology for typical config errors
  // Checks for connectivity, DHCP conflicts, incorrect gateways, etc
  const checkNetwork = () => {
      setFeedback(null);
      let updatedComponents: Component[] = components.map(c => ({...c, isErrorSource: false, status: 'neutral', assignedIp: c.config.ipConfig === 'dhcp' ? undefined : c.assignedIp }));
      let errorFound = false;

      const setError = (id: number, message: string) => {
          if (errorFound) return;
          setFeedback({ type: 'error', message });
          updatedComponents = updatedComponents.map(c => c.id === id ? { ...c, isErrorSource: true, status: 'error' } : c);
          errorFound = true;
      };
      
      const setWarning = (id: number, message: string) => {
          if (errorFound) return;
          setFeedback({ type: 'warning', message });
          updatedComponents = updatedComponents.map(c => c.id === id ? { ...c, isErrorSource: true, status: 'warning' } : c);
      };

      const router = updatedComponents.find(c => c.type === 'router');
      const modem = updatedComponents.find(c => c.type === 'modem');
      const cloud = updatedComponents.find(c => c.type === 'cloud');

      // Check Cloud status first, as it can be an independent issue
      if (cloud) {
          if (cloud.config.ispOutage) {
              setError(cloud.id, "ISP Outage is active. Internet connectivity will fail.");
          } else if (!errorFound) {
              updatedComponents = updatedComponents.map(c => c.id === cloud.id ? { ...c, status: 'ok' } : c);
          }
      }

      if (!modem || !router || !cloud) {
          setComponents(updatedComponents);
          return setFeedback({ type: 'error', message: 'A basic network requires at least a Modem, a Router, and a Cloud component.' });
      }

      if (modem) {
        if (modem.config.connectionQuality === 'poor') {
            setWarning(modem.id, 'Modem signal quality is set to "Poor", which may cause network instability.');
        } else if (!errorFound) {
            updatedComponents = updatedComponents.map(c => c.id === modem.id && c.status !== 'error' ? { ...c, status: 'ok' } : c);
        }
      }

      const isConnected = (id1: number, id2: number) => connections.some(c => (c.from === id1 && c.to === id2) || (c.from === id2 && c.to === id1));
      if (!isConnected(modem.id, cloud.id)) setError(modem.id, 'The Modem must be connected to the Cloud (Internet).');
      if (!isConnected(router.id, modem.id)) setError(router.id, 'The Router must be connected to the Modem.');

      const serverDhcp = updatedComponents.find(c => c.type === 'server' && c.config.serverRoles?.includes('dhcp'));
      const routerDhcp = router.config.dhcpEnabled ? router : undefined;
      if (serverDhcp && routerDhcp) setError(serverDhcp.id, "DHCP Conflict: Both the Router and a Server have DHCP enabled. Only one should be active.");
      
      const activeDhcpServer = routerDhcp || serverDhcp;
      const staticIps = new Set(updatedComponents.filter(c => c.config.ipConfig === 'static' && c.config.ipAddress).map(c => c.config.ipAddress));

      if (activeDhcpServer) {
        const startIp = ipToNumber(activeDhcpServer.config.dhcpStartAddress || '0.0.0.0');
        const endIp = ipToNumber(activeDhcpServer.config.dhcpEndAddress || '0.0.0.0');
        let currentIp = startIp;

        updatedComponents.filter(c => c.type === 'pc' && c.config.ipConfig === 'dhcp').forEach(pc => {
            if(errorFound) return;
            let assigned = false;
            while(currentIp <= endIp) {
                const ipStr = numberToIp(currentIp);
                if(!staticIps.has(ipStr)) {
                    updatedComponents = updatedComponents.map(c => c.id === pc.id ? {...c, assignedIp: ipStr, status: 'ok'} : c);
                    staticIps.add(ipStr); // Add to used IPs for this check run
                    assigned = true;
                    break;
                }
                currentIp++;
            }
            if(!assigned) setError(activeDhcpServer.id, `DHCP server '${activeDhcpServer.name}' has run out of available IP addresses.`);
        });
      }

      updatedComponents.forEach(comp => {
          if (errorFound) return;
          if (comp.type === 'pc' && comp.config.ipConfig === 'dhcp' && !activeDhcpServer) {
              setError(comp.id, `PC '${comp.name}' is set to DHCP, but no active DHCP server was found on the network.`);
          }
          if (comp.type === 'pc' && comp.config.ipConfig === 'static') {
              if (!comp.config.ipAddress || !comp.config.gateway) setError(comp.id, `PC '${comp.name}' has static IP but is missing an IP Address or Gateway.`);
              if (comp.config.gateway !== router?.config.routerIpAddress) setError(comp.id, `PC '${comp.name}' has an incorrect gateway. It should point to the Router's IP (${router?.config.routerIpAddress || 'N/A'}).`);
          }
          const adServer = updatedComponents.find(c => c.type === 'server' && c.config.serverRoles?.includes('ad'));
          if(adServer) {
              const { blocked } = calculatePath(comp.id, adServer.id, 'http');
              if(blocked) setWarning(comp.id, `Warning: PC '${comp.name}' may not be able to connect to the Active Directory server.`);
          }
      });
      
      setComponents(updatedComponents);
      if (!errorFound) {
          setFeedback({ type: 'success', message: 'Your network configuration looks great! All checks passed and DHCP addresses have been assigned.' });
      }
  };
  
  const reset = () => {
    setComponents([]);
    setConnections([]);
    setFeedback({ type: 'warning', message: 'Canvas cleared. Drag components to begin a new simulation.' });
    setConnectingFrom(null);
    setConfigPanelId(null);
    setSimulationState({ status: 'idle', path: [], packetProgress: 0, message: '', service: null });
    setActionState(null);
    setCliState({ isOpen: false, sourceId: null });
  };

  const generateSampleNetwork = () => {
    reset();

    const cloudId = Date.now();
    const modemId = Date.now() + 1;
    const routerId = Date.now() + 2;
    const switchId = Date.now() + 3;
    const serverId = Date.now() + 4;
    const pcId = Date.now() + 5;

    const sampleComponents: Component[] = [
        { id: cloudId, type: 'cloud', name: 'Internet', x: 400, y: 20, status: 'neutral', isErrorSource: false, config: { ispOutage: false, publicDnsEnabled: true }, description: 'Represents the public internet or a specific cloud service provider.' },
        { id: modemId, type: 'modem', name: 'Modem', x: 400, y: 130, status: 'neutral', isErrorSource: false, config: { connectionQuality: 'excellent', isRebooting: false }, description: 'Connects your home network to your Internet Service Provider (ISP).' },
        { id: routerId, type: 'router', name: 'Router', x: 400, y: 240, status: 'neutral', isErrorSource: false, config: { dhcpEnabled: true, routerIpAddress: '192.168.1.1', dhcpStartAddress: '192.168.1.100', dhcpEndAddress: '192.168.1.200', subnetMask: '255.255.255.0' }, description: 'Directs traffic between the internet and your local network. Assigns IP addresses (DHCP).' },
        { id: switchId, type: 'switch', name: 'Switch', x: 400, y: 350, status: 'neutral', isErrorSource: false, config: { vlans: [{ id: 1, name: 'Default' }], portVlanMappings: [] }, description: 'Connects multiple wired devices on a local network, allowing them to communicate. Can segment network using VLANs.' },
        { id: serverId, type: 'server', name: 'FileServer-DNS', x: 250, y: 460, status: 'neutral', isErrorSource: false, config: { serverRoles: ['file_share', 'dns'], ipConfig: 'static', ipAddress: '192.168.1.10', subnetMask: '255.255.255.0', gateway: '192.168.1.1' }, description: 'Provides centralized services like Active Directory (user management) or file storage.' },
        { id: pcId, type: 'pc', name: 'Workstation', x: 550, y: 460, status: 'neutral', isErrorSource: false, config: { ipConfig: 'dhcp', dnsServer: '192.168.1.10' }, description: 'An endpoint device, like a desktop or laptop, used by end-users.' },
    ];

    const sampleConnections: Connection[] = [
        { from: cloudId, to: modemId },
        { from: modemId, to: routerId },
        { from: routerId, to: switchId },
        { from: switchId, to: serverId },
        { from: switchId, to: pcId },
    ];

    const switchComp = sampleComponents.find(c => c.id === switchId);
    if (switchComp && switchComp.type === 'switch') {
        const switchConnections = sampleConnections.filter(conn => conn.from === switchId || conn.to === switchId);
        switchComp.config.portVlanMappings = switchConnections.map(conn => {
            const connectedId = conn.from === switchId ? conn.to : conn.from;
            return { connectedComponentId: connectedId, vlanId: 1 };
        });
    }

    setComponents(sampleComponents);
    setConnections(sampleConnections);
    setFeedback({ type: 'success', message: 'Sample network generated! Run "Check Network" to see it in action.' });
  };


  const getComponentPosition = (id: number) => {
    const component = components.find(c => c.id === id);
    if (!component) return { x: 0, y: 0 };
    // Adjust for component size (w-24 -> 96px, half is 48px)
    return { x: component.x + 48, y: component.y + 48 };
  };
  
  const getPacketPosition = () => {
    if (simulationState.status !== 'running' || simulationState.path.length < 2) return null;
    const path = simulationState.path.map(id => getComponentPosition(id));
    const segmentLengths = path.slice(1).map((p, i) => Math.hypot(p.x - path[i].x, p.y - path[i].y));
    const totalLength = segmentLengths.reduce((a, b) => a + b, 0);
    if(totalLength === 0) return null;
    let distanceTravelled = simulationState.packetProgress * totalLength;
    
    let currentSegment = 0;
    while(distanceTravelled > segmentLengths[currentSegment] && currentSegment < segmentLengths.length - 1) {
        distanceTravelled -= segmentLengths[currentSegment];
        currentSegment++;
    }

    const segmentProgress = segmentLengths[currentSegment] > 0 ? distanceTravelled / segmentLengths[currentSegment] : 0;
    const start = path[currentSegment];
    const end = path[currentSegment + 1];
    return {
        x: start.x + (end.x - start.x) * segmentProgress,
        y: start.y + (end.y - start.y) * segmentProgress,
    };
  };

  const handlePcAction = (type: 'ping' | 'browse' | 'share' | 'cli', sourceId: number) => {
    setFeedback(null);
    setSimulationState({ status: 'idle', path: [], packetProgress: 0, message: '', service: null });

    if (actionState && actionState.sourceId === sourceId) {
        setActionState(null);
        setFeedback(null);
        return;
    }

    if(type === 'cli') {
      setCliState({ isOpen: true, sourceId });
      setActionState(null);
      return;
    }

    if (type === 'browse') {
        const cloud = components.find(c => c.type === 'cloud');
        if (cloud) startSimulation(sourceId, cloud.id, 'http');
        setActionState(null);
    } else {
        setActionState({ type, sourceId });
        const targetType = type === 'ping' ? 'device to ping' : 'file share server to access';
        setFeedback({ type: 'success', message: `Target selection active. Click on a ${targetType}.`});
    }
  };
  
  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'ok': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const findComponent = (nameOrIp: string) => {
      return components.find(c => c.name.toLowerCase() === nameOrIp.toLowerCase() || c.config.ipAddress === nameOrIp || c.assignedIp === nameOrIp);
  };
  
  const getDhcpServer = () => {
    return components.find(c => (c.type === 'router' && c.config.dhcpEnabled) || (c.type === 'server' && c.config.serverRoles?.includes('dhcp')));
  }
  
  const renderConfigPanel = () => {
    const component = components.find(c => c.id === configPanelId);
    if (!component) return null;
    
    const { id, type, name } = component;
    const currentConfig = components.find(c => c.id === id)?.config || {};

    const validateIp = (ip: string) => /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip);

    const handleIpChange = (field: keyof ComponentConfig, value: string) => {
      updateComponentConfig(id, { [field]: value });
      if (value && !validateIp(value)) {
        setConfigErrors(prev => ({ ...prev, [field]: 'Invalid format. Use X.X.X.X' }));
      } else {
        setConfigErrors(prev => ({ ...prev, [field]: null }));
      }
    };
    
    const renderRouterConfig = () => (
        <>
            <label htmlFor={`dhcpEnabled-${id}`} className="flex items-center justify-between p-2 bg-black/20 rounded-md w-full cursor-pointer">
                <span className="text-sm font-medium text-gray-300">Enable DHCP Server</span>
                <div className="relative inline-flex items-center">
                    <input type="checkbox" id={`dhcpEnabled-${id}`} checked={!!currentConfig.dhcpEnabled} onChange={(e) => updateComponentConfig(id, { dhcpEnabled: e.target.checked })} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
            </label>
            <div className="space-y-4 pt-4">
                 <div>
                  <label htmlFor={`routerIpAddress-${id}`} className="block text-sm font-medium text-gray-300 mb-1">Router IP (Gateway)</label>
                  <input type="text" id={`routerIpAddress-${id}`} value={currentConfig.routerIpAddress || ''} onChange={(e) => handleIpChange('routerIpAddress', e.target.value)} className={`cyber-input w-full ${configErrors.routerIpAddress ? 'border-red-500' : ''}`} />
                  {configErrors.routerIpAddress && <p className="mt-1 text-xs text-red-500">{configErrors.routerIpAddress}</p>}
                </div>
                {currentConfig.dhcpEnabled && (
                    <div className="space-y-4 animate-fade-in border-t border-blue-900/50 pt-4">
                        <p className="text-sm font-medium text-gray-300">DHCP Range</p>
                        <div>
                          <label htmlFor={`dhcpStart-${id}`} className="block text-xs text-gray-400 mb-1">Start IP Address</label>
                          <input type="text" id={`dhcpStart-${id}`} value={currentConfig.dhcpStartAddress || ''} onChange={(e) => handleIpChange('dhcpStartAddress', e.target.value)} className={`cyber-input w-full ${configErrors.dhcpStartAddress ? 'border-red-500' : ''}`} />
                          {configErrors.dhcpStartAddress && <p className="mt-1 text-xs text-red-500">{configErrors.dhcpStartAddress}</p>}
                        </div>
                        <div>
                          <label htmlFor={`dhcpEnd-${id}`} className="block text-xs text-gray-400 mb-1">End IP Address</label>
                          <input type="text" id={`dhcpEnd-${id}`} value={currentConfig.dhcpEndAddress || ''} onChange={(e) => handleIpChange('dhcpEndAddress', e.target.value)} className={`cyber-input w-full ${configErrors.dhcpEndAddress ? 'border-red-500' : ''}`} />
                          {configErrors.dhcpEndAddress && <p className="mt-1 text-xs text-red-500">{configErrors.dhcpEndAddress}</p>}
                        </div>
                    </div>
                )}
            </div>
        </>
    );

    const renderPcConfig = () => (
      <>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Configuration</label>
          <div className="mt-2 flex gap-4">
            <label className="cyber-radio">
              <input type="radio" name={`ipConfig-${id}`} value="dhcp" checked={currentConfig.ipConfig === 'dhcp'} onChange={() => updateComponentConfig(id, { ipConfig: 'dhcp' })} />
              <span className="radiomark"></span>
              <span>DHCP</span>
            </label>
            <label className="cyber-radio">
              <input type="radio" name={`ipConfig-${id}`} value="static" checked={currentConfig.ipConfig === 'static'} onChange={() => updateComponentConfig(id, { ipConfig: 'static' })} />
              <span className="radiomark"></span>
              <span>Static IP</span>
            </label>
          </div>
        </div>
        {currentConfig.ipConfig === 'static' ? (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label htmlFor={`ipAddress-${id}`} className="block text-sm font-medium text-gray-300 mb-1">IP Address</label>
              <input type="text" id={`ipAddress-${id}`} value={currentConfig.ipAddress || ''} onChange={(e) => handleIpChange('ipAddress', e.target.value)} className={`cyber-input w-full ${configErrors.ipAddress ? 'border-red-500' : ''}`} />
              {configErrors.ipAddress && <p className="mt-1 text-xs text-red-500">{configErrors.ipAddress}</p>}
            </div>
            <div>
              <label htmlFor={`subnetMask-${id}`} className="block text-sm font-medium text-gray-300 mb-1">Subnet Mask</label>
              <input type="text" id={`subnetMask-${id}`} value={currentConfig.subnetMask || ''} onChange={(e) => handleIpChange('subnetMask', e.target.value)} className={`cyber-input w-full ${configErrors.subnetMask ? 'border-red-500' : ''}`} />
               {configErrors.subnetMask && <p className="mt-1 text-xs text-red-500">{configErrors.subnetMask}</p>}
            </div>
            <div>
              <label htmlFor={`gateway-${id}`} className="block text-sm font-medium text-gray-300 mb-1">Gateway</label>
              <input type="text" id={`gateway-${id}`} value={currentConfig.gateway || ''} onChange={(e) => handleIpChange('gateway', e.target.value)} className={`cyber-input w-full ${configErrors.gateway ? 'border-red-500' : ''}`} />
              {configErrors.gateway && <p className="mt-1 text-xs text-red-500">{configErrors.gateway}</p>}
            </div>
             <div>
              <label htmlFor={`dnsServer-${id}`} className="block text-sm font-medium text-gray-300 mb-1">DNS Server</label>
              <input type="text" id={`dnsServer-${id}`} value={currentConfig.dnsServer || ''} onChange={(e) => handleIpChange('dnsServer', e.target.value)} className={`cyber-input w-full ${configErrors.dnsServer ? 'border-red-500' : ''}`} />
              {configErrors.dnsServer && <p className="mt-1 text-xs text-red-500">{configErrors.dnsServer}</p>}
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
              <div>
                <label htmlFor={`dnsServer-dhcp-${id}`} className="block text-sm font-medium text-gray-300 mb-1">DNS Server (Optional Override)</label>
                <input type="text" id={`dnsServer-dhcp-${id}`} value={currentConfig.dnsServer || ''} onChange={(e) => handleIpChange('dnsServer', e.target.value)} placeholder="e.g., 192.168.1.10" className={`cyber-input w-full ${configErrors.dnsServer ? 'border-red-500' : ''}`} />
                {configErrors.dnsServer && <p className="mt-1 text-xs text-red-500">{configErrors.dnsServer}</p>}
              </div>
          </div>
        )}
      </>
    );

    const handleServerRoleChange = (role: ServerRole, checked: boolean) => {
        const currentRoles = currentConfig.serverRoles || [];
        const newRoles = checked ? [...currentRoles, role] : currentRoles.filter(r => r !== role);
        updateComponentConfig(id, { serverRoles: newRoles });
    };

    const renderServerConfig = () => (
      <div>
        <label className="block text-sm font-medium text-gray-300">Server Roles</label>
        <div className="mt-2 space-y-2">
            {(['ad', 'file_share', 'dhcp', 'dns'] as ServerRole[]).map(role => (
                <label key={role} className="cyber-checkbox">
                    <input type="checkbox" checked={currentConfig.serverRoles?.includes(role)} onChange={(e) => handleServerRoleChange(role, e.target.checked)} />
                    <span className="checkmark"></span>
                    <span className="capitalize">{role.replace('_', ' ')}</span>
                </label>
            ))}
        </div>
      </div>
    );

    const handleFirewallRuleChange = (ruleId: number, field: keyof FirewallRule, value: string | number) => {
        const newRules = (currentConfig.firewallRules || []).map(r => r.id === ruleId ? {...r, [field]: value} : r);
        updateComponentConfig(id, {firewallRules: newRules});
    };
    const addFirewallRule = () => {
        const newRule: FirewallRule = {id: Date.now(), source: 'any', destination: 'any', service: 'any', action: 'deny'};
        const newRules = [...(currentConfig.firewallRules || []), newRule];
        updateComponentConfig(id, {firewallRules: newRules});
    };
    const removeFirewallRule = (ruleId: number) => {
        const newRules = (currentConfig.firewallRules || []).filter(r => r.id !== ruleId);
        updateComponentConfig(id, {firewallRules: newRules});
    };

    const renderFirewallConfig = () => (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-300">Firewall Rules</label>
            <button onClick={addFirewallRule} className="text-xs bg-blue-600 text-white font-semibold py-1 px-2 hover:bg-blue-500">+</button>
        </div>
        <div className="space-y-3 text-xs">
            {(currentConfig.firewallRules || []).map(rule => (
                <div key={rule.id} className="p-2 bg-black/20 rounded-md space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                        <select value={rule.action} onChange={e => handleFirewallRuleChange(rule.id, 'action', e.target.value)} className="cyber-select">
                            <option value="allow">Allow</option>
                            <option value="deny">Deny</option>
                        </select>
                        <select value={rule.service} onChange={e => handleFirewallRuleChange(rule.id, 'service', e.target.value)} className="cyber-select">
                            <option value="any">Any Service</option>
                            <option value="ping">Ping</option>
                            <option value="http">HTTP</option>
                            <option value="smb">SMB</option>
                        </select>
                    </div>
                     <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Source" value={rule.source} onChange={(e) => handleFirewallRuleChange(rule.id, "source", e.target.value)} className="cyber-input w-full" />
                        <input type="text" placeholder="Destination" value={rule.destination} onChange={(e) => handleFirewallRuleChange(rule.id, "destination", e.target.value)} className="cyber-input w-full" />
                    </div>
                    <div className="text-right"><button onClick={() => removeFirewallRule(rule.id)} className="text-red-500 hover:text-red-400 text-xs">Remove</button></div>
                </div>
            ))}
        </div>
      </div>
    );

    const renderCloudConfig = () => (
      <div className="space-y-4">
        <label htmlFor={`ispOutage-${id}`} className="flex items-center justify-between p-2 bg-black/20 rounded-md w-full cursor-pointer">
            <span className="text-sm font-medium text-gray-300">Simulate ISP Outage</span>
            <div className="relative inline-flex items-center">
                <input type="checkbox" id={`ispOutage-${id}`} checked={!!currentConfig.ispOutage} onChange={(e) => updateComponentConfig(id, { ispOutage: e.target.checked })} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </div>
        </label>
         <label htmlFor={`publicDns-${id}`} className="flex items-center justify-between p-2 bg-black/20 rounded-md w-full cursor-pointer">
            <span className="text-sm font-medium text-gray-300">Public DNS (8.8.8.8)</span>
            <div className="relative inline-flex items-center">
                <input type="checkbox" id={`publicDns-${id}`} checked={!!currentConfig.publicDnsEnabled} onChange={(e) => updateComponentConfig(id, { publicDnsEnabled: e.target.checked })} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
        </label>
      </div>
    );
    
    const renderModemConfig = () => (
        <div className="space-y-4">
             <div>
                <label htmlFor={`connectionQuality-${id}`} className="block text-sm font-medium text-gray-300 mb-1">Connection Quality</label>
                <select id={`connectionQuality-${id}`} value={currentConfig.connectionQuality || 'excellent'} onChange={(e) => updateComponentConfig(id, { connectionQuality: e.target.value as any })} className="cyber-select w-full">
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="poor">Poor</option>
                </select>
            </div>
            <button onClick={() => {
                updateComponentConfig(id, { isRebooting: true });
                setTimeout(() => updateComponentConfig(id, { isRebooting: false }), 5000);
            }} disabled={currentConfig.isRebooting} className="w-full text-center px-4 py-2 border border-yellow-500/50 bg-yellow-900/50 text-yellow-300 font-mono text-sm uppercase tracking-wider transition-all duration-200 hover:bg-yellow-800/70 disabled:opacity-50 disabled:cursor-not-allowed">
                {currentConfig.isRebooting ? 'Rebooting...' : 'Reboot Modem'}
            </button>
        </div>
    );


    const renderSpecificConfig = () => {
      switch (type) {
        case 'router': return renderRouterConfig();
        case 'pc': return renderPcConfig();
        case 'server': return renderServerConfig();
        case 'firewall': return renderFirewallConfig();
        case 'switch': return <SwitchConfigPanel componentId={id} currentConfig={currentConfig} updateComponentConfig={updateComponentConfig} setFeedback={setFeedback} components={components} />;
        case 'cloud': return renderCloudConfig();
        case 'modem': return renderModemConfig();
        default: return <p className="text-sm text-gray-500">No specific configuration available.</p>;
      }
    };

    return (
      <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
        <div className="cyber-card w-full max-w-md max-h-[85vh] shadow-2xl flex flex-col relative scanline-overlay">
          <div className="flex justify-between items-center p-4 border-b border-blue-900/50 relative z-10 flex-shrink-0">
              <h4 className="font-mono text-lg text-blue-300/90 tracking-wider">// CONFIG: {name}</h4>
              <button onClick={() => setConfigPanelId(null)} className="p-1 rounded-md hover:bg-red-500/50 transition-colors">
                  <XIcon className="w-5 h-5"/>
              </button>
          </div>
          <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4 relative z-10 cyber-scrollbar">
              <div>
                  <label htmlFor={`name-${id}`} className="block text-sm font-medium text-gray-300 mb-1">Component Name</label>
                  <input type="text" id={`name-${id}`} value={name} onChange={(e) => updateComponentName(id, e.target.value)} className="cyber-input w-full" />
              </div>
              {renderSpecificConfig()}
          </div>
           <div className="p-4 mt-auto border-t border-blue-900/50 relative z-10 flex-shrink-0">
              <button onClick={() => deleteComponent(id)} className="cyber-button cyber-button-destructive w-full text-sm">
                  Delete Component
              </button>
          </div>
        </div>
      </div>
    );
  };
  
  const title = "// INFRA_BUILDER :: VIRTUAL_LAB_CORE";

  return (
    <div className="h-full w-full flex flex-col relative text-white bg-black/30">
        {/* Header */}
        <header className="w-full bg-gray-900/50 backdrop-blur-lg border-b border-blue-900/50 p-2 flex items-center justify-between z-30 flex-shrink-0">
             <h2 className="font-mono text-lg text-blue-300 cyber-glow px-2 cyber-glitch-text" data-text={title}>{title}</h2>
             <button onClick={onClose} className="px-3 py-1 rounded-md hover:bg-red-500/50 transition-colors font-sans text-xl leading-none">×</button>
        </header>
        
        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
            {/* Palette */}
            <aside className="w-full md:w-64 bg-black/30 border-b md:border-b-0 md:border-r-2 border-blue-500/30 p-4 overflow-y-auto flex-shrink-0 cyber-scrollbar">
                <div className="cyber-card p-3 relative scanline-overlay h-full flex flex-col">
                  <div className="grid grid-cols-2 gap-4 relative z-10 flex-grow overflow-y-auto cyber-scrollbar pr-2">
                      {PALETTE_COMPONENTS.map(({ type, name, icon: Icon, description }) => (
                          <div key={type} draggable onDragStart={(e) => handleDragStart(e, type, name, description)} className="flex flex-col items-center p-2 border-2 border-dashed border-blue-900/50 bg-gray-800/20 cursor-grab hover:bg-blue-900/30 hover:border-solid transition-all group">
                              <Icon className="w-10 h-10 text-blue-400 mb-2 group-hover:text-blue-300 transition-colors"/>
                              <span className="text-xs text-center font-semibold">{name}</span>
                          </div>
                      ))}
                  </div>
                  <div className="flex-shrink-0 pt-4 border-t border-blue-900/50 space-y-3 relative z-10">
                      <button onClick={checkNetwork} className="cyber-button cyber-button-primary w-full text-sm">
                          Check Network
                      </button>
                       <button onClick={generateSampleNetwork} className="cyber-button cyber-button-secondary w-full text-sm">
                          Sample Lab
                      </button>
                      <button onClick={reset} className="cyber-button cyber-button-destructive w-full text-sm">
                          Reset All
                      </button>
                  </div>
                </div>
            </aside>

            {/* Canvas */}
            <main ref={canvasRef} onDragOver={handleDragOver} onDrop={handleDrop} className="flex-grow relative overflow-hidden bg-grid-pattern">
                <svg className="absolute w-full h-full pointer-events-none z-0">
                    {connections.map(({ from, to }, i) => {
                        const fromPos = getComponentPosition(from);
                        const toPos = getComponentPosition(to);
                        const isSimulating = simulationState.path.includes(from) && simulationState.path.includes(to);
                        return <line key={i} x1={fromPos.x} y1={fromPos.y} x2={toPos.x} y2={toPos.y} className={`stroke-current transition-all duration-300 ${isSimulating ? 'text-green-400 stroke-2 shadow-[0_0_8px_#4ade80]' : 'text-blue-500/50'}`}/>;
                    })}
                </svg>

                {getPacketPosition() && (
                    <div className="absolute w-4 h-4 rounded-full bg-yellow-300 shadow-lg pointer-events-none z-10" style={{ left: getPacketPosition()!.x - 8, top: getPacketPosition()!.y - 8, filter: 'drop-shadow(0 0 5px #facc15)' }}></div>
                )}
                
                {components.map(c => {
                    const Icon = PALETTE_COMPONENTS.find(p => p.type === c.type)!.icon;
                    return (
                        <div key={c.id} style={{ left: c.x, top: c.y }} className="absolute group" onClick={(e) => {
                            if (actionState) {
                                e.stopPropagation();
                                if (actionState.type === 'ping') startSimulation(actionState.sourceId, c.id, 'ping');
                                if (actionState.type === 'share' && c.type === 'server' && c.config.serverRoles?.includes('file_share')) startSimulation(actionState.sourceId, c.id, 'smb');
                                setActionState(null);
                            }
                        }}>
                             <div 
                                onMouseDown={(e) => handleMouseDown(e, c.id)}
                                className={`w-24 h-24 p-2 border border-blue-900/50 cursor-pointer flex flex-col items-center justify-center transition-all duration-300 ${c.isErrorSource ? 'border-red-500' : 'border-blue-900/50'} ${connectingFrom === c.id || configPanelId === c.id ? 'bg-blue-900/50 border-blue-400' : 'bg-gray-900/50'} hover:border-blue-400 hover:shadow-[0_0_10px_rgba(96,165,250,0.3)]`}>
                                <Icon className="w-10 h-10 text-blue-400 mb-2 group-hover:text-blue-300"/>
                                <span className="text-xs text-center font-semibold truncate w-full">{c.name}</span>
                                 <div className={`absolute top-1 left-1 w-3 h-3 rounded-full border-2 border-gray-900 ${getStatusColor(c.status)}`}></div>
                            </div>
                            <div className="absolute -top-2 -right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                <button onClick={(e) => { e.stopPropagation(); handleConnectionClick(c.id); }} className={`px-2 py-1 text-xs font-mono text-white transition-colors ${connectingFrom === c.id ? 'bg-yellow-500' : 'bg-blue-600 hover:bg-blue-500'}`}>Connect</button>
                                {PALETTE_COMPONENTS.find(p => p.type === c.type)?.configurable && <button onClick={(e) => { e.stopPropagation(); setConfigPanelId(c.id); }} className="px-2 py-1 text-xs font-mono bg-gray-600 hover:bg-gray-500 text-white transition-colors">Config</button>}
                            </div>
                            {c.type === 'pc' && (
                                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                    <button onClick={() => handlePcAction('ping', c.id)} title="Ping" className="px-2 py-1 text-xs rounded font-mono bg-green-600 hover:bg-green-500 text-white">Ping</button>
                                    <button onClick={() => handlePcAction('browse', c.id)} title="Browse Web" className="px-2 py-1 text-xs rounded font-mono bg-blue-600 hover:bg-blue-500 text-white">Browse</button>
                                    <button onClick={() => handlePcAction('share', c.id)} title="Access File Share" className="px-2 py-1 text-xs rounded font-mono bg-purple-600 hover:bg-purple-500 text-white">Share</button>
                                    <button onClick={() => handlePcAction('cli', c.id)} title="Open Terminal" className="px-2 py-1 text-xs rounded font-mono bg-gray-600 hover:bg-gray-500 text-white">CLI</button>
                                </div>
                            )}
                        </div>
                    );
                })}

                {isMobileView && (
                    <div className="absolute top-4 left-4 p-4 border border-yellow-500/50 bg-gray-900/80 max-w-xs text-sm">
                        <p className="flex items-center gap-2"><AlertTriangleIcon className="w-5 h-5 text-yellow-400" /> <strong className="text-yellow-300">Mobile View Detected</strong></p>
                        <p className="mt-2 text-gray-300">This interactive tool is best experienced on a larger screen. Some features may be limited.</p>
                    </div>
                )}
                
                {cliState.isOpen && cliState.sourceId && (
                    <SimulatedTerminal 
                        sourceComponent={components.find(c => c.id === cliState.sourceId)!} 
                        onClose={() => setCliState({ isOpen: false, sourceId: null })}
                        runSimulation={startSimulation}
                        findComponent={findComponent}
                        getDhcpServer={getDhcpServer}
                    />
                )}
                 {/* Config Panel */}
                {configPanelId && renderConfigPanel()}
            </main>
        </div>

        {/* Footer / Status Bar */}
         <footer className="w-full bg-gray-900/50 backdrop-blur-lg border-t border-blue-900/50 p-1.5 flex items-center z-30 flex-shrink-0">
           {simulationState.status !== 'idle' && (
                <div className={`font-mono text-sm px-2 animate-fade-in ${simulationState.status === 'success' ? 'text-green-400' : simulationState.status === 'fail' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {simulationState.status.toUpperCase()}: {simulationState.message}
                </div>
           )}
           {feedback && (
                <div className={`font-mono text-sm px-2 animate-fade-in ${feedback.type === 'success' ? 'text-green-400' : feedback.type === 'error' ? 'text-red-400' : 'text-yellow-400'}`}>
                   {feedback.message}
                </div>
           )}
        </footer>
    </div>
  );
};

export default InfrastructureBuilder;