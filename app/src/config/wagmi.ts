import { http, createConfig as createWagmiConfig, fallback } from "wagmi";
import { createConfig as createPrivyConfig } from "@privy-io/wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, walletConnect, injected } from "wagmi/connectors";

// Standard fallback WalletConnect project ID or custom env
const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "3fcc6bba6f1de962d911bb5b5c3dba68";

export const config = createWagmiConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: "Talon Protocol",
      appLogoUrl: "https://talononbase.tech/icon.png",
      preference: "all", // Enables FaceID / TouchID Smart Wallet passkeys for mobile Safari/Chrome & desktop
    }),
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      showQrModal: true,
    }),
    injected(),
  ],
  // EIP 6963 discovers each installed wallet as its own connector
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

export const privyWagmiConfig = createPrivyConfig({
  chains: [base],
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
