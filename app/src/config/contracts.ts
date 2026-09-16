export const OFFICIAL_TOKENS = [
  {
    symbol: "AAPLc",
    name: "Apple Tokenized Stock (Coinbase)",
    address: "0xb200000000000000000000C2e324d24d7eEcd1fb" as `0x${string}`,
    feed: "0x787f13dEa48Db0897CbCDD985de77809D837F988" as `0x${string}`,
    decimals: 8,
    active: true,
    isFactoryAllowlisted: true,
    hasDeployedVault: true,
  },
  {
    symbol: "NVDAc",
    name: "NVIDIA Tokenized Stock (Coinbase)",
    address: "0xb20000000000000000000078ee7ce2fE4908108C" as `0x${string}`,
    feed: undefined,
    decimals: 8,
    active: true,
    isFactoryAllowlisted: true,
    hasDeployedVault: false,
  },
  {
    symbol: "GOOGLc",
    name: "Alphabet Tokenized Stock (Coinbase)",
    address: "0xb2000000000000000000002D0BA3164cc74f58B7" as `0x${string}`,
    feed: undefined,
    decimals: 8,
    active: true,
    isFactoryAllowlisted: true,
    hasDeployedVault: false,
  },
  {
    symbol: "METAc",
    name: "Meta Tokenized Stock (Coinbase)",
    address: "0xb2000000000000000000008bC8786B856E61707C" as `0x${string}`,
    feed: undefined,
    decimals: 8,
    active: true,
    isFactoryAllowlisted: true,
    hasDeployedVault: false,
  },
  {
    symbol: "AMZNc",
    name: "Amazon Tokenized Stock (Coinbase)",
    address: "0xb200000000000000000000d9192b6B456483C2E8" as `0x${string}`,
    feed: undefined,
    decimals: 8,
    active: true,
    isFactoryAllowlisted: false,
    hasDeployedVault: false,
  },
  {
    symbol: "MSFTc",
    name: "Microsoft Tokenized Stock (Coinbase)",
    address: "0xB200000000000000000000Ab99cFa739E253872B" as `0x${string}`,
    feed: undefined,
    decimals: 8,
    active: true,
    isFactoryAllowlisted: false,
    hasDeployedVault: false,
  },
  {
    symbol: "MSTRc",
    name: "Strategy Tokenized Stock (Coinbase)",
    address: "0xb2000000000000000000004884b426556b92883d" as `0x${string}`,
    feed: undefined,
    decimals: 8,
    active: true,
    isFactoryAllowlisted: false,
    hasDeployedVault: false,
  },
  {
    symbol: "SNDKc",
    name: "SanDisk Tokenized Stock (Coinbase)",
    address: "0xb200000000000000000000397293Cb8cda9a10c5" as `0x${string}`,
    feed: undefined,
    decimals: 8,
    active: true,
    isFactoryAllowlisted: false,
    hasDeployedVault: false,
  },
  {
    symbol: "SPCXc",
    name: "SPACEX Tokenized Stock (Coinbase)",
    address: "0xb2000000000000000000007b9fcbd005511aCBd5" as `0x${string}`,
    feed: undefined,
    decimals: 8,
    active: true,
    isFactoryAllowlisted: false,
    hasDeployedVault: false,
  },
  {
    symbol: "TSLAc",
    name: "Tesla Tokenized Stock (Coinbase)",
    address: "0xb2000000000000000000001e800a7f5189430cD0" as `0x${string}`,
    feed: undefined,
    decimals: 8,
    active: true,
    isFactoryAllowlisted: false,
    hasDeployedVault: false,
  },
];

