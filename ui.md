# UI

Follow xStream’s ( https://xstream-xstocks.vercel.app/ and https://xstream-xstocks.vercel.app/app) pages and rhythm: dark desk, numbered 01–03, two-token split, personas, FAQ, then Open app.

## Landing `/`

Hero: Tear the stock. Keep the talon or keep the clip.  
Sub: Live on Base. Official Coinbase B20.  
How it works: Deposit → Mint clip + talon → Route / recombine.  
Diagram: B20 → VAULT → clip | talon  
Personas: Alice, Bob, Carol, Dave  
FAQ from `copy.md`  
CTA: Open app

Live stats on the landing (onchain only): markets created, raw B20 in vaults, current AAPLc multiplier. If a call fails, show “—”, not a placeholder number.

## App shell

Nav: Vault · Markets · Portfolio  
Auction hidden until shipped.

## Vault

Asset selector = official allowlist, address shown.  
Tear amount, preview clip+talon.  
Join amount.  
Live M, share-equivalent, pause state.

## Markets

List clip and talon. If no pool/market: “No liquidity onchain yet” + contract + add-to-wallet. No chart with fake series.

## Portfolio

Onchain balances only.
