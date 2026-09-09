import { http, createConfig, fallback } from "wagmi";
import { base } from "wagmi/chains";
import { injected, coinbaseWallet } from "wagmi/connectors";

const okxWalletTarget = {
  id: "okxWallet",
  name: "OKX Wallet",
  provider: (window?: any) => {
    const browser = window as {
      okxwallet?: { ethereum?: unknown };
      ethereum?: { providers?: Array<{ isOkxWallet?: boolean; isOKExWallet?: boolean }> };
    };

    return (
      browser?.okxwallet?.ethereum ??
      browser?.okxwallet ??
      browser?.ethereum?.providers?.find(
        (provider) => provider.isOkxWallet || provider.isOKExWallet
      )
    );
  },
};

export const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({ appName: "Talon Protocol" }),
    injected({ target: "metaMask" }),
    injected({ target: okxWalletTarget as any }),
    injected({ target: "phantom" }),
    injected({ target: "rabby" }),
    injected({ target: "rainbow" }),
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
