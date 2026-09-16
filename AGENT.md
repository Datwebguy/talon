# Agent start

You are building **Talon** as a live, long-lived protocol on Base — not a weekend mock.

Read every `.md` in this folder before coding. Spec wins over instinct.
`scope.md` + `memory.md` win conflicts.

## Product

Same information architecture as xStream:

1. Marketing landing (how it works, personas, FAQ)
2. App: Vault / Markets / Portfolio (/ Auction later)
3. Vault: deposit official B20 → mint clip + talon 1:1 raw
4. Markets: trade each leg against real venues or a real onchain market using live Chainlink + `multiplier()`
5. Join: burn equal clip + talon → underlying B20 out

Map:

| xStream | Talon |
| ------- | ----- |
| dx | clip (B20 multiplier growth) |
| px | talon (raw token claim + price leg) |
| xStock rebase | B20 `multiplier()` — balances do not rebase |
| Pyth | Chainlink Coinbase equity feeds + onchain multiplier |
| Ink/ETH Sepolia mocks | Base mainnet official B20 |

## Hard rules

- No mock ERC-20s standing in for AAPLc.
- No fixture JSON prices. Read `multiplier()`, `balanceOf`, Chainlink `latestRoundData`, registry pause.
- No hardcoded “demo USDC inventory.”
- No invented APY. If yield is 0.4%, show 0.4% from live multiplier history or show “n/a until two snapshots exist.”
- Token list comes from official addresses in `resources.md` / base.org/stocks / registry `0x3f3E8cf41cdd3b1D118c16471aB0113DfDDd5CaD`. Verify on chain.
- Do not copy xStream’s 18.4% APY art or session-leverage until the vault is live on mainnet.

## Stack

- Solidity 0.8.24+, Foundry
- Next.js App Router, wagmi, viem
- Base Mainnet
- First market: AAPLc `0xb200000000000000000000C2e324d24d7eEcd1fb`
- Factory so NVDAc / GOOGLc / METAc can be added by parameter, not by fork-paste

## First work

1. Read the rest of the md files.
2. Monorepo: `contracts/` + `app/`.
3. `TalonFactory` + `TalonVault` + `ClipToken` + `TalonToken` with multiplier index.
4. App: landing + `/app` vault against mainnet AAPLc.
5. Log deploys in `memory.md`.
