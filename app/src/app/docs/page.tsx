"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Layers,
  Sparkles,
  ArrowRight,
  Hash,
} from "lucide-react";
import {
  FACTORY_ADDRESS,
  AAPLC_VAULT_ADDRESS,
  AAPLC_CLIP_ADDRESS,
  AAPLC_TALON_ADDRESS,
  OFFICIAL_TOKENS,
} from "../../config/contracts";
import { TalonLogo } from "../../components/TalonLogo";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", label: "Introduction" },
    { id: "overview", label: "Overview" },
    { id: "problem", label: "Problem" },
    { id: "goals", label: "Goals" },
    { id: "personas", label: "Personas" },
    { id: "architecture", label: "Architecture" },
    { id: "clip-and-talon", label: "clip and talon" },
    { id: "vault", label: "Vault" },
    { id: "yield-market", label: "Yield Market" },
    { id: "price-exchange", label: "Price Exchange" },
    { id: "economics", label: "Economics" },
    { id: "credit-roadmap", label: "Credit & Lending" },
    { id: "gifting", label: "Programmable Gifting" },
    { id: "contracts", label: "Contracts" },
    { id: "security", label: "Security" },
    { id: "risks", label: "Risks" },
    { id: "governance", label: "Governance" },
    { id: "terms", label: "Terms of Use" },
    { id: "privacy", label: "Privacy Policy" },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white dark:bg-[#060919] min-h-screen text-[#050B24] dark:text-[#F8FAFC] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-12 items-start">
        {/* Sticky Left Table of Contents */}
        <aside className="w-64 shrink-0 sticky top-20 hidden lg:block space-y-4">
          <div className="text-[11px] font-mono uppercase font-bold text-[#94A3B8] dark:text-[#64748B] tracking-widest px-3">
            SECTIONS
          </div>
          <nav className="space-y-1">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeSection === sec.id
                    ? "bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 font-bold"
                    : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#050B24] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#0D152F]"
                }`}
              >
                {sec.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Documentation Body */}
        <main className="flex-1 max-w-3xl space-y-12 pb-24">
          {/* Header Banner */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <TalonLogo className="w-10 h-10" size={40} rounded="xl" />
              <div>
                <span className="inline-block px-3 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-blue-950/60 border border-[#010FEE]/20 dark:border-blue-800 text-xs font-bold text-[#010FEE] dark:text-blue-400">
                  Base Mainnet • Protocol Architecture
                </span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-[#050B24] dark:text-white tracking-tight">
              Documentation
            </h1>
            <p className="text-base sm:text-lg text-[#475569] dark:text-[#94A3B8] leading-relaxed pt-1">
              TALON splits Coinbase B20 tokenized AAPLc into a multiplier-exposure token (<strong className="text-[#010FEE] dark:text-blue-400">clip</strong>) and a price-exposure token (<strong className="text-[#050B24] dark:text-white">talon</strong>) on Base. This reference describes the deployed contracts and mechanism.
            </p>
          </div>

          {/* Section: Introduction */}
          <section id="introduction" className="space-y-4 pt-4 border-t border-[#E2E8F4] dark:border-[#1E294B]">
            <h2 className="text-2xl font-black text-[#050B24] dark:text-white tracking-tight">
              Introduction
            </h2>
            <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              A tokenized stock combines price exposure with the issuer&apos;s onchain multiplier. The multiplier can change as the underlying B20 asset changes; TALON does not promise a fixed yield.
            </p>
            <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              Clip and talon separate two kinds of exposure, but neither token creates income that the underlying asset does not provide.
            </p>
            <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              <strong className="text-[#050B24] dark:text-white">TALON separates the choice:</strong> hold the multiplier leg, the price leg, or both. The primitive operates on official Coinbase tokenized stocks on Base.
            </p>
          </section>

          {/* Section: What Does Talon Do? */}
          <section id="overview" className="space-y-4 pt-4 border-t border-[#E2E8F4] dark:border-[#1E294B]">
            <div className="text-xs font-mono font-bold text-[#010FEE] dark:text-blue-400 uppercase tracking-wider">
              WHAT DOES TALON DO?
            </div>
            <h2 className="text-2xl font-black text-[#050B24] dark:text-white tracking-tight">
              Separating Multiplier Exposure from Price Exposure
            </h2>
            <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              Talon provides users with precise control over <strong>multiplier exposure</strong> versus <strong>price exposure</strong>. It is a risk-segmentation layer on top of existing tokenized stocks on Base, not a yield generator.
            </p>
            <div className="space-y-3 pt-2">
              <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] space-y-2">
                <div className="font-bold text-[#050B24] dark:text-white text-sm">
                  1. Multiplier Tokenization
                </div>
                <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Deposited stock is decomposed into two distinct legs: <strong>clip</strong> tracks multiplier exposure, and <strong>talon</strong> tracks the price leg.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] space-y-2">
                <div className="font-bold text-[#050B24] dark:text-white text-sm">
                  2. 1:1 Invariant & Zero-Slippage Recombination
                </div>
                <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Splitting and recombining mints and burns the pair against vault collateral inventory. At all times:
                  <code className="block mt-2 p-2 rounded-xl bg-white dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] font-mono text-xs text-[#010FEE] dark:text-blue-400">
                    1 Underlying Stock = 1 clipToken + 1 talonToken
                  </code>
                  This hard mathematical anchor guarantees complete protocol solvency without reliance on external liquidation mechanisms.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Problem */}
          <section id="problem" className="space-y-4 pt-4 border-t border-[#E2E8F4] dark:border-[#1E294B]">
            <h2 className="text-2xl font-black text-[#050B24] dark:text-white tracking-tight">
              The Problem with Bundled Equities
            </h2>
            <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              Traditional equity tokens package price volatility and multiplier exposure into one inseparable token. This creates two distinct structural frictions:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
              <li>
                <strong>Active Intraday Traders:</strong> Anyone holding AAPLc for short sessions may want a direct price-leg position instead of both exposures.
              </li>
              <li>
                <strong>Exposure Allocators:</strong> Anyone seeking multiplier exposure still carries the underlying token and multiplier risk.
              </li>
              <li>
                <strong>Lending Markets:</strong> Credit integrations must account for the token multiplier, oracle quality, collateral value, and liquidation risk.
              </li>
            </ul>
          </section>

          {/* Section: Goals */}
          <section id="goals" className="space-y-4 pt-4 border-t border-[#E2E8F4] dark:border-[#1E294B]">
            <h2 className="text-2xl font-black text-[#050B24] dark:text-white tracking-tight">
              Protocol Goals
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B]">
                <div className="font-bold text-[#050B24] dark:text-white">Zero Liquidations</div>
                <div className="text-[#64748B] dark:text-[#94A3B8] mt-1">Neither clip nor talon can be liquidated. No margin calls or oracle cascades.</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B]">
                <div className="font-bold text-[#050B24] dark:text-white">24/7 Yield Secondary Market</div>
                <div className="text-[#64748B] dark:text-[#94A3B8] mt-1">clip tokens trade freely against USDC around the clock on decentralized exchanges.</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B]">
                <div className="font-bold text-[#050B24] dark:text-white">100% Backed Inventory</div>
                <div className="text-[#64748B] dark:text-[#94A3B8] mt-1">Every clip and talon is strictly backed 1:1 by real stock held in the vault contract.</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B]">
                <div className="font-bold text-[#050B24] dark:text-white">Permissionless Factory</div>
                <div className="text-[#64748B] dark:text-[#94A3B8] mt-1">Anyone can deploy new vaults for any standard Coinbase B20 tokenized equity on Base.</div>
              </div>
            </div>
          </section>

          {/* Section: Personas */}
          <section id="personas" className="space-y-4 pt-4 border-t border-[#E2E8F4] dark:border-[#1E294B]">
            <h2 className="text-2xl font-black text-[#050B24] dark:text-white tracking-tight">
              Target Personas
            </h2>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B]">
                <strong className="text-[#010FEE] dark:text-blue-400">The Multiplier Allocator:</strong>
                <p className="text-[#64748B] dark:text-[#94A3B8] mt-1">
                  Deposits stock into Talon, keeps the clip leg for multiplier exposure, and understands that price and multiplier outcomes can vary.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B]">
                <strong className="text-[#050B24] dark:text-white">The Active Delta Trader:</strong>
                <p className="text-[#64748B] dark:text-[#94A3B8] mt-1">
                  Uses talon tokens to express the price leg separately from the multiplier leg, subject to market liquidity and price risk.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B]">
                <strong className="text-[#050B24] dark:text-white">The Arbitrageur:</strong>
                <p className="text-[#64748B] dark:text-[#94A3B8] mt-1">
                  Monitors price discrepancies. If (clip + talon) is less than spot AAPLc, buys both and burns them in the vault for immediate profit.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Credit Roadmap */}
          <section id="credit-roadmap" className="space-y-4 pt-4 border-t border-[#E2E8F4] dark:border-[#1E294B]">
            <div className="text-xs font-mono font-bold text-[#010FEE] dark:text-blue-400 uppercase tracking-wider">
              BASE BUILDER PRIORITY • ROADMAP
            </div>
            <h2 className="text-2xl font-black text-[#050B24] dark:text-white tracking-tight">
              Credit on Productive Assets & Self-Repaying Loans (Roadmap)
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              <p>
                In the official Base Request for Builders, Base highlights the potential for{" "}
                <strong className="text-[#050B24] dark:text-white">
                  &ldquo;lending models that take future yield into account, including self-repaying structures.&rdquo;
                </strong>
              </p>
              <p>
                Because Talon cleanly unbundles productive Coinbase equities into a principal leg (
                <strong className="text-[#050B24] dark:text-white">talon</strong>) and an accretion leg (
                <strong className="text-[#010FEE] dark:text-blue-400">clip</strong>), it unlocks the architectural foundation for self-repaying credit:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] space-y-1.5">
                  <div className="font-mono text-xs font-bold text-[#010FEE] dark:text-blue-400">1. COLLATERALIZE PRINCIPAL</div>
                  <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    Not shipped in Phase 0. The future design would post talonAAPLc as collateral into a real Base lending venue to borrow USDC.
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] space-y-1.5">
                  <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">2. SELF-REPAYING AMORTIZATION</div>
                  <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    Not shipped in Phase 0. No self-repayment, LTV, liquidation, or credit oracle is currently active.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Programmable Gifting */}
          <section id="gifting" className="space-y-4 pt-4 border-t border-[#E2E8F4] dark:border-[#1E294B]">
            <div className="text-xs font-mono font-bold text-[#010FEE] dark:text-blue-400 uppercase tracking-wider">
              BASE BUILDER PRIORITY • COMPOSABILITY
            </div>
            <h2 className="text-2xl font-black text-[#050B24] dark:text-white tracking-tight">
              Programmable Stock Gifting (Phase 0: Transfer Only)
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              <p>
                Base emphasizes{" "}
                <strong className="text-[#050B24] dark:text-white">
                  &ldquo;new ways to structure gifts of investments to friends and family where value is programmable rather than static.&rdquo;
                </strong>
              </p>
              <p>
                Phase 0 supports transferring eligible clip or talon claims between eligible Base wallets. Time locks, expiry, reclaim, rewards, and referral programs are not shipped:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
                <li>
                  <strong className="text-[#010FEE] dark:text-blue-400">Gift multiplier exposure (clipAAPLc):</strong> Transfer the clip leg to another eligible wallet while retaining the price leg.
                </li>
                <li>
                  <strong className="text-[#050B24] dark:text-white">Gift price exposure (talonAAPLc):</strong> Transfer the talon leg to another eligible wallet. Transfers remain subject to registry rules.
                </li>
              </ul>
            </div>
          </section>

          {/* Section: Architecture & Contracts */}
          <section id="architecture" className="space-y-4 pt-4 border-t border-[#E2E8F4] dark:border-[#1E294B]">
            <h2 className="text-2xl font-black text-[#050B24] dark:text-white tracking-tight">
              Smart Contract Architecture
            </h2>
            <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              Talon operates four primary verified smart contracts on Base Mainnet:
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-[#050B24] dark:text-white">TalonFactory</div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-sans">
                    Deploys and registers canonical vaults, clip tokens, and talon tokens.
                  </div>
                </div>
                <a
                  href={`https://basescan.org/address/${FACTORY_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#010FEE] dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
                >
                  {FACTORY_ADDRESS.slice(0, 10)}...{FACTORY_ADDRESS.slice(-8)}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-[#050B24] dark:text-white">TalonVault (AAPLc)</div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-sans">
                    Escrows AAPLc collateral; coordinates tear() and join() executions.
                  </div>
                </div>
                <a
                  href={`https://basescan.org/address/${AAPLC_VAULT_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#010FEE] dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
                >
                  {AAPLC_VAULT_ADDRESS.slice(0, 10)}...{AAPLC_VAULT_ADDRESS.slice(-8)}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-[#010FEE] dark:text-blue-400">clipAAPLc (Income Token)</div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-sans">
                    ERC-20 token tracking the B20 multiplier exposure; no fixed yield is promised.
                  </div>
                </div>
                <a
                  href={`https://basescan.org/address/${AAPLC_CLIP_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#010FEE] dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
                >
                  {AAPLC_CLIP_ADDRESS.slice(0, 10)}...{AAPLC_CLIP_ADDRESS.slice(-8)}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-[#050B24] dark:text-white">talonAAPLc (Price Token)</div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-sans">
                    ERC-20 token tracking pure equity price movement.
                  </div>
                </div>
                <a
                  href={`https://basescan.org/address/${AAPLC_TALON_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#010FEE] dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
                >
                  {AAPLC_TALON_ADDRESS.slice(0, 10)}...{AAPLC_TALON_ADDRESS.slice(-8)}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </section>

          {/* Section: Security & Risks */}
          <section id="security" className="space-y-4 pt-4 border-t border-[#E2E8F4] dark:border-[#1E294B]">
            <h2 className="text-2xl font-black text-[#050B24] dark:text-white tracking-tight">
              Security & Immutability
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              <p>
                The core contracts are designed with strict mathematical invariants. There are no administrative backdoors that can seize user collateral, no pause levers that freeze redemptions, and no dependency on price oracles within the vault itself.
              </p>
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-medium">
                ✓ Non-custodial escrow: Only token holders possessing equal units of clip and talon can withdraw collateral from the vault.
              </div>
            </div>
          </section>

          {/* Section: Risks */}
          <section id="risks" className="space-y-4 pt-4 border-t border-[#E2E8F4] dark:border-[#1E294B]">
            <h2 className="text-2xl font-black text-[#050B24] dark:text-white tracking-tight">
              Risks & Considerations
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
              <li>
                <strong>Underlying Asset Risk:</strong> Tokenized stocks depend on the underlying custodial integrity and compliance of the token issuer.
              </li>
              <li>
                <strong>Secondary Market Liquidity:</strong> clip and talon tokens trade on automated market makers. Low liquidity on AMM pools could result in price slippage when trading large volumes.
              </li>
              <li>
                <strong>Smart Contract Risk:</strong> While verified and formal invariant-tested, users should exercise standard caution when transacting with decentralized protocols.
              </li>
            </ul>
          </section>

          {/* Section: Governance */}
          <section id="governance" className="space-y-4 pt-4 border-t border-[#E2E8F4] dark:border-[#1E294B]">
            <h2 className="text-2xl font-black text-[#050B24] dark:text-white tracking-tight">
              Governance & Protocol Immutability
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              <p>
                Talon operates as an autonomous financial primitive on Base. In its foundational phase, core vault parameters and 1:1 invariants are immutable and require zero governance intervention.
              </p>
              <p>
                Future protocol evolution, such as expanding to new Coinbase B20 tokenized stocks, automated debt liquidation thresholds in credit modules, and fee capture distribution, is intended to be guided by community token governance.
              </p>
            </div>
          </section>

          {/* Section: Terms */}
          <section id="terms" className="space-y-4 pt-4 border-t border-[#E2E8F4] dark:border-[#1E294B]">
            <h2 className="text-2xl font-black text-[#050B24] dark:text-white tracking-tight">
              Terms of Use & Disclaimers
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              <p>
                Talon is decentralized, non-custodial open-source software deployed on the Base blockchain. By interacting with the Talon smart contracts or user interface, you acknowledge and agree to the following:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Software as a Service:</strong> The interface is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind.
                </li>
                <li>
                  <strong>Non-Custodial Nature:</strong> You maintain sole control and responsibility over your private keys, transactions, and token assets at all times.
                </li>
                <li>
                  <strong>Regulatory Eligibility:</strong> Coinbase tokenized equities are intended for eligible non-US participants in accordance with applicable regional laws. Users are responsible for verifying their jurisdictional eligibility.
                </li>
              </ul>
            </div>
          </section>

          {/* Section: Privacy */}
          <section id="privacy" className="space-y-4 pt-4 border-t border-[#E2E8F4] dark:border-[#1E294B]">
            <h2 className="text-2xl font-black text-[#050B24] dark:text-white tracking-tight">
              Privacy & Onchain Transparency
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              <p>
                Talon does not collect, store, or sell personal identifying information, IP addresses, or off-chain user profiles.
              </p>
              <p>
                All smart contract interactions (such as splitting, recombining, or transferring tokens) occur directly on the public Base blockchain and are inherently transparent and permanent.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
