"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { useWalletModal } from "../context/WalletModalContext";
import {
  LayoutDashboard,
  Layers,
  TrendingUp,
  Briefcase,
  BookOpen,
  Wallet,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { TalonLogo } from "./TalonLogo";
import { ThemeToggle } from "./ThemeToggle";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { address, isConnected, chainId } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { disconnect } = useDisconnect();
  const { openSelectModal, openAccountModal } = useWalletModal();

  const [mobileOpen, setMobileOpen] = useState(false);
  const wrongChain = isConnected && chainId !== 8453;

  // Proactively prefetch all app sections so clicking sidebar is instantaneous
  useEffect(() => {
    router.prefetch("/app");
    router.prefetch("/app/vault");
    router.prefetch("/app/markets");
    router.prefetch("/app/portfolio");
    router.prefetch("/docs");
  }, [router]);

  const navItems = [
    { name: "Dashboard", href: "/app", icon: LayoutDashboard },
    { name: "Vault", href: "/app/vault", icon: Layers },
    { name: "Markets", href: "/app/markets", icon: TrendingUp },
    { name: "Portfolio", href: "/app/portfolio", icon: Briefcase },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5 bg-white dark:bg-[#080D26] border-r border-[#E2E8F4] dark:border-[#1E294B] transition-colors">
      <div className="space-y-5">
        {/* Logo */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <TalonLogo className="w-8 h-8" size={32} rounded="xl" />
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-[#050B24] dark:text-white group-hover:text-[#010FEE] dark:group-hover:text-blue-400 transition-colors">
                TALON
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F8FAFC] dark:hover:bg-[#162044]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Network & Connect Cluster */}
        <div className="space-y-2 pt-1">
          {/* Network pill */}
          <div className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-bold transition-colors ${wrongChain ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200" : "bg-[#F8FAFC] dark:bg-[#0D152F] border-[#E2E8F4] dark:border-[#1E294B] text-[#050B24] dark:text-white"}`}>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full inline-block ${wrongChain ? "bg-amber-500" : "bg-[#010FEE] animate-pulse"}`}></span>
              <span>{wrongChain ? "Wrong network" : "Base Mainnet"}</span>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${wrongChain ? "bg-amber-200 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200" : "text-[#010FEE] dark:text-blue-400 bg-[#EEF2FF] dark:bg-blue-950/60"}`}>{wrongChain ? `Chain ${chainId}` : "Live"}</span>
          </div>

          {/* Connect Button */}
          {isConnected && address ? (
            <button
              onClick={() => wrongChain ? switchChain({ chainId: 8453 }) : openAccountModal()}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-mono font-bold transition-all shadow-xs group cursor-pointer ${wrongChain ? "border-amber-300 bg-amber-100 text-amber-900 hover:border-amber-500 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200" : "bg-[#EEF2FF] dark:bg-[#0D152F] border-[#010FEE]/20 dark:border-[#1E294B] hover:border-[#010FEE] text-[#010FEE] dark:text-blue-400"}`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${wrongChain ? "bg-amber-500" : "bg-[#010FEE]"}`}></span>
                <span>{wrongChain ? (isSwitching ? "Switching to Base…" : "Switch to Base Mainnet") : `${address.slice(0, 6)}...${address.slice(-4)}`}</span>
              </div>
              {wrongChain ? <ExternalLink className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />}
            </button>
          ) : (
            <button
              onClick={openSelectModal}
              className="w-full py-2.5 px-4 rounded-xl bg-[#010FEE] hover:bg-[#000ED6] text-white text-xs font-bold transition-all shadow-[0_4px_16px_rgba(1,15,238,0.25)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Connect Wallet</span>
            </button>
          )}

          {/* Link to base.org */}
          <a
            href="https://base.org/stocks"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 text-[11px] text-[#64748B] dark:text-[#94A3B8] hover:text-[#010FEE] dark:hover:text-blue-400 transition-colors py-1"
          >
            <span>Official Coinbase Stocks</span>
            <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
          </a>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === "/app" && pathname === "/app");
            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#EEF2FF] dark:bg-blue-950/70 text-[#010FEE] dark:text-blue-400 shadow-xs"
                    : "text-[#475569] dark:text-[#94A3B8] hover:text-[#050B24] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#0D152F]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-[#010FEE] dark:text-blue-400" : "text-[#64748B] dark:text-[#94A3B8]"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#010FEE] dark:bg-blue-400"></span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer with Theme Toggle */}
      <div className="pt-4 border-t border-[#E2E8F4] dark:border-[#1E294B] space-y-3 text-left">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8]">
            Theme
          </span>
          <ThemeToggle />
        </div>

        <Link
          href="/docs"
          className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold text-[#64748B] dark:text-[#94A3B8] hover:text-[#010FEE] dark:hover:text-blue-400 hover:bg-[#F8FAFC] dark:hover:bg-[#0D152F] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4" />
            <span>Documentation</span>
          </div>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </Link>
        <div className="px-3 pt-0.5">
          <div className="text-xs font-black text-[#050B24] dark:text-white">Talon Protocol</div>
          <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-tight font-medium">
            Split one official stock into two clear exposures.
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#080D26] border-b border-[#E2E8F4] dark:border-[#1E294B] sticky top-0 z-40 transition-colors">
        <Link href="/" className="flex items-center gap-2">
          <TalonLogo className="w-7 h-7" size={28} rounded="lg" />
          <span className="font-black text-base text-[#050B24] dark:text-white">TALON</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle variant="icon" />
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] text-[#050B24] dark:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block w-60 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>
    </>
  );
}
