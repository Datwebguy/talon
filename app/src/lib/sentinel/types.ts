export type SentinelStrategy = 
  | "earnings-shield"
  | "accretion-maximizer"
  | "invariant-arbitrage";

export interface DynamicSessionPolicy {
  sessionKey: `0x${string}`;
  userAddress: `0x${string}`;
  maxSpendUSD: number;
  maxSlippageBps: number;
  allowedContracts: `0x${string}`[];
  expiresAt: number;
  active: boolean;
}

export interface SentinelExecutionLog {
  id: string;
  timestamp: number;
  strategy: SentinelStrategy;
  action: "TEAR" | "JOIN" | "FLASH_HEDGE" | "REBALANCE" | "PARITY_CHECK";
  asset: string;
  amount: string;
  status: "CONFIRMED" | "PENDING" | "SIMULATED";
  txHash?: `0x${string}`;
  details: string;
  explorerUrl?: string;
}

export interface StockRiskMetrics {
  symbol: string;
  name: string;
  underlyingAddress: `0x${string}`;
  vaultAddress: `0x${string}`;
  clipAddress: `0x${string}`;
  talonAddress: `0x${string}`;
  spotPriceUSD: number;
  multiplier: number;
  earningsDate: string;
  daysToEarnings: number;
  impliedVolatility: number;
  riskStatus: "NORMAL" | "ELEVATED" | "CRITICAL_SHIELD_ACTIVE";
}
