"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useWalletModal } from "../context/WalletModalContext";
import {
  X,
  Wallet,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  LogOut,
  AlertCircle,
  Loader2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { TalonLogo } from "./TalonLogo";

// Official High-Fidelity SVG icons for popular Web3 wallets
function CoinbaseIcon({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`shrink-0 rounded-xl overflow-hidden shadow-sm flex items-center justify-center ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="28" height="28" rx="6" fill="#2C5FF6" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14 23.8C19.4124 23.8 23.8 19.4124 23.8 14C23.8 8.58761 19.4124 4.2 14 4.2C8.58761 4.2 4.2 8.58761 4.2 14C4.2 19.4124 8.58761 23.8 14 23.8ZM11.55 10.8C11.1358 10.8 10.8 11.1358 10.8 11.55V16.45C10.8 16.8642 11.1358 17.2 11.55 17.2H16.45C16.8642 17.2 17.2 16.8642 17.2 16.45V11.55C17.2 11.1358 16.8642 10.8 16.45 10.8H11.55Z"
          fill="white"
        />
      </svg>
    </div>
  );
}

function MetaMaskIcon({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`shrink-0 rounded-xl overflow-hidden shadow-sm bg-white p-0.5 flex items-center justify-center ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 28 28">
        <path fill="#fff" d="M0 0h28v28H0z" />
        <g clipPath="url(#mm-official-clip)">
          <path fill="#ff5c16" d="m24.024 23.824-4.846-1.434-3.655 2.172-2.55-.001-3.656-2.171-4.844 1.434L3 18.88l1.473-5.488L3 8.751 4.473 3l7.569 4.496h4.413L24.024 3l1.473 5.751-1.473 4.64 1.473 5.488z" />
          <path fill="#ff5c16" d="m4.474 3 7.57 4.499-.302 3.087zm4.844 15.881 3.33 2.522-3.33.987zm3.064-4.17-.64-4.123-4.097 2.804h-.002v.001l.013 2.886 1.661-1.567zM24.024 3l-7.57 4.499.3 3.087zM19.18 18.881l-3.33 2.522 3.33.987zm1.674-5.488v-.002zl-4.097-2.804-.64 4.124h3.064l1.662 1.567z" />
          <path fill="#e34807" d="m9.317 22.39-4.844 1.434L3 18.881h6.317zm3.064-7.68.925 5.962-1.282-3.315-4.37-1.078 1.662-1.568zm6.799 7.68 4.844 1.434 1.473-4.943H19.18zm-3.064-7.68-.925 5.962 1.282-3.315 4.37-1.078-1.663-1.568z" />
          <path fill="#ff8d5d" d="m3 18.88 1.473-5.489h3.169l.012 2.887 4.37 1.078 1.282 3.314-.659.73-3.33-2.522H3zm22.497 0-1.473-5.489h-3.17l-.01 2.887-4.371 1.078-1.282 3.314.659.73 3.33-2.522h6.317zM16.455 7.495h-4.413l-.3 3.087 1.565 10.084h1.884l1.565-10.084z" />
          <path fill="#661800" d="M4.473 3 3 8.751l1.473 4.64h3.169l4.1-2.805zm6.992 12.908H10.03l-.781.761 2.776.685-.56-1.447M24.024 3l1.473 5.751-1.473 4.64h-3.17l-4.098-2.805zm-6.99 12.908h1.437l.782.762-2.78.686.56-1.45zm-1.512 6.687.328-1.193-.66-.73h-1.885l-.659.73.327 1.192" />
          <path fill="#c0c4cd" d="M15.522 22.594v1.969h-2.548v-1.969z" />
          <path fill="#e7ebf6" d="m9.318 22.388 3.658 2.174v-1.969l-.328-1.192zm9.862 0-3.658 2.174v-1.969l.328-1.192z" />
        </g>
        <defs>
          <clipPath id="mm-official-clip">
            <path fill="#fff" d="M3 3h22.5v21.563H3z" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function OKXIcon({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`shrink-0 rounded-xl overflow-hidden shadow-sm flex items-center justify-center ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 28 28">
        <rect width="28" height="28" rx="6" fill="#000000" />
        <path
          fill="#FFFFFF"
          fillRule="evenodd"
          d="M10.819 5.556H5.93a.376.376 0 0 0-.375.375v4.888c0 .207.168.375.375.375h4.888a.376.376 0 0 0 .375-.376V5.932a.376.376 0 0 0-.376-.375Zm5.64 5.638h-4.886a.376.376 0 0 0-.376.376v4.887c0 .208.168.376.376.376h4.887a.376.376 0 0 0 .376-.375V11.57a.376.376 0 0 0-.376-.377Zm.75-5.638h4.887c.208 0 .376.168.376.375v4.888a.376.376 0 0 1-.376.375H17.21a.376.376 0 0 1-.376-.376V5.933c0-.208.169-.376.376-.376Zm-6.39 11.277H5.93a.376.376 0 0 0-.375.376v4.887c0 .208.168.376.375.376h4.888a.376.376 0 0 0 .375-.376V17.21a.376.376 0 0 0-.376-.376Zm6.39 0h4.887c.208 0 .376.169.376.376v4.887a.376.376 0 0 1-.376.376H17.21a.376.376 0 0 1-.376-.376V17.21c0-.207.169-.376.376-.376Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

function PhantomIcon({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`shrink-0 rounded-xl overflow-hidden shadow-sm flex items-center justify-center ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 28 28">
        <rect width="28" height="28" rx="6" fill="#AB9FF2" />
        <path
          fill="#FFFDF8"
          fillRule="evenodd"
          d="M12.063 18.128c-1.173 1.796-3.137 4.07-5.75 4.07-1.236 0-2.424-.51-2.424-2.719 0-5.627 7.682-14.337 14.81-14.337 4.056 0 5.671 2.813 5.671 6.008 0 4.101-2.66 8.79-5.306 8.79-.84 0-1.252-.46-1.252-1.192 0-.19.032-.397.095-.62-.902 1.542-2.645 2.973-4.276 2.973-1.188 0-1.79-.747-1.79-1.797 0-.381.079-.778.222-1.176Zm9.63-7.089c0 .931-.549 1.397-1.163 1.397-.624 0-1.164-.466-1.164-1.397 0-.93.54-1.396 1.164-1.396.614 0 1.164.465 1.164 1.396Zm-3.49 0c0 .931-.55 1.397-1.164 1.397-.624 0-1.164-.466-1.164-1.397 0-.93.54-1.396 1.164-1.396.614 0 1.164.465 1.164 1.396Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

function RabbyIcon({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`shrink-0 rounded-xl overflow-hidden shadow-sm flex items-center justify-center ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 28 28">
        <rect width="28" height="28" rx="6" fill="#8697FF" />
        <path
          fill="#FFFFFF"
          d="M22.54 15.078c.677-1.514-2.673-5.744-5.874-7.506-2.017-1.365-4.12-1.178-4.545-.579-.935 1.316 3.094 2.43 5.788 3.731-.58.252-1.125.703-1.446 1.28-1.004-1.096-3.209-2.04-5.796-1.28-1.743.513-3.191 1.721-3.751 3.546a1.097 1.097 0 1 0-.445 2.1c.112 0 .463-.075.463-.075l5.612.041c-2.244 3.56-4.018 4.081-4.018 4.698s1.697.45 2.335.22c3.05-1.1 6.327-4.531 6.89-5.519 2.36.295 4.345.33 4.786-.657Z"
        />
      </svg>
    </div>
  );
}

function RainbowIcon({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`shrink-0 rounded-xl overflow-hidden shadow-sm flex items-center justify-center ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="28" height="28" rx="6" fill="#001428" />
        <path d="M4.6 20.5c0-5.2 4.2-9.4 9.4-9.4s9.4 4.2 9.4 9.4" stroke="#FF4000" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M7.8 20.5c0-3.4 2.8-6.2 6.2-6.2s6.2 2.8 6.2 6.2" stroke="#FFB020" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M11 20.5c0-1.7 1.3-3 3-3s3 1.3 3 3" stroke="#00D090" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function BrowserWalletIcon({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`shrink-0 rounded-xl bg-[#EEF2FF] border border-[#010FEE]/20 flex items-center justify-center text-[#010FEE] shadow-sm ${className}`}>
      <Wallet className="w-5 h-5" />
    </div>
  );
}

export function WalletModal() {
  const { isOpen, view, closeModal, openSelectModal } = useWalletModal();
  const { address, isConnected } = useAccount();
  const { connectors, connectAsync, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnectWallet = async (connector: any) => {
    setConnectingId(connector.id);
    setConnectError(null);
    try {
      if (connector.isVirtual) {
        // If user clicks OKX and it's already in window
        if (typeof window !== "undefined" && (window as any).okxwallet) {
          const injectedConn = connectors.find(
            (c) => c.id === "injected" || c.name.toLowerCase().includes("injected")
          );
          if (injectedConn) {
            await connectAsync({ connector: injectedConn });
            closeModal();
            return;
          }
        }
        // Direct to official extension
        window.open("https://www.okx.com/web3", "_blank");
        setConnectError("OKX Wallet extension page opened. After installing, refresh the page to connect.");
        return;
      }

      await connectAsync({ connector });
      closeModal();
    } catch (err: any) {
      console.error("Connection error:", err);
      if (
        err.message?.includes("User rejected") ||
        err.name === "UserRejectedRequestError"
      ) {
        setConnectError(
          "Connection request was rejected in your wallet. Please click again to approve."
        );
      } else {
        setConnectError(
          err.shortMessage ||
            err.message ||
            "Failed to connect to wallet. Please unlock your extension."
        );
      }
    } finally {
      setConnectingId(null);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    closeModal();
  };

  const handleSwitchWallet = () => {
    disconnect();
    openSelectModal();
  };

  // Helper to resolve wallet display details
  const getWalletDetails = (c: any) => {
    const id = c.id.toLowerCase();
    const name = c.name.toLowerCase();

    if (id.includes("coinbase") || name.includes("coinbase")) {
      return {
        displayName: "Coinbase Wallet",
        sub: "Coinbase Extension & Smart Wallet",
        badge: "Base Native",
        icon: <CoinbaseIcon />,
      };
    }
    if (id.includes("metamask") || name.includes("metamask")) {
      return {
        displayName: "MetaMask",
        sub: "Installed Web3 Extension",
        badge: null,
        icon: <MetaMaskIcon />,
      };
    }
    if (id.includes("okx") || name.includes("okx")) {
      return {
        displayName: "OKX Wallet",
        sub: "OKX Web3 Wallet Extension",
        badge: null,
        icon: <OKXIcon />,
      };
    }
    if (id.includes("phantom") || name.includes("phantom")) {
      return {
        displayName: "Phantom",
        sub: "Phantom Multi-Chain Extension",
        badge: null,
        icon: <PhantomIcon />,
      };
    }
    if (id.includes("rabby") || name.includes("rabby")) {
      return {
        displayName: "Rabby Wallet",
        sub: "DeFi Browser Extension",
        badge: null,
        icon: <RabbyIcon />,
      };
    }
    if (id.includes("rainbow") || name.includes("rainbow")) {
      return {
        displayName: "Rainbow",
        sub: "Rainbow Web3 Wallet",
        badge: null,
        icon: <RainbowIcon />,
      };
    }
    return {
      displayName: c.name === "Injected" ? "Default Browser Wallet" : c.name,
      sub: "Installed Web3 Provider",
      badge: null,
      icon: <BrowserWalletIcon />,
    };
  };

  // Curated, sorted list of connectors
  const sortedConnectors = (() => {
    const list = [...connectors];
    const hasOkx = list.some(
      (c) =>
        c.id.toLowerCase().includes("okx") ||
        c.name.toLowerCase().includes("okx")
    );

    // If OKX is not detected in browser, add virtual entry so user can always see and connect it
    if (!hasOkx) {
      list.push({
        id: "okxWallet",
        name: "OKX Wallet",
        type: "injected",
        isVirtual: true,
      } as any);
    }

    // Deduplicate by clean name
    const seen = new Set<string>();
    const unique = list.filter((c) => {
      const details = getWalletDetails(c);
      if (seen.has(details.displayName)) return false;
      seen.add(details.displayName);
      return true;
    });

    // Custom priority: Coinbase first (Base native), then MetaMask, OKX, Phantom, Rabby, Rainbow, and generic at the bottom
    const getRank = (c: any) => {
      const id = c.id.toLowerCase();
      const name = c.name.toLowerCase();
      if (id.includes("coinbase") || name.includes("coinbase")) return 1;
      if (id.includes("metamask") || name.includes("metamask")) return 2;
      if (id.includes("okx") || name.includes("okx")) return 3;
      if (id.includes("phantom") || name.includes("phantom")) return 4;
      if (id.includes("rabby") || name.includes("rabby")) return 5;
      if (id.includes("rainbow") || name.includes("rainbow")) return 6;
      return 99; // Generic Browser Wallet last
    };

    unique.sort((a, b) => getRank(a) - getRank(b));
    return unique;
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md rounded-[28px] bg-white border border-[#E2E8F4] shadow-[0_25px_70px_rgba(0,0,0,0.18)] p-6 sm:p-8 z-10 space-y-6 text-[#050B24] animate-scaleUp">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2.5">
            <TalonLogo className="w-7 h-7" size={28} rounded="lg" />
            <h2 className="text-xl font-black tracking-tight text-[#050B24]">
              {view === "select" ? "Connect Wallet" : "Connected Wallet"}
            </h2>
          </div>
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-[#F8FAFC] hover:bg-[#EEF2FF] text-[#64748B] hover:text-[#010FEE] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View 1: Select Wallet */}
        {view === "select" ? (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Select your preferred wallet extension or provider to connect to Base Mainnet.
            </p>

            {/* Error Message */}
            {connectError && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-900">Wallet Notice</div>
                  <div className="mt-0.5 leading-relaxed">{connectError}</div>
                </div>
              </div>
            )}

            {/* List of Curated Wallet Connectors */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {sortedConnectors.map((c) => {
                const isThisConnecting = connectingId === c.id;
                const details = getWalletDetails(c);

                return (
                  <button
                    key={c.id}
                    onClick={() => handleConnectWallet(c)}
                    disabled={isPending && !isThisConnecting}
                    className="w-full p-3.5 sm:p-4 rounded-2xl bg-[#F8FAFC] hover:bg-[#EEF2FF] border border-[#E2E8F4] hover:border-[#010FEE]/40 transition-all flex items-center justify-between group disabled:opacity-50 text-left shadow-sm"
                  >
                    <div className="flex items-center gap-3.5">
                      {details.icon}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#050B24] group-hover:text-[#010FEE] transition-colors">
                            {details.displayName}
                          </span>
                          {details.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#010FEE] border border-[#010FEE]/20">
                              {details.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#64748B] font-medium mt-0.5">
                          {details.sub}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isThisConnecting ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#010FEE] text-xs font-bold shadow-sm">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Approve...</span>
                        </div>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#010FEE] group-hover:translate-x-0.5 transition-all" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Security note footer */}
            <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#010FEE]" />
                Base Mainnet
              </span>
              <a
                href="https://base.org"
                target="_blank"
                rel="noreferrer"
                className="text-[#010FEE] hover:underline font-bold text-[11px]"
              >
                base.org
              </a>
            </div>
          </div>
        ) : (
          /* View 2: Account Overview & Wallet Switcher */
          <div className="space-y-5">
            {/* Address Banner */}
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F4] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                  Active Account
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#010FEE] text-[10px] font-bold border border-[#010FEE]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#010FEE] animate-pulse"></span>
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="font-mono text-sm sm:text-base font-bold text-[#050B24] truncate">
                  {address}
                </div>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-xl bg-white hover:bg-[#EEF2FF] text-[#64748B] hover:text-[#010FEE] border border-[#E2E8F4] transition-colors shrink-0 shadow-sm"
                  title="Copy Full Address"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-[#010FEE]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="pt-2 border-t border-[#E2E8F4] flex items-center justify-between text-xs">
                <span className="text-[#64748B] font-medium">Network</span>
                <span className="font-bold text-[#050B24]">Base Mainnet</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              {/* Basescan explorer */}
              <a
                href={`https://basescan.org/address/${address}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-full bg-white hover:bg-[#F8FAFC] border border-[#E2E8F4] hover:border-[#010FEE] text-xs font-bold text-[#050B24] hover:text-[#010FEE] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>View on Basescan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Switch Wallet Button */}
              <button
                onClick={handleSwitchWallet}
                className="w-full py-3 px-4 rounded-full bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-[#010FEE]/20 text-xs font-bold text-[#010FEE] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Switch to Another Wallet (MetaMask, Coinbase, etc.)</span>
              </button>

              {/* Disconnect Button */}
              <button
                onClick={handleDisconnect}
                className="w-full py-3 px-4 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-bold text-red-600 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
