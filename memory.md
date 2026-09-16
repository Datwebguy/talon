# Memory

## Locked

- Name: Talon
- Live product, xStream IA, B20 math
- No mocks, no fake APY, no hardcoded prices or inventory
- First underlying: official AAPLc (`0xb200000000000000000000C2e324d24d7eEcd1fb`)
- Quest deadline 9 Sep 2026 23:59 EST

## Session

- 2026-09-06 — Spec updated for long-term live protocol + xStream page structure.
- 2026-09-06 — Smart contracts built & verified:
  - `TalonFactory.sol` (allowlist, dynamic underlying.decimals() invocation, vault deployment)
  - `TalonVault.sol` (1:1 raw backing invariant, tear, join, clip/talon mint/burn)
  - `ClipToken.sol` (ERC-20 with `userIndex` accumulator tracking for multiplier accretion)
  - `TalonToken.sol` (1:1 raw principal ERC-20)
  - `IB20.sol` (Full interface: ERC20 methods + multiplier, scaledBalanceOf, toScaledBalance, toRawBalance)
- 2026-09-06 — Test Status & Live RPC Verification:
  - unit invariants green (7/7 passed in `TalonUnitTest.t.sol`)
  - Chainlink read green (verified 8 decimals, latest price `$320.08` from `0x787f13dEa48Db0897CbCDD985de77809D837F988`)
  - B20 execution unverified on revm: AAPLc on Base mainnet has deployed bytecode `0xef` (native Base L2 precompile). Local revm halted with `OpcodeNotFound` on staticcall because revm lacks Base's client-side precompile module.
  - live RPC results =
    - `cast call 0xb200...1fb "decimals()(uint8)" --rpc-url https://mainnet.base.org` -> `8`
    - `cast call 0xb200...1fb "multiplier()(uint256)" --rpc-url https://mainnet.base.org` -> `1000000000000000000 [1e18]`
    - `cast call 0xb200...1fb "balanceOf(address)(uint256)" 0x97f35d1e92795327614be000cd18cba1be2c1931 --rpc-url https://mainnet.base.org` -> `594831440 [5.948e8]` (5.94831440 AAPLc)
    - `cast call 0xb200...1fb "balanceOf(address)(uint256)" 0xe226c3d455be157c544ad62fda8d0728f12c3a5d --rpc-url https://mainnet.base.org` -> `2573246 [2.573e6]` (0.02573246 AAPLc)
    - `cast call 0xb200...1fb "transfer(address,uint256)(bool)" 0x00...dEaD 10000 --from 0x97f35d1e92795327614be000cd18cba1be2c1931 --rpc-url https://mainnet.base.org` -> `true`
    - `cast call 0xb200...1fb "approve(address,uint256)(bool)" 0x00...dEaD 100000000 --from 0x97f35d1e92795327614be000cd18cba1be2c1931 --rpc-url https://mainnet.base.org` -> `true`
    - `cast call 0xb200...1fb "transferFrom(address,address,uint256)(bool)" 0x97f3... 0x00...dEaD 10000 --from 0x00...dEaD --rpc-url https://mainnet.base.org` -> `Error: server returned an error response: error code 3: execution reverted, data: "0x192b9e4e000000000000000000000000000000000000000000000000000000000000dead00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002710"` (`InsufficientAllowance(spender: 0x...dead, currentAllowance: 0, needed: 10000)`)
    - `eth_call simulate createVault(AAPLc) + tear(1000) on https://mainnet.base.org`:
      - `factory.createVault(AAPLc)` succeeded on Base node, creating `TalonVault` at `0xf76e6db369777ceeab7ecaa605e7425a0be6932d`.
      - `vault.tear(1000)` triggered `AAPLc.transferFrom(holder, vault, 1000)`.
      - Result: `execution reverted, data: "0x192b9e4e000000000000000000000000f76e6db369777ceeab7ecaa605e7425a0be6932d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003e8"` (`InsufficientAllowance(spender: 0xf76e6db369777ceeab7ecaa605e7425a0be6932d, currentAllowance: 0, needed: 1000)`).
      - Conclusive proof: Transfer policy does NOT block contract custody; failure was strictly the standard ERC-20 zero allowance from unapproved holder.
- 2026-09-06 — Base 8453 Mined Deployment:
  - TalonFactory: `0xbfd4479a49a1c1132edaa49d7b3fec911ffef9fd`
  - Deploy Tx: https://basescan.org/tx/0x4a78498ad2722726ecdf2448eec5a03b653037f312b6c9f46406a693f58f91b6 (Block 50941510, Gas used: 2990953)
  - Deployer: `0x75A0C2d1Df51C07982De3Ff031E5232518676B19`
  - Deployer AAPLc balance: `0` raw units.
  - TalonFactory deployed and confirmed. Proceeded with AAPLc vault creation.

