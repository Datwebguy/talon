import { http, createConfig, fallback } from "wagmi";
import { base } from "wagmi/chains";
import { injected, coinbaseWallet } from "wagmi/connectors";

export const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({ appName: "Talon Protocol" }),
    injected({ target: "metaMask" }),
    injected({ target: "okxWallet" }),
    injected({ target: "phantom" }),
    injected(),
  ],
  multiInjectedProviderDiscovery: true,
  transports: {
    [base.id]: fallback([
      http("https://mainnet.base.org"),
      http("https://base.llamarpc.com"),
      http("https://base-rpc.publicnode.com"),
      http(),
    ]),
  },
  ssr: true,
});
