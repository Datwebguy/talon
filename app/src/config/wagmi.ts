import { http, createConfig, fallback } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

export const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({ appName: "Talon Protocol" }),
  ],
  // EIP 6963 discovers each installed wallet as its own connector. It avoids
  // a generic window.ethereum connector selecting one extension for everyone.
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
