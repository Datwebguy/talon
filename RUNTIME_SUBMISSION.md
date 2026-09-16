# Talon Sentinel — Runtime Agent Week Submission Guide
**Event:** Runtime Agent Week (NYC) • September 13–19, 2026  
**Submission Portal:** https://runtime.nyc/submit  
**Submission Deadline:** Saturday, September 19, 2026 at 4:00 PM EDT  
**Demo Time:** 5:00 PM EDT on Saturday, September 19  

---

## 1. Submission Form Fields (Copy & Paste Ready)

### Project Name
`Talon Sentinel`

### Summary (What did you build, who is it for, and what can it do?)
```text
Talon Sentinel is an autonomous equity co-pilot and risk guardian on Base mainnet that manages and protects tokenized Coinbase stocks (AAPLc, NVDAc, TSLAc). Built on top of Talon’s verified unbundling vaults (0x12bb3fFa...), Sentinel turns passive equity-splitting into an active, automated financial primitive.

Using Dynamic Delegated Session Keys with Fireblocks policy guardrails, users grant the agent scoped authority to manage their equity risk with 0% custody risk. When an upcoming corporate earnings call or extreme volatility shock threatens after-hours gap-downs, Sentinel autonomously calls TalonVault.tear(), isolates the volatile price leg (talonAAPLc) into USDC via Definitive Flash limit/bracket orders, and preserves the multiplier/dividend accretion claim (clipAAPLc). Once volatility normalizes, the agent calls TalonVault.join() to reconstitute the stock 1:1.

Sentinel also continuously monitors Base DEX liquidity against vault inventory, automatically executing 1:1 invariant arbitrage whenever split claims trade at a discount. Fully integrated with Bankr via an official Bankr Skill (docs.bankr.bot/skills/), users can trigger and inspect their positions using natural language commands. Live on Base Mainnet (Chain ID 8453).
```

### Project URL
`https://talononbase.tech/app/sentinel` (or `https://talononbase.tech/`)

### Repository URL
`https://github.com/Datwebguy/talon`

### Prize Tracks Selected
Check the following in the submission form:
- [x] **Bankr** (Grand Prize — $20,000 participant prizes) *(Automatically eligible, captures the explicit onchain equities bonus)*
- [x] **Dynamic, a Fireblocks company** ($2,000 prize pool) *(Delegated wallet pattern & session policies)*
- [x] **Definitive Flash** ($1,000 prize pool) *(Advanced order types: bracket, stop-loss, limit)*

---

## 2. Definitive Flash Required X (Twitter) Post
> **Track Rule:** Definitive Flash requires submitting through Runtime AND posting on X tagging `@DefinitiveFi` with a description of what you built, then pasting the post link in the `xUrl` field.

### Draft X Post Copy:
```text
Excited to unveil Talon Sentinel at @runtime_nyc Agent Week! 🦅⚡

We built an autonomous risk guardian for tokenized Coinbase stocks on @base. When earnings volatility spikes, Sentinel autonomously unbundles AAPLc via Talon vaults and executes bracket & stop-loss hedges using @DefinitiveFi Flash advanced orders—protecting equity principal while keeping multiplier accretion.

Built with @Dynamic_xyz delegated keys & @bankrbot skills.

Live on Base Mainnet: https://talononbase.tech/app/sentinel
#RuntimeNYC #Base #AIagents #DeFi
```

---

## 3. Verified Base Mainnet Contract Reference

| Contract | Address | Verification / Explorer Link |
| :--- | :--- | :--- |
| **TalonFactory** | `0xbe3246f2bd8b23103d182a4811b1fe9ecda1e4f8` | [Basescan](https://basescan.org/address/0xbe3246f2bd8b23103d182a4811b1fe9ecda1e4f8) |
| **TalonVault (AAPLc)** | `0x12bb3fFaBF1bE93D0BEAf39c069f3B87E7fc47cB` | [Basescan](https://basescan.org/address/0x12bb3fFaBF1bE93D0BEAf39c069f3B87E7fc47cB) |
| **clipAAPLc (Multiplier Leg)** | `0xd781e0594041c12618847b165acd552CeB1C1141` | [Basescan](https://basescan.org/address/0xd781e0594041c12618847b165acd552CeB1C1141) |
| **talonAAPLc (Price Leg)** | `0x834600FFF5dC6097D7A2a443F1484Ff6228f532B` | [Basescan](https://basescan.org/address/0x834600FFF5dC6097D7A2a443F1484Ff6228f532B) |
| **Coinbase AAPLc Token** | `0xb200000000000000000000C2e324d24d7eEcd1fb` | [Basescan](https://basescan.org/token/0xb200000000000000000000C2e324d24d7eEcd1fb) |
| **Tear Execution Tx** | `0x878e3d3262d67f9ff551ebf4f15ecd87715f99279c200144918bddb9c97e9426` | [Basescan](https://basescan.org/tx/0x878e3d3262d67f9ff551ebf4f15ecd87715f99279c200144918bddb9c97e9426) |

---

## 4. Loom / Video Demo Script (2 Minutes)

* **0:00 – 0:25: The Problem & The Hook**
  * *"Coinbase brought tokenized equities to Base. Talon brought the ability to split them into a multiplier leg (Clip) and a price leg (Talon). But in TradFi, dividend stripping and after-hours volatility hedging require million-dollar prime brokerage desks. Meet Talon Sentinel."*
* **0:25 – 0:55: Dynamic Delegated Access**
  * *Show the `/app/sentinel` page. Point out the Dynamic Delegated Session card.*
  * *"The user retains 100% custody of their assets. Through Dynamic, they grant Sentinel a scoped session key restricted strictly to TalonVault and approved router contracts with a strict spend cap."*
* **0:55 – 1:30: Autonomous Earnings Shield Execution**
  * *Select NVDAc or AAPLc. Point to the live Chainlink feed, the 1.0000x B20 multiplier, and the upcoming earnings volatility indicator.*
  * *Click 'Trigger Autonomous Cycle' (or show the Bankr natural language command: 'Bankr, shield my AAPLc before earnings').*
  * *Watch Sentinel call `TalonVault.tear()`, mint `clipAAPLc` and `talonAAPLc`, and route a Definitive Flash hedge.*
  * *Open the Basescan transaction link showing real contract interaction on Base Mainnet.*
* **1:30 – 2:00: Invariant Parity & Conclusion**
  * *"Sentinel also guarantees the 1:1 mathematical invariant: 1 stock = 1 clip + 1 talon. Whenever secondary AMM pools drift, Sentinel automatically calls `join()` to capture arbitrage and enforce parity. This is real onchain financial infrastructure for the agentic future."*
