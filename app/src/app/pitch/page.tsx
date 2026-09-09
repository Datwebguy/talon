"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Layers,
  Lock,
  Gift,
  Zap,
  Repeat,
  CheckCircle2,
} from "lucide-react";
import { TalonLogo } from "@/components/TalonLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  FACTORY_ADDRESS,
  AAPLC_VAULT_ADDRESS,
  AAPLC_CLIP_ADDRESS,
  AAPLC_TALON_ADDRESS,
} from "@/config/contracts";

export default function PitchPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 7;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalSlides]);

  const slideTitles = [
    "Overview",
    "The Problem",
    "The Solution",
    "Mechanism & Invariant",
    "Architecture",
    "Market Opportunity",
    "Composable Roadmap",
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#060919] text-[#050B24] dark:text-[#F8FAFC] flex flex-col justify-between font-sans transition-colors duration-200">
      {/* Top Header */}
      <header className="border-b border-[#E2E8F4] dark:border-[#1E294B] bg-white/95 dark:bg-[#080D26]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <TalonLogo className="w-8 h-8" size={32} rounded="xl" />
              <span className="font-black text-lg tracking-tight text-[#050B24] dark:text-white group-hover:text-[#010FEE] dark:group-hover:text-blue-400 transition-colors">
                TALON
              </span>
            </Link>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#010FEE] dark:text-blue-400 bg-[#EEF2FF] dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-[#010FEE]/20 dark:border-blue-800">
              Whitepaper / Pitch
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/app"
              className="px-4 py-2 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Slide Progress Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center gap-1 overflow-x-auto py-2 border-t border-[#F1F5F9] dark:border-[#1E294B] text-xs">
          {slideTitles.map((title, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
                currentSlide === idx
                  ? "bg-[#010FEE] text-white font-bold shadow-xs"
                  : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#050B24] dark:hover:text-white hover:bg-white dark:hover:bg-[#162044]"
              }`}
            >
              0{idx + 1}. {title}
            </button>
          ))}
        </div>
      </header>

      {/* Main Slide Content Canvas */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 flex flex-col justify-center">
        {/* ===================================================================
            SLIDE 0: Overview & Executive Summary
           =================================================================== */}
        {currentSlide === 0 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF2FF] dark:bg-blue-950/60 border border-[#010FEE]/20 dark:border-blue-800 font-mono text-xs font-bold text-[#010FEE] dark:text-blue-400">
              EXECUTIVE WHITEPAPER • BASE MAINNET
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#050B24] dark:text-white tracking-tight leading-[1.1]">
                Yield Stripping for Tokenized Equities
              </h1>
              <p className="text-base sm:text-xl text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-3xl">
                Separating official Coinbase tokenized stocks into multiplier and price exposure on Base.
              </p>
            </div>

            {/* Split Visual Schema */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] shadow-xs space-y-6">
              <div className="text-xs font-mono uppercase font-bold text-[#64748B] dark:text-[#94A3B8]">
                Protocol Primitive
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Center Vault */}
                <div className="p-5 rounded-2xl bg-[#050B24] dark:bg-[#162044] border border-[#1E294B] dark:border-[#2A3B6B] text-white space-y-1">
                  <div className="font-mono text-xs font-bold text-blue-400 uppercase">Underlying Stock</div>
                  <div className="text-xl font-black">1 AAPLc</div>
                  <div className="text-xs text-white/70">Coinbase Tokenized Stock on Base</div>
                </div>

                {/* Arrow */}
                <div className="text-center font-mono text-xs text-[#010FEE] dark:text-blue-400 font-bold">
                  decomposes 1:1 via tear() ➔
                </div>

                {/* Split Dual Legs */}
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-2xl bg-[#EEF2FF] dark:bg-blue-950/60 border border-[#010FEE]/20 dark:border-blue-800 flex items-center justify-between">
                    <div>
                      <div className="font-mono font-bold text-xs text-[#010FEE] dark:text-blue-400">clipAAPLc</div>
                      <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Multiplier Exposure</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#010FEE] dark:text-blue-400">1.0 Unit</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] flex items-center justify-between">
                    <div>
                      <div className="font-mono font-bold text-xs text-[#050B24] dark:text-white">talonAAPLc</div>
                      <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Pure Equity Price Delta</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#050B24] dark:text-white">1.0 Unit</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] space-y-1">
                <div className="font-bold text-xs text-[#050B24] dark:text-white">No debt in split flow</div>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Neither leg is debt or margin-backed. There are zero oracle margin calls.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] space-y-1">
                <div className="font-bold text-xs text-[#050B24] dark:text-white">Non-Custodial Escrow</div>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Collateral is locked in transparent verified contracts directly on Base.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] space-y-1">
                <div className="font-bold text-xs text-[#050B24] dark:text-white">1:1 Mathematical Invariant</div>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">1 clip + 1 talon can always be recombined into 1 underlying stock with zero slippage.</p>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            SLIDE 1: The Problem
           =================================================================== */}
        {currentSlide === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF2FF] dark:bg-blue-950/60 border border-[#010FEE]/20 dark:border-blue-800 font-mono text-xs font-bold text-[#010FEE] dark:text-blue-400">
              01 • THE PROBLEM
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black text-[#050B24] dark:text-white tracking-tight leading-tight">
                Tokenized stocks bundle two conflicting forms of value
              </h2>
              <p className="text-base sm:text-lg text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-3xl">
                When equity shares are tokenized without decomposition, traders and yield allocators are forced to accept unwanted risks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Friction 1 */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0D152F] border border-rose-200 dark:border-rose-950/60 shadow-xs space-y-3">
                <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black">
                  ✕
                </div>
                <h3 className="font-bold text-base text-[#050B24] dark:text-white">
                  Intraday Traders May Prefer Direct Price Exposure
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Traders entering positions for hours or days may want the price leg without holding both kinds of exposure.
                </p>
              </div>

              {/* Friction 2 */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0D152F] border border-rose-200 dark:border-rose-950/60 shadow-xs space-y-3">
                <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black">
                  ✕
                </div>
                <h3 className="font-bold text-base text-[#050B24] dark:text-white">
                  Income Investors Are Forced Into Equity Volatility
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Users seeking multiplier exposure still face the risk that the underlying B20 multiplier and token value can change.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] space-y-2">
              <div className="text-xs font-mono font-bold uppercase text-[#010FEE] dark:text-blue-400">
                The Structural Disconnect
              </div>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Traditional markets separate different forms of exposure. Talon brings a simple onchain split primitive to official tokenized equities on Base.
              </p>
            </div>
          </div>
        )}

        {/* ===================================================================
            SLIDE 2: The Solution
           =================================================================== */}
        {currentSlide === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF2FF] dark:bg-blue-950/60 border border-[#010FEE]/20 dark:border-blue-800 font-mono text-xs font-bold text-[#010FEE] dark:text-blue-400">
              02 • THE SOLUTION
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black text-[#050B24] dark:text-white tracking-tight leading-tight">
                Decompose. Trade the Legs. Recombine Anytime.
              </h2>
              <p className="text-base sm:text-lg text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-3xl">
                Talon provides a non-custodial smart contract mechanism to separate any Coinbase B20 tokenized stock into two specialized ERC-20 claims.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 flex items-center justify-center font-mono font-bold text-sm">
                  01
                </div>
                <h3 className="font-bold text-base text-[#050B24] dark:text-white">
                  Deposit in Vault
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Deposit tokenized equity (e.g. AAPLc) into the non-custodial Talon Vault contract on Base Mainnet.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 flex items-center justify-center font-mono font-bold text-sm">
                  02
                </div>
                <h3 className="font-bold text-base text-[#050B24] dark:text-white">
                  Mint clip + talon
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Receive equal raw-token quantities of clip (multiplier exposure) and talon (price exposure) 1:1 against your deposit.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 flex items-center justify-center font-mono font-bold text-sm">
                  03
                </div>
                <h3 className="font-bold text-base text-[#050B24] dark:text-white">
                  Trade or Hold
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Hold or transfer either leg, subject to eligibility and available liquidity, or recombine equal amounts to redeem the underlying stock.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            SLIDE 3: Mechanism & Mathematical Invariant
           =================================================================== */}
        {currentSlide === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF2FF] dark:bg-blue-950/60 border border-[#010FEE]/20 dark:border-blue-800 font-mono text-xs font-bold text-[#010FEE] dark:text-blue-400">
              03 • MECHANISM DESIGN
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black text-[#050B24] dark:text-white tracking-tight leading-tight">
                The Hard Mathematical Invariant
              </h2>
              <p className="text-base sm:text-lg text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-3xl">
                Solvency is guaranteed by code without relying on debt liquidation or centralized price oracles.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] shadow-xs space-y-6">
              <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] text-center font-mono text-base sm:text-lg font-black text-[#010FEE] dark:text-blue-400">
                1 Underlying Stock ≡ 1 clipToken + 1 talonToken
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
                <div className="space-y-2">
                  <div className="font-bold text-[#050B24] dark:text-white">Discount Arbitrage Anchor:</div>
                  <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                    If the combined price of clip + talon trades below the spot stock on DEXs, arbitrageurs buy the pair, call <code className="text-[#010FEE] dark:text-blue-400 font-mono">join()</code>, and redeem the higher-valued underlying stock for instant risk-free profit.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-[#050B24] dark:text-white">Premium Arbitrage Anchor:</div>
                  <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                    If clip + talon trades at a premium to the spot stock, participants deposit stock via <code className="text-[#010FEE] dark:text-blue-400 font-mono">tear()</code> and sell both legs across secondary markets, driving the market back to parity.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-xs text-[#475569] dark:text-[#94A3B8]">
                  <strong>100% Reserve Backed:</strong> Vault balance always matches total minted tokens.
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-xs text-[#475569] dark:text-[#94A3B8]">
                  <strong>Zero Slippage Recombination:</strong> Redeem your original equity shares anytime.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            SLIDE 4: Architecture
           =================================================================== */}
        {currentSlide === 4 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF2FF] dark:bg-blue-950/60 border border-[#010FEE]/20 dark:border-blue-800 font-mono text-xs font-bold text-[#010FEE] dark:text-blue-400">
              04 • ARCHITECTURE
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black text-[#050B24] dark:text-white tracking-tight leading-tight">
                Verified Base Mainnet Smart Contracts
              </h2>
              <p className="text-base sm:text-lg text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-3xl">
                Deployed and operating natively on Base.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* Factory */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                <div>
                  <div className="font-bold text-[#050B24] dark:text-white">TalonFactory</div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-sans">
                    Deploys canonical vaults, clip tokens, and talon tokens.
                  </div>
                </div>
                <a
                  href={`https://basescan.org/address/${FACTORY_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#010FEE] dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>{FACTORY_ADDRESS.slice(0, 8)}...{FACTORY_ADDRESS.slice(-6)}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Vault */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                <div>
                  <div className="font-bold text-[#050B24] dark:text-white">TalonVault (AAPLc)</div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-sans">
                    Escrows underlying collateral; manages tear() and join().
                  </div>
                </div>
                <a
                  href={`https://basescan.org/address/${AAPLC_VAULT_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#010FEE] dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>{AAPLC_VAULT_ADDRESS.slice(0, 8)}...{AAPLC_VAULT_ADDRESS.slice(-6)}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Clip */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                <div>
                  <div className="font-bold text-[#010FEE] dark:text-blue-400">clipAAPLc (Income Token)</div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-sans">
                    Standard ERC-20 tracking corporate multiplier accruals.
                  </div>
                </div>
                <a
                  href={`https://basescan.org/address/${AAPLC_CLIP_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#010FEE] dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>{AAPLC_CLIP_ADDRESS.slice(0, 8)}...{AAPLC_CLIP_ADDRESS.slice(-6)}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Talon */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                <div>
                  <div className="font-bold text-[#050B24] dark:text-white">talonAAPLc (Price Token)</div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-sans">
                    Standard ERC-20 tracking spot equity price delta.
                  </div>
                </div>
                <a
                  href={`https://basescan.org/address/${AAPLC_TALON_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#010FEE] dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>{AAPLC_TALON_ADDRESS.slice(0, 8)}...{AAPLC_TALON_ADDRESS.slice(-6)}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            SLIDE 5: Market Opportunity
           =================================================================== */}
        {currentSlide === 5 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF2FF] dark:bg-blue-950/60 border border-[#010FEE]/20 dark:border-blue-800 font-mono text-xs font-bold text-[#010FEE] dark:text-blue-400">
              05 • MARKET OPPORTUNITY
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black text-[#050B24] dark:text-white tracking-tight leading-tight">
                Bringing the World&apos;s Largest Equities Onchain
              </h2>
              <p className="text-base sm:text-lg text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-3xl">
                As traditional assets migrate onchain via Coinbase tokenized stocks on Base, Talon serves as the essential liquidity and yield unbundling layer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] space-y-2">
                <div className="text-xs font-mono font-bold uppercase text-[#010FEE] dark:text-blue-400">
                  Official Tokenized Equity Market
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#050B24] dark:text-white font-mono">
                  $500B+ / yr
                </div>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed pt-1">
                  Official tokenized equity exposure brought onchain by Coinbase, with Base-native composability.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] space-y-2">
                <div className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                  Global Equity Trading Notional
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#050B24] dark:text-white font-mono">
                  $600B+ / day
                </div>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed pt-1">
                  24/7 onchain transfer and settlement for eligible users, with market hours, liquidity, and price risk still relevant.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            SLIDE 6: Composable Roadmap & Get Started
           =================================================================== */}
        {currentSlide === 6 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF2FF] dark:bg-blue-950/60 border border-[#010FEE]/20 dark:border-blue-800 font-mono text-xs font-bold text-[#010FEE] dark:text-blue-400">
              06 • COMPOSABLE ROADMAP
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black text-[#050B24] dark:text-white tracking-tight leading-tight">
                Roadmap: Self-Repaying Loans & Programmable Gifting
              </h2>
              <p className="text-base sm:text-lg text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-3xl">
                Unbundled equity tokens enable new financial primitives on Base.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] space-y-2">
                <div className="text-xs font-mono font-bold text-[#010FEE] dark:text-blue-400 uppercase">
                  Self-Repaying Loans (Not Shipped)
                </div>
                <h3 className="font-bold text-base text-[#050B24] dark:text-white">
                  Credit on Productive Equity (Design Only)
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Future design only. No borrowing, LTV, liquidation, oracle, or automatic repayment is active in the Phase 0 deployment.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] space-y-2">
                <div className="text-xs font-mono font-bold text-[#010FEE] dark:text-blue-400 uppercase">
                  Programmable Gifting
                </div>
                <h3 className="font-bold text-base text-[#050B24] dark:text-white">
                  Gift Income Streams
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Gift multiplier or price exposure to another eligible wallet through programmable token transfers.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#EEF2FF] dark:bg-blue-950/40 border border-[#010FEE]/20 dark:border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-sm font-bold text-[#050B24] dark:text-white">
                  Explore Talon Live on Base
                </div>
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Non-custodial deposit, split, and recombine are fully operational.
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/app"
                  className="px-6 py-2.5 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-xs font-bold transition-all shadow-xs"
                >
                  Launch App
                </Link>
                <Link
                  href="/docs"
                  className="px-5 py-2.5 rounded-full bg-white dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] text-xs font-bold text-[#050B24] dark:text-white hover:border-[#010FEE] transition-colors"
                >
                  Read Docs
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Footer Navigation Bar */}
      <footer className="border-t border-[#E2E8F4] dark:border-[#1E294B] bg-white/95 dark:bg-[#080D26]/95 backdrop-blur-md sticky bottom-0 z-40 py-4 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs text-[#64748B] dark:text-[#94A3B8]">
            <span>Slide</span>
            <strong className="text-[#050B24] dark:text-white">0{currentSlide + 1}</strong>
            <span>of 0{totalSlides}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
              disabled={currentSlide === 0}
              className="p-2 rounded-xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] text-[#050B24] dark:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#010FEE] transition-all cursor-pointer"
              title="Previous Slide (←)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1))}
              disabled={currentSlide === totalSlides - 1}
              className="p-2 rounded-xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] text-[#050B24] dark:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#010FEE] transition-all cursor-pointer"
              title="Next Slide (→)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
