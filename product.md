# Product

Reference: https://xstream-xstocks.vercel.app/  
Copy the **IA**, not the rebase math and not the APY poster.

## Surfaces

| Route | Job |
| ----- | --- |
| `/` | Hero, 01–03 how it works, two-token diagram, four personas, FAQ, Open app |
| `/app` | Vault: pick official B20, tear / join, live multiplier |
| `/app/markets` | Clip and talon vs USDC — only pairs that exist onchain |
| `/app/portfolio` | Wallet raw B20, clip, talon, entry vs live multiplier, share-equivalent |
| `/app/auction` | Phase 2. Do not fake an auction book. Hide the nav item until the contract exists. |

## Tokens

- **clip{TICKER}** — claim on multiplier growth after entry. Transferable only between eligible registered wallets.
- **talon{TICKER}** — claim on raw vault tokens. Principal leg; transferable only between eligible registered wallets.

Together they redeem 1:1 raw underlying. Always.

## Personas (same as xStream, B20-accurate)

- Alice holds clip, wants accretion without the chart.
- Bob holds or trades talon for price.
- Carol tears, sells talon into a real market, keeps clip.
- Dave arbs clip + talon vs B20 when the bundle dislocates.

## Fees (protocol, not theater)

Start at 0. Tear/join fee can be 0.05% later, split toward clip holders. Do not display fee APY until fees have actually been paid onchain.

## What xStream does that we delay

- Session-gated leverage exchange for px  
- Dx lease auction  
- 8 testnet assets  

Those are roadmap. Phase 0 ships only the AAPLc vault, live data, eligibility controls, and honest empty markets state.
