import { http, createConfig, fallback } from "wagmi";
import { base } from "wagmi/chains";
import { injected, coinbaseWallet } from "wagmi/connectors";

export const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({ appName: "Talon Protocol" }),
    injected({ target: "isMetaMask" }),
    injected({ target: "isOkxWallet" }),
    injected({ target: "isPhantom" }),
    injected({ target: "isRabby" }),
    injected({ target: "isRainbow" }),
  ],
  // Do not create a generic connector that silently binds to one extension.
  multiInjectedProviderDiscovery: false,
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
