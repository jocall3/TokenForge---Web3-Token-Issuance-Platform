
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import Card from '../components/Card';
import { 
    FaDollarSign, FaEthereum, FaClock, FaExchangeAlt, FaBurn, FaPlayCircle, FaPauseCircle, 
    FaNetworkWired, FaCode, FaChartLine, FaCloudDownloadAlt, FaFileCode, FaLock, FaGlobe, 
    FaCogs, FaProjectDiagram, FaBalanceScale, FaUsers, FaChartBar, FaWallet, FaSpinner, 
    FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaBell, FaPlus, FaTimes, FaCalculator,
    FaShieldAlt, FaVoteYea, FaFlag, FaBriefcase, FaBan, FaInfoCircle
} from 'react-icons/fa';
import { 
    TokenConfig, TokenAllocation, DeploymentConfig, DeploymentStatus, 
    AirdropCampaign, GovernanceProposal, AllocationType, VestingSchedule, NetworkConfig 
} from '../types';
import { 
    ExportedProgressBar, ExportedTooltip, ExportedInput, ExportedTextArea, 
    ExportedSelect, ExportedCheckbox, ExportedButton, ExportedChart
} from '../components/UI';
import { generateTokenomicsModel } from '../services/geminiService';

// --- Context for Global State Management ---
interface TokenIssuanceContextType {
    currentTokenConfig: TokenConfig | null;
    setCurrentTokenConfig: React.Dispatch<React.SetStateAction<TokenConfig | null>>;
    tokenAllocations: TokenAllocation[];
    setTokenAllocations: React.Dispatch<React.SetStateAction<TokenAllocation[]>>;
    deploymentConfigs: DeploymentConfig[];
    setDeploymentConfigs: React.Dispatch<React.SetStateAction<DeploymentConfig[]>>;
    deploymentHistory: DeploymentStatus[];
    setDeploymentHistory: React.Dispatch<React.SetStateAction<DeploymentStatus[]>>;
    aiGeneratedTokenomics: any | null;
    setAiGeneratedTokenomics: React.Dispatch<React.SetStateAction<any | null>>;
    activeAirdropCampaigns: AirdropCampaign[];
    setActiveAirdropCampaigns: React.Dispatch<React.SetStateAction<AirdropCampaign[]>>;
    activeGovernanceProposals: GovernanceProposal[];
    setActiveGovernanceProposals: React.Dispatch<React.SetStateAction<GovernanceProposal[]>>;
    availableNetworks: NetworkConfig[];
    addCustomNetwork: (network: NetworkConfig) => void;
    showNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const TokenIssuanceContext = createContext<TokenIssuanceContextType | undefined>(undefined);

const useTokenIssuance = () => {
    const context = useContext(TokenIssuanceContext);
    if (!context) throw new Error('useTokenIssuance must be used within a TokenIssuanceProvider');
    return context;
};

// --- Step Components ---

const TokenDefinitionForm: React.FC<{ onNext: () => void }> = ({ onNext }) => {
    const { currentTokenConfig, setCurrentTokenConfig, aiGeneratedTokenomics, showNotification } = useTokenIssuance();
    const [formState, setFormState] = useState<TokenConfig>(currentTokenConfig || {
        id: 'new-token-' + Date.now(),
        name: '', symbol: '', description: '', type: 'ERC-20',
        totalSupply: 0, decimals: 18, socialLinks: {},
        features: { mintable: false, burnable: true, pausable: false, upgradable: false, snapshots: false, permit: false },
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (aiGeneratedTokenomics && !currentTokenConfig) {
            setFormState(prev => ({
                ...prev,
                name: aiGeneratedTokenomics.name || prev.name,
                symbol: aiGeneratedTokenomics.symbol || prev.symbol,
                totalSupply: aiGeneratedTokenomics.totalSupply || prev.totalSupply,
                description: aiGeneratedTokenomics.description || prev.description,
                aiGeneratedNotes: JSON.stringify(aiGeneratedTokenomics, null, 2),
            }));
            showNotification('Token details pre-filled by AI!', 'info');
        }
    }, [aiGeneratedTokenomics, currentTokenConfig]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormState(prev => ({ ...prev, features: { ...prev.features, [name]: checked } }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formState.name) newErrors.name = 'Required';
        if (!formState.symbol || formState.symbol.length < 2) newErrors.symbol = 'Symbol too short';
        if (formState.totalSupply <= 0 && formState.type === 'ERC-20') newErrors.totalSupply = 'Must be > 0';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <Card title="1. Define Your Token" icon={<FaDollarSign />}>
            <form onSubmit={(e) => { e.preventDefault(); if (validate()) { setCurrentTokenConfig(formState); onNext(); } }} className="space-y-6">
                <ExportedInput label="Token Name" name="name" value={formState.name} onChange={handleChange} error={errors.name} />
                <div className="grid grid-cols-2 gap-4">
                    <ExportedInput label="Symbol" name="symbol" value={formState.symbol} onChange={handleChange} error={errors.symbol} />
                    <ExportedSelect label="Type" name="type" value={formState.type} onChange={handleChange} options={[
                        { value: 'ERC-20', label: 'ERC-20' }, { value: 'ERC-721', label: 'ERC-721' }, { value: 'ERC-1155', label: 'ERC-1155' }
                    ]} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <ExportedInput label="Total Supply" type="number" name="totalSupply" value={formState.totalSupply || ''} onChange={handleChange} error={errors.totalSupply} />
                    <ExportedInput label="Decimals" type="number" name="decimals" value={formState.decimals} onChange={handleChange} />
                </div>
                <ExportedTextArea label="Description" name="description" value={formState.description} onChange={handleChange} rows={3} />
                
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Features</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-700">
                    <ExportedCheckbox label={<ExportedTooltip content="Allow minting new tokens post-deploy.">Mintable</ExportedTooltip>} name="mintable" checked={formState.features.mintable} onChange={handleFeatureChange} />
                    <ExportedCheckbox label="Burnable" name="burnable" checked={formState.features.burnable} onChange={handleFeatureChange} />
                    <ExportedCheckbox label="Pausable" name="pausable" checked={formState.features.pausable} onChange={handleFeatureChange} />
                    <ExportedCheckbox label="Upgradable" name="upgradable" checked={formState.features.upgradable} onChange={handleFeatureChange} />
                    <ExportedCheckbox label="Snapshots" name="snapshots" checked={formState.features.snapshots} onChange={handleFeatureChange} />
                    <ExportedCheckbox label="Permit" name="permit" checked={formState.features.permit} onChange={handleFeatureChange} />
                </div>

                <div className="flex justify-end pt-4">
                    <ExportedButton type="submit">Continue to Tokenomics</ExportedButton>
                </div>
            </form>
        </Card>
    );
};

const TokenomicsAllocationForm: React.FC<{ onNext: () => void; onPrev: () => void }> = ({ onNext, onPrev }) => {
    const { currentTokenConfig, tokenAllocations, setTokenAllocations, aiGeneratedTokenomics } = useTokenIssuance();
    const [allocs, setAllocs] = useState<TokenAllocation[]>(tokenAllocations.length ? tokenAllocations : []);
    const [newType, setNewType] = useState<AllocationType>('Team');
    const [newPct, setNewPct] = useState(0);

    const totalPct = allocs.reduce((s, a) => s + a.percentage, 0);

    useEffect(() => {
        if (aiGeneratedTokenomics?.allocation && !allocs.length) {
            const mapped = Object.entries(aiGeneratedTokenomics.allocation).map(([k, v]) => ({
                type: (k.charAt(0).toUpperCase() + k.slice(1)) as AllocationType,
                percentage: v as number,
                amount: ((v as number) / 100) * (currentTokenConfig?.totalSupply || 0)
            }));
            setAllocs(mapped);
        }
    }, [aiGeneratedTokenomics]);

    const addAlloc = () => {
        if (newPct <= 0 || totalPct + newPct > 100) return;
        setAllocs([...allocs, { type: newType, percentage: newPct, amount: (newPct / 100) * (currentTokenConfig?.totalSupply || 0) }]);
        setNewPct(0);
    };

    return (
        <Card title="2. Tokenomics & Allocation" icon={<FaProjectDiagram />}>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-3">
                        {allocs.map((a, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                                <div><span className="font-semibold text-slate-100">{a.type}</span> <span className="text-slate-500 text-xs ml-2">{a.percentage}%</span></div>
                                <button onClick={() => setAllocs(allocs.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-300 text-xs uppercase font-bold">Remove</button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="bg-slate-800/40 p-4 rounded-xl space-y-4 border border-slate-700">
                        <ExportedSelect label="New Category" value={newType} options={[
                            { value: 'Team', label: 'Team' }, { value: 'Ecosystem', label: 'Ecosystem' }, { value: 'Marketing', label: 'Marketing' }, { value: 'Investors (Seed)', label: 'Seed Investors' }
                        ]} onChange={e => setNewType(e.target.value as AllocationType)} />
                        <ExportedInput label="Percentage" type="number" value={newPct || ''} onChange={e => setNewPct(parseFloat(e.target.value))} />
                        <ExportedButton variant="secondary" onClick={addAlloc} className="w-full">Add Allocation</ExportedButton>
                    </div>

                    <div className="flex justify-between items-center px-2">
                        <span className="text-sm font-medium text-slate-400">Total Allocated:</span>
                        <span className={`text-lg font-bold ${totalPct === 100 ? 'text-green-400' : 'text-yellow-400'}`}>{totalPct.toFixed(2)}%</span>
                    </div>
                </div>

                <div className="flex flex-col justify-center">
                    <ExportedChart title="Allocation Distribution" data={allocs.map(a => ({ label: a.type, value: a.percentage, color: '#06b6d4' }))} />
                </div>
            </div>

            <div className="flex justify-between pt-8 mt-8 border-t border-slate-800">
                <ExportedButton variant="secondary" onClick={onPrev}>Back</ExportedButton>
                <ExportedButton onClick={() => { setTokenAllocations(allocs); onNext(); }} disabled={totalPct !== 100}>Next Step</ExportedButton>
            </div>
        </Card>
    );
};

// Simplified steps for rest of the flow...

const SmartContractConfig: React.FC<{ onNext: () => void; onPrev: () => void }> = ({ onNext, onPrev }) => {
    return (
        <Card title="3. Smart Contract Configuration" icon={<FaFileCode />}>
            <p className="text-slate-400 mb-6">Your contract will be built using audited OpenZeppelin templates. We are preparing the core logic modules based on your selected features.</p>
            <div className="space-y-4 p-6 bg-slate-900/60 rounded-2xl border border-slate-700 font-mono text-xs text-cyan-400 overflow-auto max-h-48">
                <code>{`// Contract scaffolding...
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ForgeToken is ERC20, Ownable {
    constructor() ERC20("Forge", "FRG") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}`}</code>
            </div>
            <div className="flex justify-between pt-8 mt-8">
                <ExportedButton variant="secondary" onClick={onPrev}>Back</ExportedButton>
                <ExportedButton onClick={onNext}>Review & Deploy</ExportedButton>
            </div>
        </Card>
    );
};

const DeploymentSettings: React.FC<{ onNext: () => void; onPrev: () => void }> = ({ onNext, onPrev }) => {
    const { availableNetworks } = useTokenIssuance();
    const [net, setNet] = useState(availableNetworks[0].id);

    return (
        <Card title="4. Deployment Settings" icon={<FaNetworkWired />}>
            <div className="grid md:grid-cols-2 gap-6">
                <ExportedSelect label="Target Network" value={net} options={availableNetworks.map(n => ({ value: n.id, label: n.name }))} onChange={e => setNet(e.target.value)} />
                <ExportedInput label="Owner Address" placeholder="0x..." />
                <ExportedSelect label="Gas Strategy" options={[
                    { value: 'standard', label: 'Standard' }, { value: 'fast', label: 'Fast' }
                ]} />
                <ExportedCheckbox label="Enable Front-run Protection" checked={true} readOnly />
            </div>
            <div className="flex justify-between pt-8 mt-8">
                <ExportedButton variant="secondary" onClick={onPrev}>Back</ExportedButton>
                <ExportedButton onClick={onNext}>Deploy Contract</ExportedButton>
            </div>
        </Card>
    );
};

const DeploymentMonitor: React.FC<{ onNext: () => void; onPrev: () => void }> = ({ onNext, onPrev }) => {
    const [status, setStatus] = useState<'pending' | 'deploying' | 'completed'>('pending');

    useEffect(() => {
        const t1 = setTimeout(() => setStatus('deploying'), 2000);
        const t2 = setTimeout(() => setStatus('completed'), 6000);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    return (
        <Card title="5. Deployment Monitor" icon={<FaEthereum />}>
            <div className="flex flex-col items-center py-12 space-y-6">
                <div className="relative">
                    {status !== 'completed' ? (
                        <div className="w-24 h-24 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                    ) : (
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-xl shadow-green-900/30">
                            <FaCheckCircle className="text-4xl text-white" />
                        </div>
                    )}
                </div>
                <div className="text-center">
                    <h4 className="text-xl font-bold text-slate-100">{status.toUpperCase()}</h4>
                    <p className="text-slate-400 mt-2">
                        {status === 'pending' && "Initializing transaction..."}
                        {status === 'deploying' && "Pushing smart contract to network..."}
                        {status === 'completed' && "Successfully deployed to Ethereum Mainnet!"}
                    </p>
                </div>
                {status === 'completed' && (
                    <div className="w-full bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-2 font-mono text-xs">
                        <div className="flex justify-between"><span className="text-slate-500">Address:</span> <span className="text-cyan-400">0x742d...44e</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Hash:</span> <span className="text-cyan-400">0x9f31...6b2</span></div>
                    </div>
                )}
            </div>
            <div className="flex justify-between mt-8 border-t border-slate-800 pt-8">
                <ExportedButton variant="secondary" onClick={onPrev}>Back</ExportedButton>
                <ExportedButton onClick={onNext} disabled={status !== 'completed'}>Go to Dashboard</ExportedButton>
            </div>
        </Card>
    );
};

const PostIssuanceDashboard: React.FC = () => {
    const { currentTokenConfig } = useTokenIssuance();
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 shadow-xl">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">Total Supply</div>
                    <div className="text-2xl font-bold text-slate-100">{currentTokenConfig?.totalSupply?.toLocaleString()} <span className="text-sm text-cyan-400">{currentTokenConfig?.symbol}</span></div>
                </div>
                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 shadow-xl">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">Circulating</div>
                    <div className="text-2xl font-bold text-slate-100">{(currentTokenConfig?.totalSupply || 0) * 0.4}</div>
                </div>
                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 shadow-xl">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">Burned</div>
                    <div className="text-2xl font-bold text-red-400">12,500</div>
                </div>
                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 shadow-xl">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">Holders</div>
                    <div className="text-2xl font-bold text-cyan-400">1,248</div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card title="Quick Management" className="md:col-span-1" icon={<FaCogs />}>
                    <div className="space-y-4">
                        <ExportedButton variant="primary" className="w-full" icon={<FaPlus />}>Mint Tokens</ExportedButton>
                        <ExportedButton variant="danger" className="w-full" icon={<FaBurn />}>Burn Tokens</ExportedButton>
                        <ExportedButton variant="secondary" className="w-full" icon={<FaPauseCircle />}>Pause Transfers</ExportedButton>
                    </div>
                </Card>
                <Card title="Recent Activity" className="md:col-span-2" icon={<FaChartLine />}>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-900/30 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <FaExchangeAlt className="text-blue-400" />
                                <div className="text-xs text-slate-300">Token Transfer (150 FRG)</div>
                            </div>
                            <span className="text-xs text-slate-500">2 mins ago</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-900/30 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <FaBurn className="text-red-400" />
                                <div className="text-xs text-slate-300">Tokens Burned (5 FRG)</div>
                            </div>
                            <span className="text-xs text-slate-500">14 mins ago</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

// --- Main Platform Component ---

const TokenIssuanceView: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [currentTokenConfig, setCurrentTokenConfig] = useState<TokenConfig | null>(null);
    const [tokenAllocations, setTokenAllocations] = useState<TokenAllocation[]>([]);
    const [deploymentConfigs, setDeploymentConfigs] = useState<DeploymentConfig[]>([]);
    const [deploymentHistory, setDeploymentHistory] = useState<DeploymentStatus[]>([]);
    const [aiGeneratedTokenomics, setAiGeneratedTokenomics] = useState<any>(null);
    const [activeAirdropCampaigns, setActiveAirdropCampaigns] = useState<AirdropCampaign[]>([]);
    const [activeGovernanceProposals, setActiveGovernanceProposals] = useState<GovernanceProposal[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratorOpen, setGeneratorOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');

    const initialNetworks: NetworkConfig[] = [
        { id: 'eth-mainnet', name: 'Ethereum Mainnet', chainId: 1, rpcUrl: '', blockExplorerUrl: 'https://etherscan.io' },
        { id: 'sepolia', name: 'Sepolia Testnet', chainId: 11155111, rpcUrl: '', blockExplorerUrl: 'https://sepolia.etherscan.io' },
        { id: 'polygon', name: 'Polygon PoS', chainId: 137, rpcUrl: '', blockExplorerUrl: 'https://polygonscan.com' },
    ];
    const [availableNetworks, setAvailableNetworks] = useState<NetworkConfig[]>(initialNetworks);

    const steps = [
        "Definition", "Tokenomics", "Contract", "Settings", "Deploy", "Dashboard"
    ];

    const showNotification = (msg: string, type: string) => { console.log(`${type}: ${msg}`); };

    const handleAIGenerate = async () => {
        setIsLoading(true);
        try {
            const result = await generateTokenomicsModel(aiPrompt);
            setAiGeneratedTokenomics(result);
            setGeneratorOpen(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TokenIssuanceContext.Provider value={{
            currentTokenConfig, setCurrentTokenConfig,
            tokenAllocations, setTokenAllocations,
            deploymentConfigs, setDeploymentConfigs,
            deploymentHistory, setDeploymentHistory,
            aiGeneratedTokenomics, setAiGeneratedTokenomics,
            activeAirdropCampaigns, setActiveAirdropCampaigns,
            activeGovernanceProposals, setActiveGovernanceProposals,
            availableNetworks, addCustomNetwork: (n) => setAvailableNetworks([...availableNetworks, n]),
            showNotification, isLoading, setIsLoading
        }}>
            <div className="max-w-5xl mx-auto space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Launch Your Protocol</h1>
                        <p className="text-slate-400 mt-1">Design, verify, and deploy institutional-grade smart contracts.</p>
                    </div>
                    <div className="flex space-x-3">
                        <ExportedButton variant="secondary" icon={<FaCalculator />} onClick={() => setGeneratorOpen(true)}>AI Modeler</ExportedButton>
                    </div>
                </div>

                <ExportedProgressBar steps={steps} currentStep={currentStep} />

                <div className="transition-all duration-500 transform">
                    {currentStep === 0 && <TokenDefinitionForm onNext={() => setCurrentStep(1)} />}
                    {currentStep === 1 && <TokenomicsAllocationForm onNext={() => setCurrentStep(2)} onPrev={() => setCurrentStep(0)} />}
                    {currentStep === 2 && <SmartContractConfig onNext={() => setCurrentStep(3)} onPrev={() => setCurrentStep(1)} />}
                    {currentStep === 3 && <DeploymentSettings onNext={() => setCurrentStep(4)} onPrev={() => setCurrentStep(2)} />}
                    {currentStep === 4 && <DeploymentMonitor onNext={() => setCurrentStep(5)} onPrev={() => setCurrentStep(3)} />}
                    {currentStep === 5 && <PostIssuanceDashboard />}
                </div>

                {isGeneratorOpen && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-slate-800 border border-slate-700 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center"><FaCalculator className="text-white text-sm" /></div>
                                    <h3 className="font-bold text-xl text-slate-100">AI Tokenomics Wizard</h3>
                                </div>
                                <button onClick={() => setGeneratorOpen(false)} className="text-slate-400 hover:text-white transition-colors"><FaTimes size={20} /></button>
                            </div>
                            <div className="p-8 space-y-6">
                                <ExportedTextArea 
                                    label="Describe your project vision" 
                                    placeholder="e.g. A decentralized storage network where users pay in tokens for capacity..."
                                    value={aiPrompt}
                                    onChange={e => setAiPrompt(e.target.value)}
                                    rows={4}
                                />
                                <div className="flex gap-4">
                                    <ExportedButton variant="secondary" className="flex-1" onClick={() => setGeneratorOpen(false)}>Cancel</ExportedButton>
                                    <ExportedButton loading={isLoading} className="flex-[2]" onClick={handleAIGenerate}>Generate Model</ExportedButton>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </TokenIssuanceContext.Provider>
    );
};

export default TokenIssuanceView;