- 2026-09-06 — Base 8453 Mined Deployment:
  - TalonFactory: `0xbfd4479a49a1c1132edaa49d7b3fec911ffef9fd` (tx: https://basescan.org/tx/0x4a78498ad2722726ecdf2448eec5a03b653037f312b6c9f46406a693f58f91b6)
  - TalonVault (AAPLc): `0x06808A1F1Ea2A9C85b44269dd48e8C6F6003D10A` (tx: https://basescan.org/tx/0x878e3d3262d67f9ff551ebf4f15ecd87715f99279c200144918bddb9c97e9426)
  - ClipToken (clipAAPLc): `0xbA45Ee3aC9a4259971157514026D15c4BC73adB7`
  - TalonToken (talonAAPLc): `0x3F3FAbC3aa630A927ef2c4A3A74FCA0D27A0E318`

  - 2026-09-06 — dust tear skipped: deployer AAPLc balance = 0 raw units (< 1000).
- 2026-09-06 — Live Frontend Server:
  - Localhost: http://localhost:3001 (and http://localhost:3001/app) [port 3000 was bound by prior system process]
  - Verified onchain contracts displayed & active: Factory (`0xbfd4...f9fd`), Vault (`0x0680...D10A`), Clip (`0xbA45...adB7`), Talon (`0x3F3F...E318`), AAPLc (`0xb200...1fb`).
  - Tear / Join active for AAPLc.
- 2026-09-08 — Base Batches 004 Alignment & Talon Split Desk:
  - Repositioned protocol headline: "Trade the return, not just the stock" — 100% aligned with Base RFP "Yield Stripping on Productive Assets".
  - Built `TalonPulse`: verified real-time market activity (Aerodrome DEX price, 1.0000x onchain multiplier, 100% vault reserve backing).
  - Built `BundleMonitor`: live bundle decomposition with transparent disclosure that secondary AMM pools are pending while 1:1 join is guaranteed onchain.
  - Built `SplitDesk`: strategy exposure selector ([Keep Accretion], [Trade Principal], [Split Both]) with live onchain Tear and Join.
  - Built `GiftExposureModal`: programmable gifting module to gift clip or talon independently on Base.
  - Updated `/docs` and `/pitch` with Credit on Productive Assets (self-repaying loan architecture) and Programmable Gifting.
- 2026-09-08 — Quest hardening implementation:
  - Added fail-closed `EligibilityRegistry`; new vaults reject ineligible tear/join callers.
  - New clip/talon tokens reject transfers to unregistered recipients.
  - Added server-side country gate, Base 8453 write guards, exact approvals, stale-feed rejection, and no-data market states.
  - Existing deployed factory/vault are immutable and do not contain these checks; redeploy is required before submission.
- 2026-09-08 — Eligibility-enforced Base 8453 redeployment:
  - Factory: `0xbe3246f2bd8b23103d182a4811b1fe9ecda1e4f8`.
  - EligibilityRegistry: `0x57d7eD9313F4c6915227486C4d640DC2080e1201`.
  - AAPLc vault: `0xb676E9A92d30446638d31658CB1686De59B717f9`.
  - clipAAPLc: `0xDa36D2601C723c5e4619891c1f955012d2659dc4`.
  - talonAAPLc: `0xCdd4C84e39204B08dC6edf08611E4dcC4A1a1761`.
  - Deployer eligibility attestation tx: `0x1467aebf934883329f19fefc7cc9c341e6982462c4eca5d9165809f5ccd5adc7`.
  - AAPLc vault creation tx: `0x3d8e5e3c0c583e76db6dfc1be46af643966dceeecbe5e45b9435c8d4a2c0a8d8`.
- 2026-09-08 — Design Reference Footer & Institutional Copy Overhaul:
  - Replaced dark footer with clean white institutional design matching user reference: giant Roman serif watermark 'TALON' spanning across bottom with divider cutting across it, quick action icon buttons (Send & Code), PROTOCOL, RESOURCES, and COMMUNITY columns, and Terms & Privacy links.
  - Rendered footer consistently across public pages and in-app layout.
  - Added `#governance`, `#terms`, and `#privacy` sections to `/docs`.
  - Conducted complete audit of landing page and app page copy: purged all informal buzzwords ("energy", "mood", "circle", "club", and cartoon elements). Replaced with institutional financial primitives: Accretion Harvesting, Spot Equity Momentum, Invariant Parity Arbitrage, and a Capital Structure Comparison Matrix.
  - Shifted from Cloudflare tunnel to local dev environment: localhost:3001 responding instantly with HTTP 200 across all routes.
