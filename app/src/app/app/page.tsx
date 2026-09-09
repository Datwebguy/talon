"use client";

import React from "react";
import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { useB20Data } from "../../hooks/useB20Data";
import { useVault } from "../../hooks/useVault";
import { useLiveMarket } from "../../hooks/useLiveMarket";
import { useWalletModal } from "../../context/WalletModalContext";
import {
  OFFICIAL_TOKENS,
  AAPLC_VAULT_ADDRESS,
  B20_ABI,
} from "../../config/contracts";
import {
  Lock,
  Wallet,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { TalonLogo } from "../../components/TalonLogo";
import { SplitDesk } from "../../components/SplitDesk";
import {
  AppleLogo,
  NvidiaLogo,
  GoogleLogo,
  MetaLogo,
} from "../../components/CompanyLogos";

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const { openSelectModal } = useWalletModal();
  const aapl = OFFICIAL_TOKENS[0];

  const {
    formattedMultiplier,
    balanceVal,
    priceVal,
  } = useB20Data(aapl.address);

  const { clipBalance, talonBalance } = useVault(
    aapl.address,
    aapl.decimals
  );

  const { marketData } = useLiveMarket();
  const aaplQuote = marketData?.AAPL;

  // Read REAL onchain Vault balance of AAPLc
  const { data: rawVaultBalance } = useReadContract({
    address: aapl.address,
    abi: B20_ABI,
    functionName: "balanceOf",
    args: [AAPLC_VAULT_ADDRESS],
  });

  const vaultBalanceUnits = rawVaultBalance
    ? Number(formatUnits(rawVaultBalance, aapl.decimals))
    : 0;

  const currentPrice = aaplQuote?.price ?? priceVal;
  const vaultTvlUsd = vaultBalanceUnits > 0 && currentPrice !== null ? vaultBalanceUnits * currentPrice : null;
  const formattedTvl = vaultTvlUsd === null ? "—" : `$${vaultTvlUsd.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  // Calculate real user position value
  const clipUnits = Number(clipBalance) || 0;
  const talonUnits = Number(talonBalance) || 0;
  const userTotalUsd = isConnected && currentPrice !== null
    ? (balanceVal + talonUnits) * currentPrice
    : null;
  const formattedUserTotal = userTotalUsd === null ? "—" : `$${userTotalUsd.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const topStats = [
    {
      title: "TOTAL VALUE LOCKED",
      value: formattedTvl,
      change: vaultBalanceUnits > 0 ? `${vaultBalanceUnits.toFixed(4)} AAPLc` : "0.00 AAPLc",
      sub: "Active collateral on Base",
      icon: Lock,
      accent: "text-[#010FEE] dark:text-blue-400",
      badge: "Non-Custodial",
    },
    {
      title: "YOUR PORTFOLIO VALUE",
      value: isConnected ? formattedUserTotal : "$0.00",
      change: isConnected ? `${(balanceVal + talonUnits).toFixed(4)} AAPLc` : "Wallet disconnected",
      sub: isConnected ? "Verified onchain balance" : "Connect to view balance",
      icon: Wallet,
      accent: "text-emerald-600 dark:text-emerald-400",
      badge: isConnected ? "Connected" : "Inactive",
    },
    {
      title: "CLIP MULTIPLIER",
      value: formattedMultiplier || "1.0000x",
      change: "Onchain index",
      sub: "clipAAPLc multiplier",
      icon: TrendingUp,
      accent: "text-[#010FEE] dark:text-blue-400",
      badge: "Active",
    },
    {
      title: "SETTLEMENT",
      value: "Instant",
      change: "Base Mainnet",
      sub: "No debt in split flow",
      icon: ShieldCheck,
      accent: "text-emerald-600 dark:text-emerald-400",
      badge: "1:1 Backed",
    },
  ];

  const supportedAssets = [
    {
      symbol: "AAPLc",
      name: "Apple Inc.",
      Logo: AppleLogo,
      price: aaplQuote?.formattedPrice || (currentPrice ? `$${currentPrice.toFixed(2)}` : "—"),
      change: aaplQuote?.formattedChange || "—",
      isPositive: true,
      status: "Live Vault",
      isLive: true,
    },
    {
      symbol: "NVDAc",
      name: "NVIDIA Corp.",
      Logo: NvidiaLogo,
      price: marketData?.NVDA?.formattedPrice || "—",
      change: marketData?.NVDA?.formattedChange || "—",
      isPositive: true,
      status: "Coming Soon",
      isLive: false,
    },
    {
      symbol: "GOOGLc",
      name: "Alphabet Inc.",
      Logo: GoogleLogo,
      price: marketData?.GOOGL?.formattedPrice || "—",
      change: marketData?.GOOGL?.formattedChange || "—",
      isPositive: true,
      status: "Coming Soon",
      isLive: false,
    },
    {
      symbol: "METAc",
      name: "Meta Platforms",
      Logo: MetaLogo,
      price: marketData?.META?.formattedPrice || "—",
      change: marketData?.META?.formattedChange || "—",
      isPositive: true,
      status: "Coming Soon",
      isLive: false,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Clean Header */}
      <div>
        <div className="flex items-center gap-3">
          <TalonLogo className="w-8 h-8" size={32} rounded="xl" />
          <h1 className="text-3xl sm:text-4xl font-black text-[#050B24] dark:text-white tracking-tight">
          Home
          </h1>
        </div>
        <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] mt-1.5 font-medium">
          Split AAPLc into Clip and Talon.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/app/vault", label: "Split AAPLc", detail: "Mint Clip + Talon", tone: "bg-[#010FEE] text-white" },
          { href: "/app/markets", label: "Explore markets", detail: "Touch the live line", tone: "bg-white text-[#050B24] dark:bg-[#0D152F] dark:text-white" },
          { href: "/app/portfolio", label: "View portfolio", detail: "See your onchain claims", tone: "bg-white text-[#050B24] dark:bg-[#0D152F] dark:text-white" },
          { href: "/app/vault", label: "Gift exposure", detail: "Send Clip or Talon", tone: "bg-white text-[#050B24] dark:bg-[#0D152F] dark:text-white" },
        ].map((action) => (
          <Link key={action.href} href={action.href} className={`group rounded-2xl border border-[#E2E8F4] p-4 transition-all hover:-translate-y-0.5 hover:border-[#010FEE]/40 dark:border-[#1E294B] ${action.tone}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-black">{action.label}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
            <span className={`mt-1 block text-xs ${action.tone.includes("text-white") ? "text-white/65" : "text-[#64748B] dark:text-[#94A3B8]"}`}>{action.detail}</span>
          </Link>
        ))}
      </div>

      {/* 4 Aligned Summary Cards: Zero hyphens, clean typography */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] flex flex-col justify-between shadow-xs transition-all"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
                <span className="tracking-wide text-[11px] font-bold uppercase">{stat.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white dark:bg-[#172144] border border-[#E2E8F4] dark:border-[#2A3B6B] text-[#475569] dark:text-[#94A3B8]">
                  {stat.badge}
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-black text-[#050B24] dark:text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-xs font-bold ${stat.accent}`}>
                    {stat.change}
                  </span>
                  <span className="text-[11px] text-[#94A3B8] dark:text-[#64748B] truncate">
                    · {stat.sub}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Split Desk Console: Instant Deposit / Split / Recombine */}
      <SplitDesk />

      {/* Two Clean Action Panels: Supported Assets & Your Positions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Supported Coinbase Tokenized Stocks (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0D152F] rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#050B24] dark:text-white tracking-tight">
                Official stocks
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                Coinbase tokens supported on Base
              </p>
            </div>
            <Link
              href="/app/markets"
              className="text-xs font-bold text-[#010FEE] dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#F1F5F9] dark:divide-[#1E294B]">
            {supportedAssets.map((asset) => {
              const Logo = asset.Logo;
              return (
                <div
                  key={asset.symbol}
                  className="py-3.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#F8FAFC] dark:bg-[#172144] border border-[#E2E8F4] dark:border-[#2A3B6B] flex items-center justify-center p-2 shrink-0">
                      <Logo className="w-full h-full text-[#050B24] dark:text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#050B24] dark:text-white">
                          {asset.symbol}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            asset.isLive
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                              : "bg-[#F1F5F9] dark:bg-[#172144] text-[#64748B] dark:text-[#94A3B8]"
                          }`}
                        >
                          {asset.status}
                        </span>
                      </div>
                      <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-black font-mono text-[#050B24] dark:text-white">
                        {asset.price}
                      </div>
                      <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        {asset.change}
                      </div>
                    </div>

                    {asset.isLive ? (
                      <Link
                        href="/app/vault"
                        className="px-3.5 py-1.5 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 shrink-0"
                      >
                        <span>Deposit</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="px-3.5 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-[#172144] text-[#94A3B8] dark:text-[#64748B] text-xs font-bold cursor-not-allowed shrink-0"
                      >
                        Soon
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Portfolio Holdings Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0D152F] rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#050B24] dark:text-white tracking-tight">
                Your balances
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                Read from your wallet
              </p>
            </div>
            <Link
              href="/app/portfolio"
              className="text-xs font-bold text-[#010FEE] dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Portfolio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {!isConnected ? (
            <div className="py-10 text-center space-y-3 bg-[#F8FAFC] dark:bg-[#172144] rounded-2xl border border-[#E2E8F4] dark:border-[#2A3B6B] p-6">
              <div className="w-10 h-10 rounded-full bg-[#EEF2FF] dark:bg-blue-950/50 text-[#010FEE] dark:text-blue-400 flex items-center justify-center mx-auto">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Connect your wallet to inspect holdings and decomposed claims.
              </div>
              <button
                onClick={() => openSelectModal()}
                className="px-6 py-2.5 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-xs font-bold transition-all shadow-xs"
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* AAPLc */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#172144] border border-[#E2E8F4] dark:border-[#2A3B6B] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#050B24] dark:text-white">
                    AAPLc (Coinbase Tokenized Stock)
                  </div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    Raw tokenized equity
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-sm font-black text-[#050B24] dark:text-white">
                    {balanceVal.toFixed(4)}
                  </div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    {currentPrice === null ? "—" : `$${(balanceVal * currentPrice).toFixed(2)} USD`}
                  </div>
                </div>
              </div>

              {/* clipAAPLc */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#172144] border border-[#E2E8F4] dark:border-[#2A3B6B] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#010FEE] dark:text-blue-400">
                    clipAAPLc (Multiplier Leg)
                  </div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    Multiplier index exposure
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-sm font-black text-[#010FEE] dark:text-blue-400">
                    {clipUnits.toFixed(4)}
                  </div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    Multiplier claim
                  </div>
                </div>
              </div>

              {/* talonAAPLc */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#172144] border border-[#E2E8F4] dark:border-[#2A3B6B] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#050B24] dark:text-white">
                    talonAAPLc (Price Leg)
                  </div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    Spot price delta
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-sm font-black text-[#050B24] dark:text-white">
                    {talonUnits.toFixed(4)}
                  </div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    {currentPrice === null ? "—" : `$${(talonUnits * currentPrice).toFixed(2)} USD`}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-[#F1F5F9] dark:border-[#1E294B] flex items-center justify-between text-xs">
            <span className="text-[#64748B] dark:text-[#94A3B8]">Network:</span>
            <span className="font-bold text-[#050B24] dark:text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Base Mainnet
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