export const OFFICIAL_MARKET_PAIRS = {
  AAPLc: {
    venue: "Aerodrome",
    quote: "USDC",
    pairAddress: "0xA3b1E3f9747065e2073722Ff4c9027d3eA4994F0" as `0x${string}`,
    url: "https://dexscreener.com/base/0xa3b1e3f9747065e2073722ff4c9027d3ea4994f0",
  },
  NVDAc: {
    venue: "Aerodrome",
    quote: "USDC",
    pairAddress: "0x853F5f1B92b16714Fe6CDA67CAad0856B83C7ab9" as `0x${string}`,
    url: "https://dexscreener.com/base/0x853f5f1b92b16714fe6cda67caad0856b83c7ab9",
  },
  GOOGLc: {
    venue: "Aerodrome",
    quote: "USDC",
    pairAddress: "0xB1987CAD1682841b4b641d50E520777eC5Ab5542" as `0x${string}`,
    url: "https://dexscreener.com/base/0xb1987cad1682841b4b641d50e520777ec5ab5542",
  },
  METAc: {
    venue: "Aerodrome",
    quote: "USDC",
    pairAddress: "0xEAF57753BC382E0324a1D43F72E7027705a2273E" as `0x${string}`,
    url: "https://dexscreener.com/base/0xeaf57753bc382e0324a1d43f72e7027705a2273e",
  },
  AMZNc: {
    venue: "Aerodrome",
    quote: "USDC",
    pairAddress: "0xd03Bc8C7F2FAedCe2aac81bF0444AEA08Ea06E9b" as `0x${string}`,
    url: "https://dexscreener.com/base/0xd03bc8c7f2faedce2aac81bf0444aea08ea06e9b",
  },
  MSFTc: {
    venue: "Aerodrome",
    quote: "USDC",
    pairAddress: "0x7103eB3c9590d1281f7dc03b2A9EE27C39dF5D54" as `0x${string}`,
    url: "https://dexscreener.com/base/0x7103eb3c9590d1281f7dc03b2a9ee27c39df5d54",
  },
  MSTRc: {
    venue: "Aerodrome",
    quote: "USDC",
    pairAddress: "0x8b27f626ab668197000BC722A1012022CAeD10E2" as `0x${string}`,
    url: "https://dexscreener.com/base/0x8b27f626ab668197000bc722a1012022caed10e2",
  },
  SNDKc: {
    venue: "Aerodrome",
    quote: "USDC",
    pairAddress: "0x5A8236f575471e7BfCA2C8462a200c28f737246E" as `0x${string}`,
    url: "https://dexscreener.com/base/0x5a8236f575471e7bfca2c8462a200c28f737246e",
  },
  SPCXc: {
    venue: "Aerodrome",
    quote: "USDC",
    pairAddress: "0x0bf58fe0FAc935Ac69595c19B12Ba0d75E3F8c0E" as `0x${string}`,
    url: "https://dexscreener.com/base/0x0bf58fe0fac935ac69595c19b12ba0d75e3f8c0e",
  },
  TSLAc: {
    venue: "Aerodrome",
    quote: "USDC",
    pairAddress: "0x469337fDcc5E8f38e2E4B670B04F57865D13a7BB" as `0x${string}`,
    url: "https://dexscreener.com/base/0x469337fdcc5e8f38e2e4b670b04f57865d13a7bb",
  },
} as const;

export const REGISTRY_ADDRESS = "0x3f3E8cf41cdd3b1D118c16471aB0113DfDDd5CaD" as `0x${string}`;
// Set by the deployment script for the eligibility-enforced factory deployment.
export const ELIGIBILITY_REGISTRY_ADDRESS = "0x932ab262AbbdCBEFa86D3166A5F987E5A79F757C" as `0x${string}`;
export const ELIGIBILITY_ENFORCED_DEPLOYMENT = true;
export const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`;

export const ELIGIBILITY_REGISTRY_ABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "isEligible",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const FACTORY_ADDRESS = "0x7e16011cafead7ffdc5cdd96e67b167f9b1f9711" as `0x${string}`;
export const AAPLC_VAULT_ADDRESS = "0x12bb3fFaBF1bE93D0BEAf39c069f3B87E7fc47cB" as `0x${string}`;
export const AAPLC_CLIP_ADDRESS = "0xd781e0594041c12618847b165acd552CeB1C1141" as `0x${string}`;
export const AAPLC_TALON_ADDRESS = "0x834600FFF5dC6097D7A2a443F1484Ff6228f532B" as `0x${string}`;
export const AAPLC_CREATE_VAULT_TX = "0x3d8e5e3c0c583e76db6dfc1be46af643966dceeecbe5e45b9435c8d4a2c0a8d8" as `0x${string}`;


export const B20_ABI = [
  {
    inputs: [],
    name: "multiplier",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "scaledBalanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "raw", type: "uint256" }],
    name: "toScaledBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "scaled", type: "uint256" }],
    name: "toRawBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const CHAINLINK_FEED_ABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const VAULT_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "rawAmount", type: "uint256" }],
    name: "tear",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "rawAmount", type: "uint256" }],
    name: "join",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "currentMultiplier",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVaultStats",
    outputs: [
      { internalType: "uint256", name: "totalRawBacking", type: "uint256" },
      { internalType: "uint256", name: "multiplier", type: "uint256" },
      { internalType: "uint8", name: "decimals_", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "underlying",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "clipToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "talonToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const FACTORY_ABI = [
  {
    inputs: [{ internalType: "address", name: "underlying", type: "address" }],
    name: "getVault",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "allVaultsLength",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "underlying", type: "address" }],
    name: "createVault",
    outputs: [{ internalType: "address", name: "vault", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const CLAIM_TOKEN_ABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "userIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "liveMultiplier", type: "uint256" },
    ],
    name: "userAccretion",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
