# Talon x Bankr Agent Skill Integration

> **Bankr Hackathon Project Submission** — Autonomous AI Agent Risk Engine for Coinbase Tokenized Equities on Base Mainnet.

[![Bankr Hackathon](https://img.shields.io/badge/Bankr%20Hackathon-Agent%20Track-FF5A00?style=for-the-badge&logo=robot)](https://bankr.bot)
[![Base Mainnet](https://img.shields.io/badge/Base%20Mainnet-8453-0052FF?style=for-the-badge)](https://basescan.org)
[![Live Sentinel & Copilot](https://img.shields.io/badge/Sentinel%20Copilot-Live-16A34A?style=for-the-badge)](https://talononbase.tech/app/sentinel)
[![Skill Manifest](https://img.shields.io/badge/Bankr%20Skill-Manifest-blue?style=for-the-badge)](app/src/lib/bankr/talon-skill.json)

---

## Executive Summary

**Talon** is an autonomous risk unbundling protocol deployed on **Base Mainnet (8453)** that lets holders of official **Coinbase Tokenized Stocks (B20)** split their assets into two independent onchain claims:
1. **Clip Token (`clipToken`)**: The corporate multiplier and dividend growth claim.
2. **Talon Token (`talonToken`)**: The pure market price exposure claim.

By integrating natively with **Bankr (`bankr.bot`)**, Talon equips conversational AI agents with specialized DeFi skills to monitor real-time equities risk, audit mathematical 1:1 parity on Base Mainnet, and execute autonomous protective hedging strategies before extreme volatility shocks (e.g., quarterly corporate earnings reports).

---

## Architecture: How Bankr Controls Talon

```
                        ┌───────────────────────────────┐
                        │      User / Autonomous        │
                        │        Agent Prompt           │
                        └───────────────┬───────────────┘
                                        │
                                        ▼
                        ┌───────────────────────────────┐
                        │     Bankr Agent Runtime       │
                        │         (bankr.bot)           │
                        └───────────────┬───────────────┘
                                        │
                         Matches against Skill Manifest
                         (talon-skill.json)
                                        │
                                        ▼
    ┌───────────────────────────────────────────────────────────────────────┐
    │                       Talon Agent Skill Tools                         │
    ├───────────────────┬───────────────────┬───────────────────────────────┤
    │ talon_get_status  │ talon_check_parity│ talon_activate_earnings_shield│
    └─────────┬─────────┴─────────┬─────────┴───────────────┬───────────────┘
              │                   │                         │
              │ Viem / RPC        │ Reads Onchain Balances  │ Calls TalonVault.tear()
              ▼                   ▼                         ▼
    ┌───────────────────────────────────────────────────────────────────────┐
    │                      Base Mainnet (Chain ID: 8453)                    │
    │  - Official Coinbase Tokenized Equities (AAPLc, NVDAc, GOOGLc)       │
    │  - TalonVault Contract: 0x12bb3fFaBF1bE93D0BEAf39c069f3B87E7fc47cB    │
    │  - clipAAPLc: 0xd781e0594041c12618847b165acd552CeB1C1141             │
    │  - talonAAPLc: 0x834600FFF5dC6097D7A2a443F1484Ff6228f532B            │
    └───────────────────────────────────────────────────────────────────────┘
```

---

## Official Bankr Skill Schema

The machine-readable Bankr Agent Skill specification is located at:
[`app/src/lib/bankr/talon-skill.json`](app/src/lib/bankr/talon-skill.json)

```json
{
  "name": "talon-onchain-equities",
  "version": "1.0.0",
  "description": "Autonomous risk management, unbundling, and 1:1 invariant arbitrage for Coinbase tokenized stocks on Base mainnet.",
  "author": "Talon Protocol",
  "network": "base",
  "chainId": 8453,
  "tools": [
    {
      "name": "talon_get_status",
      "description": "Get current risk metrics, B20 multiplier, and parity status for a tokenized Coinbase equity (e.g., AAPLc, NVDAc, TSLAc) on Base.",
      "parameters": {
        "type": "object",
        "properties": {
          "symbol": { "type": "string", "default": "AAPLc" }
        },
        "required": ["symbol"]
      }
    },
    {
      "name": "talon_activate_earnings_shield",
      "description": "Autonomously splits tokenized stock into clip (multiplier) and talon (price) before an earnings volatility shock, hedging the price leg into USDC to protect capital.",
      "parameters": {
        "type": "object",
        "properties": {
          "symbol": { "type": "string", "default": "AAPLc" },
          "amount": { "type": "string", "default": "1.0" },
          "maxDrawdownPercent": { "type": "number", "default": 5.0 }
        },
        "required": ["symbol", "amount"]
      }
    },
    {
      "name": "talon_recombine_stock",
      "description": "Recombines equal amounts of clip and talon tokens back into the underlying Coinbase tokenized stock 1:1 via TalonVault.join().",
      "parameters": {
        "type": "object",
        "properties": {
          "symbol": { "type": "string", "default": "AAPLc" },
          "amount": { "type": "string", "default": "1.0" }
        },
        "required": ["symbol", "amount"]
      }
    },
    {
      "name": "talon_check_parity",
      "description": "Audits the mathematical 1:1 invariant on Base mainnet (1 Underlying Stock == 1 clipToken + 1 talonToken) and detects arbitrage opportunities.",
      "parameters": {
        "type": "object",
        "properties": {
          "symbol": { "type": "string", "default": "AAPLc" }
        },
        "required": ["symbol"]
      }
    }
  ]
}
```

---

## The 4 Core Bankr Tools Explained

### 1. `talon_get_status`
Queries real-time asset health from Base Mainnet contracts:
- **Spot Price**: Fetched via Aerodrome DEX liquidity pools on Base.
- **B20 Corporate Multiplier**: Reads directly from Coinbase's equity contract (`multiplier()`).
- **Volatility Risk Status**: Computes implied volatility ahead of corporate announcements.
- **1:1 Invariant Health**: Confirms vault backing ratio is exactly 100%.

### 2. `talon_activate_earnings_shield`
Protects equity positions from earnings gap-downs without forfeiting dividend or multiplier rights:
1. Calls `TalonVault.tear()` on Base Mainnet.
2. Emits `clipToken` (multiplier claim) and `talonToken` (price claim).
3. Holds the `clipToken` to keep accumulating corporate growth.
4. Hedging action swaps the volatile `talonToken` into USDC.

### 3. `talon_recombine_stock`
Restores the underlying tokenized share:
1. Burns equal amounts of `clipToken` and `talonToken`.
2. Calls `TalonVault.join()` on Base Mainnet.
3. Releases the raw Coinbase Tokenized Stock (e.g. AAPLc) back to user custody.

### 4. `talon_check_parity`
Guarantees solvency and zero-slippage redemption:
- Reads the underlying vault balance, total clip supply, and total talon supply.
- Confirms the mathematical invariant:
  $$\text{Vault Backing} = \text{clipToken Supply} = \text{talonToken Supply}$$
- Alerts if any secondary AMM dislocation opens a riskless arbitrage opportunity.

---

## Sample Conversational Interaction

Users and agents can interact with the Talon Skill using conversational natural language:

### Prompt 1: Parity Audit
```text
User: "Audit 1:1 invariant parity for NVDAC on Base."

Bankr Agent (via talon_check_parity):
"Running Base Mainnet Invariant Audit for NVDAC...
✓ Vault Backing: 100.00%
✓ Formula Verified: 1.0 NVDAC == 1.0 clipNVDAC + 1.0 talonNVDAC
✓ Invariant Status: Solvency confirmed on Base (8453). Zero dislocation detected."
```

### Prompt 2: Earnings Volatility Shield
```text
User: "Shield my AAPLc position before the earnings call tomorrow."

Bankr Agent (via talon_activate_earnings_shield):
"High volatility risk detected (4 days to earnings report; IV > 40%).
Executing Earnings Shield for 1.0 AAPLc on Base Mainnet:
- Called TalonVault.tear(1.0 AAPLc)
- Minted 1.0 clipAAPLc (retaining corporate multiplier rights)
- Minted 1.0 talonAAPLc (price leg)
- Flashed-hedged talonAAPLc into USDC
Position shielded against gap-down risk. 100% non-custodial."
```

---

## Live Verification & Testing

Judges can verify and test the Bankr integration through multiple channels:

### 1. Web Application Copilot
Visit the live interactive Sentinel terminal at:
👉 **[https://talononbase.tech/app/sentinel](https://talononbase.tech/app/sentinel)**

- View live Base Mainnet metrics (block height, B20 multiplier, vault reserves).
- Send conversational commands to the Bankr Copilot in real time.
- Inspect the 1:1 invariant audit breakdown.

### 2. Autonomous Agent CLI Runner
Run the standalone agent runner that connects directly to Base Mainnet:

```bash
cd app
npx tsx scripts/run-sentinel.ts
```

### 3. Skill HTTP Endpoint
Inspect the machine-readable manifest directly:
👉 **[https://talononbase.tech/bankr-skill.json](https://talononbase.tech/bankr-skill.json)**

---

## Verified Base Mainnet Deployments

| Component | Address | Network | Explorer |
| :--- | :--- | :--- | :--- |
| **Talon Factory** | `0x7e16011cafead7ffdc5cdd96e67b167f9b1f9711` | Base (8453) | [BaseScan](https://basescan.org/address/0x7e16011cafead7ffdc5cdd96e67b167f9b1f9711) |
| **Eligibility Registry** | `0x932ab262AbbdCBEFa86D3166A5F987E5A79F757C` | Base (8453) | [BaseScan](https://basescan.org/address/0x932ab262AbbdCBEFa86D3166A5F987E5A79F757C) |
| **AAPLc Vault** | `0x12bb3fFaBF1bE93D0BEAf39c069f3B87E7fc47cB` | Base (8453) | [BaseScan](https://basescan.org/address/0x12bb3fFaBF1bE93D0BEAf39c069f3B87E7fc47cB) |
| **clipAAPLc Token** | `0xd781e0594041c12618847b165acd552CeB1C1141` | Base (8453) | [BaseScan](https://basescan.org/token/0xd781e0594041c12618847b165acd552CeB1C1141) |
| **talonAAPLc Token** | `0x834600FFF5dC6097D7A2a443F1484Ff6228f532B` | Base (8453) | [BaseScan](https://basescan.org/token/0x834600FFF5dC6097D7A2a443F1484Ff6228f532B) |
| **Official AAPLc Stock** | `0xb200000000000000000000C2e324d24d7eEcd1fb` | Base (8453) | [BaseScan](https://basescan.org/token/0xb200000000000000000000C2e324d24d7eEcd1fb) |
