<div align="center">

# TALON

### Programmable exposure for official Coinbase Tokenized Stocks on Base

[![Base Mainnet](https://img.shields.io/badge/Base%20Mainnet-8453-0052FF?style=for-the-badge)](https://basescan.org)
[![Official underlying](https://img.shields.io/badge/Official%20underlying-AAPLc-0A84FF?style=for-the-badge)](https://basescan.org/token/0xb200000000000000000000C2e324d24d7eEcd1fb)
[![Status](https://img.shields.io/badge/Status-Live-0BB783?style=for-the-badge)](https://talon-rouge.vercel.app)

[Open Talon](https://talon-rouge.vercel.app) · [Verify AAPLc](https://basescan.org/token/0xb200000000000000000000C2e324d24d7eEcd1fb) · [Base Builder Quest](https://x.com/buildonbase/status/2095105184120664122)

</div>

## The idea

Coinbase Tokenized Stocks make official stock exposure available on Base for eligible non US users. Talon explores the next question: once a stock token is onchain, can a holder choose which exposure to keep without leaving the asset in a single opaque position?

Talon accepts official Coinbase AAPLc and issues two coupled, transferable claims. **Clip** tracks the multiplier leg. **Talon** tracks the price leg. Equal amounts of Clip and Talon can always be recombined to recover the same raw amount of AAPLc held in the vault.

The product is deliberately narrow. It does not invent dividends, fabricate market data, promise yield, or call a lookalike token a Coinbase asset. The current live loop is one official underlying, one vault, one verifiable action, and one onchain receipt.

## Live product

| Surface | Link |
| :--- | :--- |
| App | [talon-rouge.vercel.app](https://talon-rouge.vercel.app) |
| Network | [Base Mainnet, chain 8453](https://basescan.org) |
| Official underlying | [AAPLc](https://basescan.org/token/0xb200000000000000000000C2e324d24d7eEcd1fb) |
| Factory | [`0x7e16...9711`](https://basescan.org/address/0x7e16011cafead7ffdc5cdd96e67b167f9b1f9711) |
| Eligibility registry | [`0x932a...757C`](https://basescan.org/address/0x932ab262AbbdCBEFa86D3166A5F987E5A79F757C) |
| AAPLc vault | [`0x12bb...47cB`](https://basescan.org/address/0x12bb3fFaBF1bE93D0BEAf39c069f3B87E7fc47cB) |
| Clip token | [`0xd781...1141`](https://basescan.org/token/0xd781e0594041c12618847b165acd552CeB1C1141) |
| Talon token | [`0x8346...532B`](https://basescan.org/token/0x834600FFF5dC6097D7A2a443F1484Ff6228f532B) |

## The live loop

An eligible wallet connects on Base Mainnet. Talon verifies the wallet network, checks the application eligibility posture, and reads the onchain eligibility registry. The wallet approves the exact AAPLc amount to the vault. The vault then tears that AAPLc into equal Clip and Talon balances.

Either claim can be transferred to another eligible wallet. A holder with equal Clip and Talon amounts can join them to withdraw the matching raw AAPLc amount from the vault. The vault never releases AAPLc by burning only one claim.

```text
Official Coinbase AAPLc
          │
          │ tear
          ▼
   Clip             Talon
multiplier leg    price leg
          │
          │ equal amounts join
          ▼
Official Coinbase AAPLc
```

## Mainnet proof

The following Base Mainnet transactions complete the product loop. These are real receipts, not simulated screenshots.

| Action | BaseScan receipt |
| :--- | :--- |
| AAPLc approval to vault | [`0xafa4...ae7d`](https://basescan.org/tx/0xafa4c3b7784b894a470c69302a3d9a6d86a938721717b300a0a95031df31ae7d) |
| Tear AAPLc into Clip and Talon | [`0x4e79...0b2f`](https://basescan.org/tx/0x4e791f2324a9a99fac8d9e018fc4c17836ad87e1d6d8a5a71c8021ab1a030b2f) |
| Gift Clip to an eligible recipient | [`0xaf2c...2be5`](https://basescan.org/tx/0xaf2cb1679f111b9fcf9fe832280d2104afc7d40ea68a9755922b683eb9522be5) |
| Recombine Clip and Talon into AAPLc | [`0xc513...171f`](https://basescan.org/tx/0xc51317afc6c27ff1e0464885dcb551c5116564695f89787e1385ada9631c171f) |

## Official asset policy

Talon only treats an asset as a Coinbase Tokenized Stock when its address appears in the official Coinbase and Base materials. A ticker is never sufficient.

The factory allowlist includes Coinbase AAPLc, NVDAc, GOOGLc, and METAc. **Only AAPLc has a deployed Talon vault and a live product flow today.** The remaining assets are not presented as active vaults and are not substitutes for a live AAPLc loop.

| Asset | Official Coinbase asset | Current Talon state |
| :--- | :--- | :--- |
| AAPLc | Yes | Live vault and verified loop |
| NVDAc | Yes | Allowlisted, no Talon vault |
| GOOGLc | Yes | Allowlisted, no Talon vault |
| METAc | Yes | Allowlisted, no Talon vault |

The official underlying address for the live vault is [`0xb200000000000000000000C2e324d24d7eEcd1fb`](https://basescan.org/token/0xb200000000000000000000C2e324d24d7eEcd1fb).

## Eligibility and safety

Talon is designed for eligible non US users only. The site remains browsable so people can inspect official addresses, learn how the vault works, and verify onchain activity. Stock actions are not enabled merely because a button is visible.

The application uses a layered posture. The server determines a country hint. The user must attest before a stock action. The vault and claim tokens enforce the separate onchain registry for deposits, joins, and transfers. An owner configured, dedicated eligibility operator can approve a wallet in that registry. The application client is never the final authority.

Location is an estimate, not identity verification. Onchain transfers on Base are permissionless at the chain level. Talon does not claim to provide global compliance or to control the Base network. It does not offer or facilitate Coinbase Tokenized Stock actions to US persons through the application.

## What Talon does not claim

Talon is not Coinbase and does not issue AAPLc. Coinbase is the issuer. Base is the network.

Talon does not promise stock ownership rights beyond what the official Coinbase token provides. It does not promise a dividend, APY, return, secondary market liquidity, credit facility, options product, or price execution.

The Markets surface is intentionally honest. It can link to an external venue where one exists, but Talon does not represent an active market, quote, candle, or liquidity pool that has not been verified onchain. There is no embedded router and no hidden swap flow.

## Architecture

The repository contains a Next.js application and Solidity protocol contracts.

```text
app/
  Next.js interface
  Wallet and Base chain checks
  Server eligibility route
  Official token configuration

contracts/
  TalonFactory allowlist and deployment
  EligibilityRegistry
  TalonVault tear and join logic
  ClipToken multiplier claim
  TalonToken price claim
  Foundry tests and controlled deployment scripts
```

`TalonFactory` owns the official underlying allowlist and deploys one vault per approved asset. Every `TalonVault` holds the official underlying, mints equal Clip and Talon amounts on tear, and requires equal amounts on join. `ClipToken` and `TalonToken` both read the eligibility registry before transfer. The vault reads the official underlying multiplier and retains 1 to 1 raw backing for matched claims.

## Local development

### Application

```bash
cd app
npm install
npm run dev
```

Open `http://localhost:3000`. The only documented public environment setting is optional:

```text
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Contracts

Install Foundry, then run:

```bash
cd contracts
forge test
```

The contract deployment scripts read `contracts/.env`, which is ignored by Git. Start from [`contracts/.env.example`](contracts/.env.example). Use separate wallets for deployment, eligibility operations, and controlled verification. Never place a personal wallet key, production key, or customer key in the frontend, a Vercel environment variable, a screenshot, or Git.

## Controlled deployment and verification

The repository contains scripts for three distinct responsibilities.

| Script | Purpose |
| :--- | :--- |
| `contracts/script/deploy_live.mjs` | Deploy factory, configure the separate eligibility operator, create the AAPLc vault, and write public contract addresses to the application configuration |
| `contracts/script/set_eligible_operator.mjs` | Approve or remove an eligible wallet using the dedicated operator wallet |
| `contracts/script/verify_live_flow.mjs` | Run the controlled AAPLc tear, claim transfer, and recombination verification flow |

These scripts can submit Mainnet transactions. Review the source, use a dedicated funded wallet, use a tiny test amount, and confirm all addresses before running them. They are not part of the browser application and must never be exposed to a user.

## Product status

| Capability | Status |
| :--- | :--- |
| Official AAPLc vault on Base Mainnet | Live |
| Tear AAPLc into Clip and Talon | Live |
| Recombine equal claims into AAPLc | Live |
| Gift claims between approved wallets | Live |
| Onchain registry enforcement | Live |
| Other official B20 vaults | Not deployed |
| Secondary liquidity | Not launched |
| Credit, leverage, or options | Not launched |
| Dividend or yield distribution | Not launched and not claimed |

## Base Builder Quest

Talon was built for the [Base Builder Quest](https://x.com/buildonbase/status/2095105184120664122): help people trade or use Coinbase Tokenized Stocks on Base. Its primary thesis is programmable separation of an official stock token into a multiplier claim and a price claim. Gifting is a secondary, shipped use case.

The recommended demo is a single continuous Base Mainnet story: verify official AAPLc, show Base 8453 and eligibility, tear AAPLc, show the receipt, show the transferred claim, and show recombination. The submission should include the public URL, Loom recording, and an X post tagging [@buildonbase](https://x.com/buildonbase).

## Security notes

This is experimental software. Review the contracts and verify every address independently before interacting with Mainnet.

* Use only the verified official underlying address
* Confirm the wallet is on Base Mainnet, chain 8453
* Approve only the exact amount required by the vault
* Treat token names, memos, and external links as untrusted input
* Do not assume a market exists because a ticker appears in a wallet
* Do not share seed phrases, private keys, or environment files

## License and contribution

The repository is currently a Builder Quest submission and experimental protocol reference. Before production use, the project needs a formal external security review, an explicit governance model, and a released license.

For product issues, open a GitHub issue with the route, wallet network, public transaction hash if relevant, and a reproducible description. Do not include keys, seed phrases, personal identification, or private wallet material.
