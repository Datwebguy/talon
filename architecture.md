# Architecture

## B20 (not xStocks)

Raw ERC-20 balance does not rebase.  
`shareEquivalent = raw * multiplier / 1e18`  
Dividends (net of withholding + Coinbase fee) and splits change `multiplier()`.

Read live:

- token `multiplier()` or registry `0x3f3E8cf41cdd3b1D118c16471aB0113DfDDd5CaD`
- `scaledBalanceOf` / `toScaledBalance` / `toRawBalance` when present
- Chainlink total-return feed for USD display
- pause flag — if paused, show paused, do not invent last-good theater beyond what the feed actually returns

## Vault

Per underlying, created by factory.

`tear(raw)`  
pull B20, mint equal clip + talon, set user clip index = current M.

`join(raw)`  
burn equal clip + talon, push B20.

No path that withdraws B20 by burning only one leg. That would break 1:1 raw backing.

## Clip index

Fungible clip uses an accumulator / user index so late depositors do not steal early accretion **as a displayed claim**. Cash payout of clip without joining is phase 2 (would require a reserve policy). v1: clip is the tradable claim; join is the full exit.

## Markets (real only)

1. Discover Aerodrome / 1inch / 0x pools for clip or talon **after** those tokens exist. If no pool, Markets page says “no onchain liquidity yet” and links the token addresses. Empty state is allowed. Fake candles are not.
2. Phase 1.1: onchain `TalonMarket` — talon/USDC using Chainlink + multiplier, funded by real LP deposits. No preloaded admin inventory.

## Multi-asset

Factory `createMarket(underlying)` only if `underlying` is on the official Coinbase set. Do not accept random ERC-20s.

## Compliance

B20 can block transfers. Test dust tear on mainnet immediately. If the vault cannot receive AAPLc, stop and write the revert in `memory.md`.
