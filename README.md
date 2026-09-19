<div align="center">

# TALON

## Split Coinbase Tokenized Stocks on Base. Choose what you hold.

[![Bankr Hackathon](https://img.shields.io/badge/Bankr%20Hackathon-Agent%20Track-FF5A00?style=for-the-badge&logo=robot)](https://bankr.bot)
[![Base Mainnet](https://img.shields.io/badge/Base%20Mainnet-8453-0052FF?style=for-the-badge)](https://basescan.org)
[![Official Coinbase Equities](https://img.shields.io/badge/Coinbase%20Equities-10%20Supported-2563EB?style=for-the-badge)](https://basescan.org/token/0xb200000000000000000000C2e324d24d7eEcd1fb)
[![Live protocol](https://img.shields.io/badge/Protocol-Live-16A34A?style=for-the-badge)](https://talononbase.tech)

[Open the app](https://talononbase.tech) &nbsp; [Sentinel & Bankr Copilot](https://talononbase.tech/app/sentinel) &nbsp; [Bankr Agent Spec](BANKR.md) &nbsp; [Verify official AAPLc](https://basescan.org/token/0xb200000000000000000000C2e324d24d7eEcd1fb) &nbsp; [Watch the Builder Quest](https://x.com/buildonbase/status/2095105184120664122)

</div>

> **Talon is experimental Base Mainnet software for eligible non US users.** Coinbase issues official B20 tokenized equities. Base is the network. Talon is an independent protocol that lets an eligible holder split and recombine the exposure into transferable claims.

## Why Talon exists

When official Coinbase Tokenized Stocks became available on Base, the obvious product was another place to buy a ticker. We saw a more interesting opportunity. A stock position onchain does not have to remain one indivisible object.

Talon lets an eligible tokenized stock holder decide how to hold that position. Deposit official Coinbase stock tokens into the Talon vault and receive two equal, transferable claims: **Clip**, the multiplier claim, and **Talon**, the price claim. Keep them together, transfer one claim to another approved wallet, or combine equal amounts later to recover the raw underlying token.

This is not synthetic stock exposure. It is not an algorithmic peg. It is one real, inspectable Base Mainnet decomposition loop built around official Coinbase tokenized stock contracts.

## The one action

```text
                       Official Coinbase Stock Token
                                   │
                                   │  Tear
                                   ▼
                 ┌─────────────────┴─────────────────┐
                 │                                   │
                 ▼                                   ▼
            Clip Token                          Talon Token
        Multiplier claim                        Price claim
                 │                                   │
                 └──────── equal amounts ────────────┘
                                   │
                                   │  Join
                                   ▼
                       Official Coinbase Stock Token
```

The vault holds the deposited stock tokens. Tearing mints equal raw amounts of Clip and Talon. Joining burns equal raw amounts of both claims and returns the matching raw underlying stock token. There is no path to withdraw the underlying by presenting only one side of the pair.

## Start here

<table>
  <tr>
    <td width="33%"><strong>1. Verify</strong><br/>Confirm that the underlying is an official Coinbase stock token and that your wallet is connected to Base Mainnet (8453).</td>
    <td width="33%"><strong>2. Split</strong><br/>Approve the exact amount, then tear the token into matched Clip and Talon claims.</td>
    <td width="33%"><strong>3. Recombine</strong><br/>Bring equal amounts back together and join them to withdraw the underlying token from the vault.</td>
  </tr>
</table>

Talon also supports a simple gift flow. An approved holder can transfer Clip or Talon directly to another approved wallet on Base. It is a straightforward onchain transfer of transferable claims.

## Live on Base

### Protocol Infrastructure
| Contract | Verified address | Network |
| :--- | :--- | :--- |
| Talon Factory | [`0x7e16011cafead7ffdc5cdd96e67b167f9b1f9711`](https://basescan.org/address/0x7e16011cafead7ffdc5cdd96e67b167f9b1f9711) | Base (8453) |
| Eligibility Registry | [`0x932ab262AbbdCBEFa86D3166A5F987E5A79F757C`](https://basescan.org/address/0x932ab262AbbdCBEFa86D3166A5F987E5A79F757C) | Base (8453) |
| AAPLc Vault | [`0x12bb3fFaBF1bE93D0BEAf39c069f3B87E7fc47cB`](https://basescan.org/address/0x12bb3fFaBF1bE93D0BEAf39c069f3B87E7fc47cB) | Base (8453) |
| Clip AAPLc | [`0xd781e0594041c12618847b165acd552CeB1C1141`](https://basescan.org/token/0xd781e0594041c12618847b165acd552CeB1C1141) | Base (8453) |
| Talon AAPLc | [`0x834600FFF5dC6097D7A2a443F1484Ff6228f532B`](https://basescan.org/token/0x834600FFF5dC6097D7A2a443F1484Ff6228f532B) | Base (8453) |

### Supported Coinbase Tokenized Stocks
| Asset | Company | Verified Base Token Address | Status |
| :--- | :--- | :--- | :--- |
| **AAPLc** | Apple Inc. | [`0xb200000000000000000000C2e324d24d7eEcd1fb`](https://basescan.org/token/0xb200000000000000000000C2e324d24d7eEcd1fb) | Active Vault |
| **NVDAc** | NVIDIA Corp. | [`0xb20000000000000000000078ee7ce2fE4908108C`](https://basescan.org/token/0xb20000000000000000000078ee7ce2fE4908108C) | Factory Ready |
| **GOOGLc** | Alphabet Inc. | [`0xb2000000000000000000002D0BA3164cc74f58B7`](https://basescan.org/token/0xb2000000000000000000002D0BA3164cc74f58B7) | Factory Ready |
| **METAc** | Meta Platforms | [`0xb2000000000000000000008bC8786B856E61707C`](https://basescan.org/token/0xb2000000000000000000008bC8786B856E61707C) | Factory Ready |
| **AMZNc** | Amazon.com Inc. | [`0xb200000000000000000000d9192b6B456483C2E8`](https://basescan.org/token/0xb200000000000000000000d9192b6B456483C2E8) | Verified DEX |
| **MSFTc** | Microsoft Corp. | [`0xB200000000000000000000Ab99cFa739E253872B`](https://basescan.org/token/0xB200000000000000000000Ab99cFa739E253872B) | Verified DEX |
| **MSTRc** | MicroStrategy Inc. | [`0xb2000000000000000000004884b426556b92883d`](https://basescan.org/token/0xb2000000000000000000004884b426556b92883d) | Verified DEX |
| **SNDKc** | SanDisk Corp. | [`0xb200000000000000000000397293Cb8cda9a10c5`](https://basescan.org/token/0xb200000000000000000000397293Cb8cda9a10c5) | Verified DEX |
| **SPCXc** | SpaceX | [`0xb2000000000000000000007b9fcbd005511aCBd5`](https://basescan.org/token/0xb2000000000000000000007b9fcbd005511aCBd5) | Verified DEX |
| **TSLAc** | Tesla Inc. | [`0xb2000000000000000000004a43bC74A41BcfA3d2`](https://basescan.org/token/0xb2000000000000000000004a43bC74A41BcfA3d2) | Verified DEX |

The protocol is deployed on **Base Mainnet, chain 8453**. The app is live at [talononbase.tech](https://talononbase.tech).

## Proof, not promises

The full loop has been completed on Base Mainnet with official AAPLc. Open each receipt and inspect the transaction yourself.

| Completed action | Receipt |
| :--- | :--- |
| Approved AAPLc for the vault | [View on BaseScan](https://basescan.org/tx/0xafa4c3b7784b894a470c69302a3d9a6d86a938721717b300a0a95031df31ae7d) |
| Tore AAPLc into Clip and Talon | [View on BaseScan](https://basescan.org/tx/0x4e791f2324a9a99fac8d9e018fc4c17836ad87e1d6d8a5a71c8021ab1a030b2f) |
| Gifted Clip to an approved recipient | [View on BaseScan](https://basescan.org/tx/0xaf2cb1679f111b9fcf9fe832280d2104afc7d40ea68a9755922b683eb9522be5) |
| Joined Clip and Talon back into AAPLc | [View on BaseScan](https://basescan.org/tx/0xc51317afc6c27ff1e0464885dcb551c5116564695f89787e1385ada9631c171f) |

## What is live today

| Capability | Availability |
| :--- | :--- |
| Official AAPLc vault | Live on Base Mainnet |
| AAPLc tear into Clip and Talon claims | Live on Base Mainnet |
| Equal claim join into AAPLc | Live on Base Mainnet |
| Claim transfer between approved wallets | Live on Base Mainnet |
| Market coverage for 10 Coinbase tokenized equities | Live on Base Mainnet |
| Live Aerodrome DEX market pricing | Live on Base Mainnet |
| Automated Talon Sentinel Risk Engine & Invariant parity | Live on Base Mainnet |
| Bankr Agent natural language skill integration | Live on Base Mainnet |
| Onchain Eligibility Registry verification | Live on Base Mainnet |
| Secondary liquidity pools for Clip or Talon | In development |
| Credit, leverage, options, or perps | Not launched |

The factory has an exact allowlist for official Coinbase AAPLc, NVDAc, GOOGLc, and METAc. AAPLc has a deployed Talon vault with completed onchain flows. Additional vaults can be deployed directly from the Factory interface.

## Eligibility and user protection

Talon does not enable stock actions for US persons. The public site remains visible so anyone can inspect the contracts and understand the product, but browsing is not trading.

Before a stock action, the application checks the wallet network and requests a non US eligibility attestation. The server supplies a connection based country signal. Most importantly, the contract verifies the onchain Eligibility Registry before it permits a tear, join, or claim transfer. A separate operator wallet, not the browser, approves eligible wallets in that registry.

This is an application control, not a claim that Talon controls Base or establishes identity worldwide. Location is an estimate from a connection. Users should not treat it as legal advice or identity verification.

## A clear line on authenticity

Talon is not Coinbase. Coinbase is the issuer of the underlying tokenized equities. Talon does not claim to grant shareholder rights beyond the official token, and it does not present a ticker match as proof of authenticity. The asset address is the source of truth.

Talon does not fabricate candles, prices, liquidity, APY, dividend payments, or market depth. The Markets page connects to live Aerodrome DEX pools on Base.

## How the protocol works

`TalonFactory` maintains the official underlying allowlist and creates a vault for an approved asset. `TalonVault` holds the underlying, reads its multiplier, and creates a matched pair of claims. `ClipToken` records the multiplier index at the time a holder receives the claim. `TalonToken` represents the matched price side.

Both claim tokens enforce the Eligibility Registry on transfer. The vault enforces the same registry on tear and join. The factory has a pause control and separates the factory owner from the wallet that operates eligibility approvals.

```text
app/
  Next.js application
  Base chain protection
  Eligibility experience
  Official token configuration

contracts/
  TalonFactory and exact asset allowlist
  EligibilityRegistry
  TalonVault tear and join logic
  ClipToken and TalonToken
  Foundry tests and deployment scripts
```

## Run the application locally

### Frontend

```bash
cd app
npm install
npm run dev
```

Open `http://localhost:3000`. For a deployment, set the optional public URL value:

```text
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Contracts

Install Foundry, then run the unit suite:

```bash
cd contracts
forge test
```

The current suite covers the exact official allowlist, eligibility controls, one to one tear and join behavior, one sided join rejection, transfer restrictions, multiplier accounting, and the separate eligibility operator role.

## Deployment discipline

The contract scripts are deliberately separated by responsibility.

| Script | Responsibility |
| :--- | :--- |
| `contracts/script/deploy_live.mjs` | Deploy the factory, configure the eligibility operator, create the AAPLc vault, and update public frontend addresses |
| `contracts/script/set_eligible_operator.mjs` | Approve or remove an eligible wallet from the dedicated operator wallet |
| `contracts/script/verify_live_flow.mjs` | Verify the controlled tear, gift, and join flow using a tiny amount |

Start with [`contracts/.env.example`](contracts/.env.example). The real `contracts/.env` file is ignored by Git. Use distinct deployer, operator, test, and recipient wallets. Never put a private key, seed phrase, user data, or production secret in this repository, a browser environment variable, a Vercel setting meant for public code, or a recording.

## Talon Sentinel & Bankr Agent Copilot

**Talon Sentinel** is an autonomous onchain risk engine and conversational AI copilot built for Base Mainnet (8453), powered by an official **Bankr Agent Skill** ([`BANKR.md`](BANKR.md) / [`app/src/lib/bankr/talon-skill.json`](app/src/lib/bankr/talon-skill.json)):

- **Earnings Volatility Shield**: When high-volatility corporate earnings threaten gap-downs, Sentinel splits the position via `TalonVault.tear()`, securing the price leg while preserving corporate multiplier growth (`clip`).
- **Accretion Yield**: Automatically monitors the onchain B20 corporate multiplier index to track equity growth stripped of price delta.
- **1:1 Invariant Parity Verification**: Continuously verifies `1 Underlying Stock == 1 clipToken + 1 talonToken`, validating that `TalonVault.join()` redemptions remain backed 1:1 on Base.
- **Bankr Agent Copilot (`bankr.bot`)**: Integrates natively with the Bankr AI Agent ecosystem. Users can inspect metrics, audit invariant parity, and trigger unbundling or recombining directly through plain English prompts in the UI or via autonomous bots.
- **Non-Custodial Security**: 100% user custody. All state changes require explicit Web3 wallet signing on Base Mainnet (Chain ID: 8453) with real onchain balance checks.

### 🤖 Official Bankr Skill Tools (`talon-skill.json`)

The machine-readable Bankr Agent Skill manifest is deployed at [`/bankr-skill.json`](https://talononbase.tech/bankr-skill.json) (or [`/api/bankr/skill`](https://talononbase.tech/api/bankr/skill)):

| Tool | Action | Base Mainnet Contract Call |
| :--- | :--- | :--- |
| `talon_get_status` | Query spot price, B20 multiplier, earnings countdown, and vault backing | Reads `TalonVault.getVaultStats()` & B20 contract |
| `talon_check_parity` | Audit mathematical 1:1 invariant backing (`1 Stock == 1 Clip + 1 Talon`) | Reads onchain supplies of Underlying, Clip, and Talon |
| `talon_activate_earnings_shield` | Unbundle stock before volatility spike; flash-hedge price risk into USDC | Calls `TalonVault.tear()` & isolates downside |
| `talon_recombine_stock` | Burn equal Clip + Talon claims to redeem underlying Coinbase stock 1:1 | Calls `TalonVault.join()` on Base Mainnet |

### Sample Prompts for Bankr Copilot

Judges and users can test conversational execution directly in the live Sentinel UI:
- `"Audit 1:1 invariant parity for NVDAC on Base"`
- `"Check AAPLc risk metrics and B20 corporate multiplier"`
- `"Shield 1.0 AAPLc ahead of corporate earnings"`
- `"Recombine 1.0 clipAAPLc and 1.0 talonAAPLc into raw AAPLc"`

### Run the Sentinel Agent Runner Locally

```bash
cd app
npx tsx scripts/run-sentinel.ts
```

Visit the live Sentinel UI and Bankr Copilot at [talononbase.tech/app/sentinel](https://talononbase.tech/app/sentinel).
For complete architecture and hackathon details, see [`BANKR.md`](BANKR.md).

## Builder Quest

Talon was built for the [Base Builder Quest](https://x.com/buildonbase/status/2095105184120664122), which asks builders to help people trade or use Coinbase Tokenized Stocks on Base.

The primary Talon thesis is simple: official stock tokens become more useful when their exposure can be expressed as composable onchain claims. The live AAPLc split is the proof. The gift flow is a secondary use of those claims.

The strongest Loom recording shows one continuous story: verify official AAPLc, show Base 8453 and the eligibility posture, tear AAPLc, hold the BaseScan receipt on screen, show the claim transfer, and join the matching claims back into AAPLc.

## Security note

Talon is experimental protocol software and has not completed a formal external security audit. Verify every address independently. Approve only the exact amount needed. Keep wallet credentials private. Do not assume a market exists because a token name appears in a wallet.

If you find a reproducible issue, open a GitHub issue with the relevant route and public transaction hash. Never include a seed phrase, private key, personal identification, or private wallet information.
