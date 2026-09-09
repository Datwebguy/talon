"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useDisconnect } from "wagmi";
import { useWalletModal } from "../context/WalletModalContext";
import { Wallet, ExternalLink, ChevronDown } from "lucide-react";
import { TalonLogo } from "./TalonLogo";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openSelectModal, openAccountModal } = useWalletModal();

  if (pathname.startsWith("/app")) {
    return null;
  }

  const navLinks = [
    { name: "App", href: "/app" },
    { name: "Vault", href: "/app/vault" },
    { name: "Markets", href: "/app/markets" },
    { name: "Portfolio", href: "/app/portfolio" },
    { name: "Docs", href: "/docs" },
  ];

  return (
    <header className="border-b border-[#E2E8F4] dark:border-[#1E294B] bg-white/95 dark:bg-[#060919]/95 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center space-x-3 sm:space-x-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <TalonLogo className="w-8 h-8" size={32} rounded="xl" />
            <div className="flex flex-col">
              <span className="font-black text-base tracking-tight text-[#050B24] dark:text-white group-hover:text-[#010FEE] dark:group-hover:text-blue-400 transition-colors">
                TALON
              </span>
              <span className="hidden sm:flex text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium tracking-tight items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#010FEE] inline-block animate-pulse"></span>
                Base Mainnet
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 font-bold shadow-xs"
                      : "text-[#475569] dark:text-[#94A3B8] hover:text-[#010FEE] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#0D152F]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex shrink-0 items-center space-x-2 sm:space-x-3">
          <ThemeToggle />

          <a
            href="https://base.org/stocks"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#010FEE] dark:hover:text-white transition-colors"
          >
            <span>base.org/stocks</span>
            <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
          </a>

          {isConnected && address ? (
            <div className="flex items-center gap-2">
              <button
                onClick={openAccountModal}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-xs border bg-[#F8FAFC] dark:bg-[#0D152F] hover:bg-[#EEF2FF] dark:hover:bg-[#162044] border-[#E2E8F4] dark:border-[#1E294B] hover:border-[#010FEE]/40 text-[#050B24] dark:text-white transition-all shadow-xs group"
                title="Manage Connected Wallet"
              >
                <span className="w-2 h-2 rounded-full bg-[#010FEE]"></span>
                <span className="font-bold">{address.slice(0, 4)}...{address.slice(-3)}</span>
                <ChevronDown className="w-3 h-3 text-[#64748B] group-hover:text-[#010FEE]" />
              </button>
              <button
                onClick={() => disconnect()}
                className="hidden sm:block px-3 py-1.5 border border-[#E2E8F4] dark:border-[#1E294B] hover:border-red-500 rounded-full text-xs text-[#64748B] dark:text-[#94A3B8] hover:text-red-500 transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={openSelectModal}
              className="flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-xs font-bold transition-all shadow-[0_4px_16px_rgba(1,15,238,0.25)]"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
