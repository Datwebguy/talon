"use client";

import { ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "../config/wagmi";
import { WalletModalProvider } from "../context/WalletModalContext";
import { WalletModal } from "./WalletModal";

export function Web3Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 10_000,
      },
    },
  }));

  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <WalletModalProvider>
          {children}
          <WalletModal />
        </WalletModalProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
