<div align="center">

# TALON

## Split official AAPLc on Base. Choose what you hold.

[![Base Mainnet](https://img.shields.io/badge/Base%20Mainnet-8453-0052FF?style=for-the-badge)](https://basescan.org)
[![Official AAPLc](https://img.shields.io/badge/Official%20AAPLc-Coinbase-2563EB?style=for-the-badge)](https://basescan.org/token/0xb200000000000000000000C2e324d24d7eEcd1fb)
[![Live protocol](https://img.shields.io/badge/Protocol-Live-16A34A?style=for-the-badge)](https://talon-rouge.vercel.app)

[Open the app](https://talon-rouge.vercel.app) &nbsp; [Verify official AAPLc](https://basescan.org/token/0xb200000000000000000000C2e324d24d7eEcd1fb) &nbsp; [Watch the Builder Quest](https://x.com/buildonbase/status/2095105184120664122)

</div>

> **Talon is experimental Base Mainnet software for eligible non US users.** Coinbase issues AAPLc. Base is the network. Talon is an independent protocol that lets a holder split and recombine the exposure.

## Why Talon exists

When official Coinbase Tokenized Stocks became available on Base, the obvious product was another place to buy a ticker. We saw a more interesting opportunity. A stock position onchain does not have to remain one indivisible object.

Talon lets an eligible AAPLc holder decide how to hold that position. Deposit official Coinbase AAPLc into the Talon vault and receive two equal, transferable claims: **Clip**, the multiplier claim, and **Talon**, the price claim. Keep them together, transfer one claim to another approved wallet, or combine equal amounts later to recover the raw AAPLc.

This is not a promise of yield. It is not synthetic Apple exposure. It is not a pretend exchange. It is one real, inspectable Base Mainnet loop built around the official Coinbase AAPLc contract.

## The one action

```text
                       Official Coinbase AAPLc
                                  │
                                  │  Tear
                                  ▼
                ┌─────────────────┴─────────────────┐
                │                                   │
                ▼                                   ▼
          Clip AAPLc                           Talon AAPLc
       Multiplier claim                        Price claim
                │                                   │
                └──────── equal amounts ────────────┘
                                  │
                                  │  Join
                                  ▼
                       Official Coinbase AAPLc
```

The vault holds the deposited AAPLc. Tearing mints equal raw amounts of Clip and Talon. Joining burns equal raw amounts of both claims and returns the matching raw AAPLc. There is no path to withdraw the underlying by presenting only one side of the pair.

## Start here

<table>
  <tr>
    <td width="33%"><strong>1. Verify</strong><br/>Confirm that the underlying is official Coinbase AAPLc and that the wallet is on Base Mainnet.</td>
    <td width="33%"><strong>2. Split</strong><br/>Approve the exact amount, then tear AAPLc into matched Clip and Talon claims.</td>
    <td width="33%"><strong>3. Recombine</strong><br/>Bring equal amounts back together and join them to withdraw AAPLc from the vault.</td>
  </tr>
</table>

Talon also supports a simple gift flow. An approved holder can transfer Clip or Talon directly to another approved wallet. There is no time lock or rewards programme hidden behind that feature. It is a straightforward onchain transfer.

## Live on Base

| What | Verified address |
| :--- | :--- |
| Official Coinbase AAPLc | [`0xb200...d1fb`](https://basescan.org/token/0xb200000000000000000000C2e324d24d7eEcd1fb) |
| Talon Factory | [`0x7e16...9711`](https://basescan.org/address/0x7e16011cafead7ffdc5cdd96e67b167f9b1f9711) |
| Eligibility Registry | [`0x932a...757C`](https://basescan.org/address/0x932ab262AbbdCBEFa86D3166A5F987E5A79F757C) |
| AAPLc Vault | [`0x12bb...47cB`](https://basescan.org/address/0x12bb3fFaBF1bE93D0BEAf39c069f3B87E7fc47cB) |
| Clip AAPLc | [`0xd781...1141`](https://basescan.org/token/0xd781e0594041c12618847b165acd552CeB1C1141) |
| Talon AAPLc | [`0x8346...532B`](https://basescan.org/token/0x834600FFF5dC6097D7A2a443F1484Ff6228f532B) |

The protocol is deployed on **Base Mainnet, chain 8453**. The app is live at [talon-rouge.vercel.app](https://talon-rouge.vercel.app).

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
| Official AAPLc vault | Live |
| AAPLc tear into Clip and Talon | Live |
| Equal claim join into AAPLc | Live |
| Claim transfer between approved wallets | Live |
| Manual registry approval by a dedicated operator | Live |
| Vaults for more official B20 assets | Planned, not deployed |
| Secondary liquidity for Clip or Talon | Not launched |
| Credit, leverage, options, or perps | Not launched |
| Dividend distribution or yield programme | Not launched and not claimed |

The factory has an exact allowlist for official Coinbase AAPLc, NVDAc, GOOGLc, and METAc. Only AAPLc has a Talon vault and a completed live flow. A token appearing in the allowlist does not mean it is available in the product.

## Eligibility and user protection

Talon does not enable stock actions for US persons. The public site remains visible so anyone can inspect the contracts and understand the product, but browsing is not trading.

Before a stock action, the application checks the wallet network and requests a non US eligibility attestation. The server supplies a connection based country signal. Most importantly, the contract verifies the onchain Eligibility Registry before it permits a tear, join, or claim transfer. A separate operator wallet, not the browser, approves eligible wallets in that registry.

This is an application control, not a claim that Talon controls Base or establishes identity worldwide. Location is an estimate from a connection. Users should not treat it as legal advice or identity verification.

## A clear line on authenticity

Talon is not Coinbase. Coinbase is the issuer of AAPLc. Talon does not claim to grant shareholder rights beyond the official token, and it does not present a ticker match as proof of authenticity. The asset address is the source of truth.

Talon does not fabricate candles, prices, liquidity, APY, dividend payments, or market depth. The Markets page can direct a user to a real external venue when one exists. It does not route a swap through an unverified market and it does not claim liquidity that has not been deployed.

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

## Builder Quest

Talon was built for the [Base Builder Quest](https://x.com/buildonbase/status/2095105184120664122), which asks builders to help people trade or use Coinbase Tokenized Stocks on Base.

The primary Talon thesis is simple: official stock tokens become more useful when their exposure can be expressed as composable onchain claims. The live AAPLc split is the proof. The gift flow is a secondary use of those claims.

The strongest Loom recording shows one continuous story: verify official AAPLc, show Base 8453 and the eligibility posture, tear AAPLc, hold the BaseScan receipt on screen, show the claim transfer, and join the matching claims back into AAPLc.

## Security note

Talon is experimental protocol software and has not completed a formal external security audit. Verify every address independently. Approve only the exact amount needed. Keep wallet credentials private. Do not assume a market exists because a token name appears in a wallet.

If you find a reproducible issue, open a GitHub issue with the relevant route and public transaction hash. Never include a seed phrase, private key, personal identification, or private wallet information.
