"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useWalletModal } from "../../../context/WalletModalContext";
import { OFFICIAL_TOKENS } from "../../../config/contracts";
import { useB20Data } from "../../../hooks/useB20Data";
import { useVault } from "../../../hooks/useVault";
import {
  Wallet,
  Gift,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Layers,
} from "lucide-react";
import { TalonLogo } from "../../../components/TalonLogo";

export default function PortfolioPage() {
  const { address, isConnected } = useAccount();
  const { openSelectModal } = useWalletModal();

  const [selectedSymbol, setSelectedSymbol] = useState("AAPLc");
  const selectedToken =
    OFFICIAL_TOKENS.find((t) => t.symbol === selectedSymbol) || OFFICIAL_TOKENS[0];

  const {
    balanceVal,
    formattedBalance,
    formattedMultiplier,
    shareEquivalent,
    formattedUsd,
    formattedPrice,
    priceVal,
  } = useB20Data(selectedToken.address);

  const {
    clipBalance,
    talonBalance,
    clipAddress,
    talonAddress,
    vaultAddress,
  } = useVault(selectedToken.address, selectedToken.decimals);

  const [claiming, setClaiming] = useState(false);

  // Derive connected balance values
  const clipVal = Number(clipBalance) || 0;
  const talonVal = Number(talonBalance) || 0;
  const grandTotalUsd =
    priceVal === null ? null : (balanceVal + talonVal) * priceVal;
  const totalRawStockUsd = priceVal === null ? null : balanceVal * priceVal;
  const totalTalonUsd = priceVal === null ? null : talonVal * priceVal;
  const hasUsdValue = grandTotalUsd !== null && grandTotalUsd > 0;
  const safeGrandTotalUsd = grandTotalUsd ?? 0;

  const clipSymbol = `clip${selectedToken.symbol}`;
  const talonSymbol = `talon${selectedToken.symbol}`;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <TalonLogo className="w-8 h-8" size={32} rounded="xl" />
          <h1 className="text-3xl sm:text-4xl font-black text-[#050B24] dark:text-white tracking-tight">
          Portfolio
          </h1>
        </div>
        <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] mt-1.5 font-medium">
          Your onchain equity, Clip (multiplier), and Talon (principal) balances.
        </p>
      </div>

      {/* Asset Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] shrink-0 mr-1">
          Stock:
        </span>
        {OFFICIAL_TOKENS.map((token) => (
          <button
            key={token.symbol}
            onClick={() => setSelectedSymbol(token.symbol)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 border ${
              selectedSymbol === token.symbol
                ? "bg-[#010FEE] text-white border-[#010FEE] shadow-sm"
                : "bg-white dark:bg-[#0D152F] border-[#E2E8F4] dark:border-[#1E294B] text-[#475569] dark:text-[#94A3B8] hover:border-[#010FEE]/40"
            }`}
          >
            {token.symbol}
          </button>
        ))}
      </div>

      {/* Top Full-Width Card: Token Balances */}
      <div className="bg-white dark:bg-[#0D152F] rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] p-6 sm:p-7 shadow-xs space-y-6 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#050B24] dark:text-white">
              {selectedToken.symbol} Position Value
            </h2>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#050B24] dark:text-white font-mono">
            {!isConnected || grandTotalUsd === null
              ? "$0.00"
              : `$${safeGrandTotalUsd.toFixed(2)}`}
          </div>
        </div>

        {!isConnected ? (
          <div className="py-8 text-center space-y-3 bg-[#F8FAFC] dark:bg-[#162044] rounded-2xl border border-[#E2E8F4] dark:border-[#2A3B6B]">
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Connect a Base wallet to view balances</p>
            <button
              onClick={() => openSelectModal()}
              className="px-6 py-2.5 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-xs font-bold transition-all shadow-[0_4px_16px_rgba(1,15,238,0.25)] cursor-pointer"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Raw Stock */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] space-y-1">
              <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
                <span className="font-bold">Raw Stock ({selectedToken.symbol})</span>
                <span className="font-mono">Base Mainnet</span>
              </div>
              <div className="text-xl font-black font-mono text-[#050B24] dark:text-white">
                {balanceVal.toFixed(4)} {selectedToken.symbol}
              </div>
              <div className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
                ≈ {totalRawStockUsd === null ? "$0.00" : `$${totalRawStockUsd.toFixed(2)}`} USD
              </div>
            </div>

            {/* clipToken */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] space-y-1">
              <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
              <span className="font-bold text-[#010FEE] dark:text-blue-400">Clip</span>
                <span className="font-mono">Multiplier</span>
              </div>
              <div className="text-xl font-black font-mono text-[#010FEE] dark:text-blue-400">
                {clipVal.toFixed(4)} {clipSymbol}
              </div>
              <div className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
                Accretion rights
              </div>
            </div>

            {/* talonToken */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] space-y-1">
              <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
                <span className="font-bold">Price Leg ({talonSymbol})</span>
                <span className="font-mono">Principal</span>
              </div>
              <div className="text-xl font-black font-mono text-[#050B24] dark:text-white">
                {talonVal.toFixed(4)} {talonSymbol}
              </div>
              <div className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
                ≈ {totalTalonUsd === null ? "$0.00" : `$${totalTalonUsd.toFixed(2)}`} USD
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Middle Row: Performance (60D) + Claim Dividends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Portfolio Performance 60D (width: 8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0D152F] rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] p-6 sm:p-7 shadow-xs space-y-5 flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-[#050B24] dark:text-white">
              Performance
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs border ${
              !isConnected
                ? "bg-[#F8FAFC] dark:bg-[#162044] text-[#64748B] dark:text-[#94A3B8] border-[#E2E8F4] dark:border-[#2A3B6B]"
                : hasUsdValue
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                  : "bg-[#F8FAFC] dark:bg-[#162044] text-[#64748B] dark:text-[#94A3B8] border-[#E2E8F4] dark:border-[#2A3B6B]"
            }`}>
              {!isConnected ? "Wallet Disconnected" : hasUsdValue ? "Live Balance" : "No Position"}
            </span>
          </div>

          {/* Performance Area SVG Spline Chart or Wallet-Aware State */}
          {!isConnected ? (
            <div className="h-44 sm:h-52 w-full flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] space-y-3">
              <Wallet className="w-8 h-8 text-[#94A3B8] dark:text-[#64748B]" />
              <div className="space-y-1 max-w-sm">
                <div className="text-sm font-bold text-[#050B24] dark:text-white">
                  Connect Wallet to View Performance
                </div>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Connect your Base wallet to view live valuation curves, split yield accretion, and position history.
                </p>
              </div>
              <button
                onClick={() => openSelectModal()}
                className="px-5 py-2 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Connect Base Wallet
              </button>
            </div>
          ) : !hasUsdValue ? (
            <div className="h-44 sm:h-52 w-full flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] space-y-2">
              <div className="text-sm font-bold text-[#050B24] dark:text-white">
                No {selectedToken.symbol} Positions Detected
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-md">
                Your connected wallet has 0.00 {selectedToken.symbol}, {clipSymbol}, and {talonSymbol}. Split stock or acquire tokens to begin tracking performance.
              </p>
              <Link
                href={`/app/vault?asset=${selectedToken.symbol}`}
                className="px-4 py-2 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer mt-1"
              >
                <span>Open Split Desk</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="h-44 sm:h-52 w-full pt-4">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 500 160"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#010FEE" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#010FEE" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#E2E8F4" strokeOpacity="0.4" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#E2E8F4" strokeOpacity="0.4" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#E2E8F4" strokeOpacity="0.4" strokeDasharray="3 3" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#E2E8F4" strokeOpacity="0.4" strokeDasharray="3 3" />

                {/* Dynamic Y Axis Labels */}
                <text x="5" y="24" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                  ${safeGrandTotalUsd.toFixed(2)}
                </text>
                <text x="5" y="64" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                  ${(safeGrandTotalUsd * 0.66).toFixed(2)}
                </text>
                <text x="5" y="104" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                  ${(safeGrandTotalUsd * 0.33).toFixed(2)}
                </text>
                <text x="5" y="144" fill="#94A3B8" fontSize="10" fontFamily="monospace">$0.00</text>

                {/* Performance Area Fill */}
                <path
                  d="M 50 125 C 120 115, 180 95, 250 85 C 320 75, 400 50, 480 35 L 480 140 L 50 140 Z"
                  fill="url(#perfGradient)"
                />

                {/* Performance Spline Stroke */}
                <path
                  d="M 50 125 C 120 115, 180 95, 250 85 C 320 75, 400 50, 480 35"
                  fill="none"
                  stroke="#010FEE"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Current Point */}
                <circle cx="480" cy="35" r="4" fill="#010FEE" stroke="white" strokeWidth="2" />
              </svg>
            </div>
          )}

          {/* X Axis Labels */}
          <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8] px-4 pt-1">
            <span>Day 1</span>
            <span>Day 11</span>
            <span>Day 21</span>
            <span>Day 31</span>
            <span>Day 41</span>
            <span>Day 51</span>
          </div>
        </div>

        {/* Right: Accretion Multiplier Status */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0D152F] rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] p-6 sm:p-7 shadow-xs space-y-5 flex flex-col justify-between transition-colors">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#010FEE] dark:text-blue-400" />
            <h2 className="text-base sm:text-lg font-bold text-[#050B24] dark:text-white">
              B20 Accretion
            </h2>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] text-center space-y-1">
            <div className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">Live Multiplier</div>
            <div className="text-3xl font-black text-[#010FEE] dark:text-blue-400 font-mono">
              {formattedMultiplier}
            </div>
            <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Auto-Accreting on Base</div>
          </div>

          <div className="space-y-2">
            <Link
              href="/app/vault"
              className="w-full py-3.5 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Manage Claims on Split Desk</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] text-center leading-relaxed">
              Corporate stock actions automatically adjust your clip claim multiplier.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Table: Active Positions */}
      <div className="bg-white dark:bg-[#0D152F] rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] p-6 sm:p-7 shadow-xs space-y-4 transition-colors">
        <h2 className="text-base sm:text-lg font-bold text-[#050B24] dark:text-white">
          Positions
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F4] dark:border-[#1E294B] text-[#64748B] dark:text-[#94A3B8] text-[11px] font-bold uppercase tracking-wider">
                <th className="pb-3">Asset</th>
                <th className="pb-3">Direction</th>
                <th className="pb-3">Size</th>
                <th className="pb-3">Leverage</th>
                <th className="pb-3">Entry</th>
                <th className="pb-3">Current</th>
                <th className="pb-3 text-right">P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F4] dark:divide-[#1E294B]">
              {!isConnected || (balanceVal === 0 && clipVal === 0 && talonVal === 0) ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#94A3B8] dark:text-[#64748B]">
                    No onchain positions found.
                  </td>
                </tr>
              ) : (
                <>
              {talonVal > 0 && <tr className="hover:bg-[#F8FAFC] dark:hover:bg-[#162044] transition-colors">
                <td className="py-3.5 font-bold text-[#050B24] dark:text-white">{talonSymbol}</td>
                <td className="py-3.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                    ↗ Long
                  </span>
                </td>
                <td className="py-3.5 font-mono text-[#050B24] dark:text-white">{talonVal.toFixed(4)} {selectedToken.symbol}</td>
                <td className="py-3.5 font-mono text-[#64748B] dark:text-[#94A3B8]">1x (Spot)</td>
                <td className="py-3.5 font-mono text-[#64748B] dark:text-[#94A3B8]">Spot</td>
                <td className="py-3.5 font-mono text-[#050B24] dark:text-white">{formattedPrice}</td>
                <td className="py-3.5 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">Live</td>
              </tr>}
              {clipVal > 0 && <tr className="hover:bg-[#F8FAFC] dark:hover:bg-[#162044] transition-colors">
                <td className="py-3.5 font-bold text-[#010FEE] dark:text-blue-400">{clipSymbol}</td>
                <td className="py-3.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 text-xs font-bold border border-[#010FEE]/20 dark:border-blue-800">
                    ⚡ Yield
                  </span>
                </td>
                <td className="py-3.5 font-mono text-[#050B24] dark:text-white">{clipVal.toFixed(4)} {clipSymbol}</td>
                <td className="py-3.5 font-mono text-[#64748B] dark:text-[#94A3B8]">1x</td>
                <td className="py-3.5 font-mono text-[#64748B] dark:text-[#94A3B8]">1.0000x</td>
                <td className="py-3.5 font-mono text-[#050B24] dark:text-white">{formattedMultiplier}</td>
                <td className="py-3.5 text-right font-mono text-[#010FEE] dark:text-blue-400 font-bold">Accreting</td>
              </tr>}
              {balanceVal > 0 && <tr className="hover:bg-[#F8FAFC] dark:hover:bg-[#162044] transition-colors">
                <td className="py-3.5 font-bold text-[#050B24] dark:text-white">{selectedToken.symbol} (Vault)</td>
                <td className="py-3.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800">
                    🔒 Collateral
                  </span>
                </td>
                <td className="py-3.5 font-mono text-[#050B24] dark:text-white">
                  {balanceVal.toFixed(4)} {selectedToken.symbol}
                </td>
                <td className="py-3.5 font-mono text-[#64748B] dark:text-[#94A3B8]">None</td>
                <td className="py-3.5 font-mono text-[#64748B] dark:text-[#94A3B8]">Spot</td>
                <td className="py-3.5 font-mono text-[#050B24] dark:text-white">{formattedPrice}</td>
                <td className="py-3.5 text-right font-mono text-[#64748B] dark:text-[#94A3B8]">Backed</td>
              </tr>}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
