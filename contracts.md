# Contracts

## Official (verify base.org/stocks)
AAPLc    0xb200000000000000000000C2e324d24d7eEcd1fb
NVDAc    0xb20000000000000000000078ee7ce2fE4908108C
GOOGLc   0xb2000000000000000000002D0BA3164cc74f58B7
METAc    0xb2000000000000000000008bC8786B856E61707C
Registry 0x3f3E8cf41cdd3b1D118c16471aB0113DfDDd5CaD
AAPL feed 0x787f13dEa48Db0897CbCDD985de77809D837F988
USDC Base  0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

EligibilityRegistry (Base 8453) 0x57d7eD9313F4c6915227486C4d640DC2080e1201
TalonFactory (eligibility enforced) 0xbe3246f2bd8b23103d182a4811b1fe9ecda1e4f8
AAPLc TalonVault 0xb676E9A92d30446638d31658CB1686De59B717f9
clipAAPLc 0xDa36D2601C723c5e4619891c1f955012d2659dc4
talonAAPLc 0xCdd4C84e39204B08dC6edf08611E4dcC4A1a1761

Match `decimals()` from the underlying. Do not assume 18.

## Layout

TalonFactory.sol
TalonVault.sol        tear / join
ClipToken.sol         ERC-20 + index hooks
TalonToken.sol        ERC-20
interfaces/IB20.sol   multiplier, scaled helpers, pause if present
Owner: pause, fee BPS (default 0), official-underlying allowlist.

## Tests

tear/join 1:1 raw; cannot join one-sided; factory rejects unknown token; multiplier read does not mutate balances.

Fork-test against Base mainnet AAPLc if the RPC allows. Prefer that over a local mock B20.
