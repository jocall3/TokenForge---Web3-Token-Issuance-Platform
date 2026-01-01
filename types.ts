
export interface TokenConfig {
    id: string;
    name: string;
    symbol: string;
    description: string;
    type: 'ERC-20' | 'ERC-721' | 'ERC-1155' | 'Custom';
    totalSupply: number;
    decimals: number;
    initialSupply?: number;
    contractURI?: string;
    baseTokenURI?: string;
    logoUrl?: string;
    websiteUrl?: string;
    socialLinks: { twitter?: string; telegram?: string; discord?: string; github?: string; };
    features: {
        mintable: boolean;
        burnable: boolean;
        pausable: boolean;
        upgradable: boolean;
        snapshots: boolean;
        permit: boolean;
        flashMint?: boolean;
        erc1363?: boolean;
        governanceModule?: boolean;
    };
    aiGeneratedNotes?: string;
}

export type AllocationType = 'Team' | 'Investors (Seed)' | 'Investors (Private)' | 'Investors (Public)' | 'Ecosystem' | 'Treasury' | 'Advisors' | 'Marketing' | 'Liquidity' | 'Staking Rewards' | 'Community' | 'Airdrop';

export interface VestingSchedule {
    id: string;
    amount: number;
    cliff: number; 
    duration: number; 
    releaseFrequency: 'monthly' | 'quarterly' | 'daily' | 'linear';
    startDate: string; 
    recipientAddresses: string[];
    description?: string;
}

export interface TokenAllocation {
    type: AllocationType;
    percentage: number;
    amount: number;
    vestingSchedule?: VestingSchedule;
    isLocked?: boolean;
    lockUntil?: string;
    details?: string;
}

export interface NetworkConfig {
    id: string;
    name: string;
    chainId: number;
    rpcUrl: string;
    blockExplorerUrl: string;
    isCustom?: boolean;
}

export interface DeploymentConfig {
    network: NetworkConfig;
    ownerAddress: string;
    gasPriceStrategy: 'standard' | 'fast' | 'custom';
    customGasPriceGwei?: number;
    frontRunProtection: boolean;
    proxyAdminAddress?: string;
    salt?: string;
}

export interface DeploymentStatus {
    id: string;
    timestamp: string;
    status: 'pending' | 'deploying' | 'verifying' | 'completed' | 'failed';
    transactionHash?: string;
    contractAddress?: string;
    blockNumber?: number;
    error?: string;
    networkId: string;
    tokenConfigId: string;
}

export interface AirdropCampaign {
    id: string;
    name: string;
    tokenAddress: string;
    snapshotBlockNumber?: number;
    recipients: { address: string; amount: number; }[];
    totalAirdropAmount: number;
    status: 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';
    scheduleDate?: string;
    transactionHash?: string;
    description?: string;
    proofGenerationType: 'merkleTree' | 'directTransfer';
}

export interface GovernanceProposal {
    id: string;
    title: string;
    description: string;
    proposer: string;
    status: 'pending' | 'active' | 'executed' | 'defeated' | 'cancelled';
    startTime: string;
    endTime: string;
    snapshotBlock: number;
    quorum: number;
    threshold: number;
    votesFor: number;
    votesAgainst: number;
    votesAbstain: number;
    executedTransaction?: string;
}
