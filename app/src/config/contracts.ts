export const OFFICIAL_TOKENS = [
  {
    symbol: "AAPLc",
    name: "Apple Tokenized Stock (Coinbase)",
    address: "0xb200000000000000000000C2e324d24d7eEcd1fb" as `0x${string}`,
    feed: "0x787f13dEa48Db0897CbCDD985de77809D837F988" as `0x${string}`,
    decimals: 8,
    active: true,
  },
  {
    symbol: "NVDAc",
    name: "NVIDIA Tokenized Stock (Coinbase)",
    address: "0xb20000000000000000000078ee7ce2fE4908108C" as `0x${string}`,
    feed: undefined,
    decimals: 8,
    active: false,
  },
  {
    symbol: "GOOGLc",
    name: "Alphabet Tokenized Stock (Coinbase)",
    address: "0xb2000000000000000000002D0BA3164cc74f58B7" as `0x${string}`,
    feed: undefined,
    decimals: 8,
    active: false,
  },
  {
    symbol: "METAc",
    name: "Meta Tokenized Stock (Coinbase)",
    address: "0xb2000000000000000000008bC8786B856E61707C" as `0x${string}`,
    feed: undefined,
    decimals: 8,
    active: false,
  },
];

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
