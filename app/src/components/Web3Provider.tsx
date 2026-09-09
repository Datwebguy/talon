"use client";

import { ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "../config/wagmi";
import { WalletModalProvider } from "../context/WalletModalContext";
import { WalletModal } from "./WalletModal";

// Defensive guard against browser extensions (e.g. Phantom, MetaMask) conflicting on window.ethereum
if (typeof window !== "undefined") {
  try {
    const origDef = Object.defineProperty;
    Object.defineProperty = function (obj: any, prop: any, desc: any) {
      if (obj === window && prop === "ethereum") {
        try {
          return origDef.call(this, obj, prop, { ...desc, configurable: true });
        } catch {
          return obj;
        }
      }
      return origDef.call(this, obj, prop, desc);
    };
  } catch {}

  window.addEventListener(
    "error",
    (e) => {
      const msg = e?.message || e?.error?.message;
      const file = e?.filename;
      if (
        (typeof msg === "string" &&
          (msg.includes("redefine property: ethereum") ||
            msg.includes("Cannot redefine property"))) ||
        (typeof file === "string" && file.includes("evmAsk.js"))
      ) {
        e.stopImmediatePropagation?.();
        e.preventDefault?.();
      }
    },
    true
  );
}

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
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletModalProvider>
          {children}
          <WalletModal />
        </WalletModalProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
