"use client";

import { ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";
import { WagmiProvider as PrivyWagmiProvider } from "@privy-io/wagmi";
import { PrivyProvider } from "@privy-io/react-auth";
import { base } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config, privyWagmiConfig } from "../config/wagmi";
import { WalletModalProvider } from "../context/WalletModalContext";
import { WalletModal } from "./WalletModal";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export function Web3Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 10_000,
          },
        },
      })
  );

  if (PRIVY_APP_ID) {
    return (
      <PrivyProvider
        appId={PRIVY_APP_ID}
        config={{
          loginMethods: ["email", "wallet", "google", "twitter", "apple"],
          appearance: {
            theme: "dark",
            accentColor: "#010FEE",
            logo: "https://talononbase.tech/icon.png",
          },
          defaultChain: base,
          supportedChains: [base],
          embeddedWallets: {
            ethereum: {
              createOnLogin: "users-without-wallets",
            },
          },
        }}
      >
        <QueryClientProvider client={queryClient}>
          <PrivyWagmiProvider config={privyWagmiConfig}>
            <WalletModalProvider>
              {children}
              <WalletModal isPrivyEnabled={true} />
            </WalletModalProvider>
          </PrivyWagmiProvider>
        </QueryClientProvider>
      </PrivyProvider>
    );
  }

  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <WalletModalProvider>
          {children}
          <WalletModal isPrivyEnabled={false} />
        </WalletModalProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
