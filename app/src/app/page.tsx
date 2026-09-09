"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useB20Data } from "../hooks/useB20Data";
import { OFFICIAL_TOKENS } from "../config/contracts";
import {
  AppleLogo,
  NvidiaLogo,
  GoogleLogo,
  MetaLogo,
} from "../components/CompanyLogos";
import { TalonLogo } from "../components/TalonLogo";
import { EligibilityBanner } from "../components/EligibilityBanner";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  RefreshCw,
  HelpCircle,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Activity,
  Layers,
  Lock,
  ChevronDown,
  DollarSign,
  PieChart,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [calcAmount, setCalcAmount] = useState("1.00");
  const [calcMode, setCalcMode] = useState<"split" | "recombine">("split");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [activeStrategy, setActiveStrategy] = useState("accretion");

  // Proactively prefetch app routes on mount for instant zero-delay navigation
  useEffect(() => {
    router.prefetch("/app");
    router.prefetch("/app/vault");
    router.prefetch("/app/markets");
  }, [router]);

  const aapl = OFFICIAL_TOKENS[0];
  const { formattedPrice, priceVal } = useB20Data(aapl.address);

  const numAmount = parseFloat(calcAmount) || 0;
  const currentStockPrice = priceVal;
  const estUsd = currentStockPrice === null ? null : (numAmount * currentStockPrice).toFixed(2);

  const supportedStocks = [
    {
      symbol: "AAPLc",
      key: "AAPL",
      name: "Apple Inc.",
      Logo: AppleLogo,
      active: true,
      clip: "clipAAPLc",
      talon: "talonAAPLc",
    },
    {
      symbol: "NVDAc",
      key: "NVDA",
      name: "NVIDIA Corp.",
      Logo: NvidiaLogo,
      active: false,
      clip: "clipNVDAc",
      talon: "talonNVDAc",
    },
    {
      symbol: "GOOGLc",
      key: "GOOGL",
      name: "Alphabet Inc.",
      Logo: GoogleLogo,
      active: false,
      clip: "clipGOOGLc",
      talon: "talonGOOGLc",
    },
    {
      symbol: "METAc",
      key: "META",
      name: "Meta Platforms",
      Logo: MetaLogo,
      active: false,
      clip: "clipMETAc",
      talon: "talonMETAc",
    },
  ];

  const strategies = [
    {
      id: "accretion",
      title: "Keep Clip",
      leg: "clipAAPLc",
      badge: "Multiplier Leg",
      badgeColor: "bg-[#EEF2FF] text-[#010FEE] border-[#010FEE]/20",
      icon: TrendingUp,
      audience: "Multiplier exposure",
      tagline: "Keep the multiplier leg and let Talon handle the split.",
      specs: [
        { label: "Token", value: "clipAAPLc" },
        { label: "Tracks", value: "B20 multiplier" },
        { label: "Use", value: "Hold or transfer" },
      ],
      link: "/app/vault",
      actionText: "Open Split Desk",
    },
    {
      id: "principal",
      title: "Keep Talon",
      leg: "talonAAPLc",
      badge: "Price Leg",
      badgeColor: "bg-[#050B24] text-white border-[#050B24]",
      icon: Activity,
      audience: "Price exposure",
      tagline: "Keep the price leg for simple equity exposure.",
      specs: [
        { label: "Token", value: "talonAAPLc" },
        { label: "Tracks", value: "Stock price" },
        { label: "Use", value: "Hold or transfer" },
      ],
      link: "/app/markets",
      actionText: "Open Principal Desk",
    },
    {
      id: "arbitrage",
      title: "Keep both",
      leg: "1:1 Recombination",
      badge: "Arbitrage Primitive",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: Layers,
      audience: "Full exposure",
      tagline: "Receive both claims, or pair them to recombine.",
      specs: [
        { label: "Output", value: "Clip + Talon" },
        { label: "Backed by", value: "AAPLc in vault" },
        { label: "Exit", value: "Recombine 1:1" },
      ],
      link: "/app",
      actionText: "View Split Desk",
    },
  ];

  const comparisonData = [
    {
      feature: "Equity Spot Price Delta",
      underlying: "Full Spot (1.0x)",
      clip: "Stripped (0.0x)",
      talon: "Full Spot (1.0x)",
      traditional: "Leveraged / Variable",
    },
    {
      feature: "B20 Multiplier Exposure",
      underlying: "Embedded in token",
      clip: "Tracks multiplier",
      talon: "Separate price leg",
      traditional: "Varies by instrument",
    },
    {
      feature: "Protocol Liquidation",
      underlying: "None in spot token",
      clip: "None in split flow",
      talon: "None in split flow",
      traditional: "Depends on venue",
    },
    {
      feature: "Price / Multiplier Choice",
      underlying: "Bundled",
      clip: "Multiplier leg",
      talon: "Price leg",
      traditional: "Varies by product",
    },
    {
      feature: "Composability & Gifting",
      underlying: "Full Token Transfer",
      clip: "Transfer multiplier leg",
      talon: "Transfer price leg",
      traditional: "Locked in Custody",
    },
    {
      feature: "Deterministic Vault Redemption",
      underlying: "Issuer Custody",
      clip: "Equal raw amounts",
      talon: "Equal raw amounts",
      traditional: "Subject to Pool Liquidity",
    },
  ];

  const faqs = [
    {
      q: "How does Talon separate Coinbase tokenized stock exposure?",
      a: "Talon deposits official Coinbase Tokenized Stock AAPLc into a non-custodial smart contract vault on Base. The vault mints two separate ERC-20 claims in equal raw-token quantities: clipAAPLc for multiplier exposure and talonAAPLc for price exposure.",
    },
    {
      q: "What is the B20 Multiplier index and how is accretion calculated?",
      a: "Coinbase B20 tokenized equities use an on-chain multiplier. Corporate actions can change that multiplier while raw token balances stay unchanged. Talon reads the live multiplier and records each clip holder's entry index; it does not promise a fixed yield.",
    },
    {
      q: "Can my collateral ever be liquidated during a severe market crash?",
      a: "No. Talon operates on a pure tokenization and decomposition model with zero borrowing, zero debt, and no liquidation oracles. Because no leverage is issued against deposited collateral, positions remain 100% solvent regardless of market volatility.",
    },
    {
      q: "How is deterministic 1:1 price parity enforced?",
      a: "The vault smart contract enforces a mathematical invariant: burning equal clip and talon raw-token amounts redeems the same raw amount of underlying AAPLc. No claim should be described as one permanent share because B20 uses a multiplier.",
    },
    {
      q: "Can clip and talon be traded or gifted independently?",
      a: "The current Phase 0 product supports transferring clip and talon claims between eligible Base wallets. Secondary market liquidity is not promised until a real pool or venue exists.",
    },
  ];

  return (
    <div className="w-full max-w-full overflow-x-clip bg-white dark:bg-[#060919] text-[#050B24] dark:text-[#F8FAFC] font-sans antialiased selection:bg-[#010FEE] selection:text-white transition-colors duration-200">
      {/* ===================================================================
          1. HERO SECTION (Wise Style: Massive Bold Headline + Clean Canvas)
         =================================================================== */}
      <section className="hero-landing relative w-full px-4 pb-16 pt-12 text-center sm:px-6 sm:pb-24 sm:pt-20 lg:px-8">
        <div className="max-w-2xl mx-auto mb-6 text-left"><EligibilityBanner /></div>
        <div className="hero-surface absolute inset-x-0 top-0 z-0 h-[710px] overflow-hidden pointer-events-none">
          <div className="hero-grid absolute inset-0 opacity-70 dark:opacity-35" />
        </div>
        {/* Category Pill Tag */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-bold text-white shadow-sm backdrop-blur dark:border-[#010FEE]/20 dark:bg-[#EEF2FF] dark:text-[#010FEE] mb-6">
          <TalonLogo className="w-4 h-4" size={16} rounded="full" />
          <span>Official Coinbase stocks · Base mainnet</span>
        </div>

        {/* Aggressive 900 Display Headline */}
        <h1 className="mx-auto max-w-5xl px-2 text-[clamp(1.9rem,10.5vw,5.75rem)] font-black uppercase leading-[0.95] tracking-[-0.05em] text-white dark:text-[#050B24]">
          SPLIT THE STOCK. <br />
          <span className="hero-title-accent">CHOOSE YOUR EXPOSURE.</span>
        </h1>

        {/* Clear, Human Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl px-4 text-base font-normal leading-relaxed text-white/80 dark:text-[#334155] sm:text-xl">
          Split an official Coinbase stock token into two simple, transferable Base-native claims: <strong className="text-white dark:text-[#010FEE]">Clip</strong> for multiplier exposure and <strong className="text-white dark:text-[#050B24]">Talon</strong> for price exposure.
        </p>

        {/* Action Buttons: 9999px Pills */}
        <div className="relative z-20 mt-8 flex w-full flex-col items-center justify-center gap-4 px-4 sm:flex-row">
          <Link
            href="/app"
            prefetch={true}
            onClick={() => setIsLaunching(true)}
            className="flex w-full max-w-xs items-center justify-center gap-2.5 rounded-full bg-[#010FEE] px-9 py-4 text-base font-bold text-white shadow-[0_8px_30px_rgba(1,15,238,0.28)] transition-all hover:bg-[#000ED6] active:scale-95 sm:w-auto sm:max-w-none"
          >
            {isLaunching ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Launching App...</span>
              </>
            ) : (
              <>
            <span>Open the app</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Link>
          <Link
            href="/app/vault"
            prefetch={true}
            className="flex w-full max-w-xs items-center justify-center rounded-full border-2 border-white px-8 py-4 text-base font-bold text-white transition-all hover:bg-white/10 active:scale-95 dark:border-[#010FEE] dark:text-[#010FEE] dark:hover:bg-[#010FEE]/10 sm:w-auto sm:max-w-none"
          >
            <span>Try the split desk</span>
          </Link>
        </div>

        <div className="text-xs text-white/65 dark:text-[#475569] font-medium mt-4">
          Non-custodial · Base mainnet · For eligible non-US users
        </div>

        <div className="relative z-10 mx-auto mt-10 max-w-full overflow-hidden rounded-full border border-[#E2E8F4] bg-white/80 py-2.5 text-[11px] font-semibold text-[#64748B] shadow-sm backdrop-blur dark:border-[#1E294B] dark:bg-[#0D152F] dark:text-[#94A3B8]">
          <div className="ticker-marquee flex w-max gap-8 whitespace-nowrap">
            {['AAPLc · OFFICIAL', 'CLIP · ACCRETION', 'TALON · PRICE', 'BASE MAINNET', '1:1 · RECOMBINE', 'AAPLc · OFFICIAL', 'CLIP · ACCRETION', 'TALON · PRICE'].map((item, index) => <span key={index} className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#010FEE]" />{item}</span>)}
          </div>
        </div>

        <nav aria-label="Landing page sections" className="relative z-10 mx-auto mt-5 flex max-w-xl items-center justify-center gap-1 rounded-full border border-[#E2E8F4] bg-white/80 p-1 shadow-sm dark:border-[#1E294B] dark:bg-[#0D152F]">
          {[['how-it-works', 'How it works'], ['markets', 'Markets'], ['strategies', 'Strategies']].map(([href, label]) => (
            <a key={href} href={`#${href}`} className="flex-1 rounded-full px-3 py-2 text-[11px] font-bold text-[#64748B] transition-colors hover:bg-[#EEF2FF] hover:text-[#010FEE] dark:text-[#94A3B8] dark:hover:bg-[#162044] dark:hover:text-blue-400">{label}</a>
          ))}
        </nav>

        {/* Signature product visual */}
        <div className="hidden mt-14 max-w-5xl mx-auto rounded-[32px] bg-[#050B24] p-5 sm:p-8 text-left shadow-[0_30px_90px_rgba(5,11,36,0.20)] relative overflow-hidden">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#010FEE]/40 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-[#7C3AED]/20 blur-3xl" />
          <div className="relative flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="lg:w-[32%]">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A5B4FC]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
                Return Decomposition Architecture
              </div>
              <h2 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-white">
                One stock.<br />
                <span className="text-[#A5B4FC]">Two simple claims.</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Split AAPLc into Clip and Talon. Recombine equal amounts when you want AAPLc back.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A5B4FC]">Underlying Asset</span>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-mono text-white/60">AAPLc</span>
                </div>
                <div className="mt-7 text-2xl font-black text-white font-mono">1.00</div>
                <div className="mt-1 text-xs text-white/50 font-medium">Official Coinbase token</div>
              </div>
              <div className="flex h-10 w-10 rotate-90 items-center justify-center justify-self-center rounded-full border border-white/15 bg-white/10 text-[#A5B4FC] sm:rotate-0">
                <ArrowRight className="h-4 w-4" />
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-[#818CF8]/40 bg-[#4F46E5]/20 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C7D2FE]">Multiplier Leg</span>
                    <span className="text-xs font-mono text-[#C7D2FE]">clipAAPLc</span>
                  </div>
                  <div className="mt-3 text-lg font-black text-white">Multiplier Growth</div>
                  <div className="text-[11px] text-white/60 mt-0.5">Multiplier exposure</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Principal Leg</span>
                    <span className="text-xs font-mono text-white/60">talonAAPLc</span>
                  </div>
                  <div className="mt-3 text-lg font-black text-white">Price Delta</div>
                  <div className="text-[11px] text-white/60 mt-0.5">Price exposure</div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-[11px] font-medium text-white/45">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#34D399]" /> 1:1 raw backing</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#34D399]" /> Base mainnet</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#34D399]" /> Recombine anytime</span>
          </div>
        </div>

        {/* Interactive Inset Unbundler Preview Card */}
        <div className="mt-14 max-w-xl mx-auto bg-white dark:bg-[#0D152F] rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] p-6 sm:p-8 shadow-[0_20px_60px_rgba(1,15,238,0.08)] text-left transition-colors">
          {/* Segmented Pill Tabs */}
          <div className="flex overflow-x-auto p-1.5 rounded-full bg-[#F1F5F9] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] mb-6">
            <button
              onClick={() => setCalcMode("split")}
              className={`min-w-max flex-1 py-2.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
                calcMode === "split"
                  ? "bg-[#010FEE] text-white shadow-sm"
                  : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#050B24] dark:hover:text-white"
              }`}
            >
              Split AAPLc
            </button>
            <button
              onClick={() => setCalcMode("recombine")}
              className={`min-w-max flex-1 py-2.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
                calcMode === "recombine"
                  ? "bg-[#010FEE] text-white shadow-sm"
                  : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#050B24] dark:hover:text-white"
              }`}
            >
              Get AAPLc back
            </button>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">
              <span>{calcMode === "split" ? "You deposit" : "You return"}</span>
              <span>Price: {formattedPrice === "—" ? "—" : `${formattedPrice} USD`}</span>
            </div>
            <div className="relative rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] p-4 transition-all focus-within:border-[#010FEE] focus-within:ring-2 focus-within:ring-[#010FEE]/10">
              <div className="flex items-center justify-between">
                <input
                  type="number"
                  step="any"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(e.target.value)}
                  className="w-full bg-transparent font-mono text-3xl font-bold text-[#050B24] dark:text-white focus:outline-none"
                  placeholder="1.00"
                />
                <div className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#2A3B6B] flex items-center gap-2 shrink-0">
                  <AppleLogo className="w-4 h-4 text-black dark:text-white" />
                  <span className="text-xs font-bold text-[#050B24] dark:text-white">AAPLc</span>
                </div>
              </div>
              <div className="text-xs text-[#94A3B8] dark:text-[#64748B] font-mono mt-1">
                {estUsd === null ? "USD estimate unavailable" : `≈ $${estUsd} USD`}
              </div>
            </div>
          </div>

          {/* Arrow divider */}
          <div className="flex justify-center -my-3 relative z-10">
            <div className="w-9 h-9 rounded-full bg-white dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] flex items-center justify-center text-[#010FEE] dark:text-blue-400 shadow-md">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>

          {/* Output Preview */}
          <div className="mt-2 space-y-3">
            <div className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium flex items-center justify-between">
              <span>{calcMode === "split" ? "You receive" : "You receive"}</span>
              <span className="text-[#010FEE] dark:text-blue-400 font-bold text-[11px] flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Equal raw amounts
              </span>
            </div>

            {calcMode === "split" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                {/* clip */}
                <div className="p-4 rounded-2xl bg-[#EEF2FF] dark:bg-blue-950/60 border border-[#010FEE]/20 dark:border-blue-800 space-y-1">
                  <div className="text-[11px] font-bold text-[#010FEE] dark:text-blue-400 flex items-center justify-between font-sans">
                    <span>clipAAPLc</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#010FEE] text-white text-[10px]">
                      Multiplier
                    </span>
                  </div>
                  <div className="text-2xl font-black text-[#010FEE] dark:text-blue-400">
                    {numAmount > 0 ? calcAmount : "0.00"}
                  </div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-sans">
                    B20 multiplier exposure
                  </div>
                </div>

                {/* talon */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] space-y-1">
                  <div className="text-[11px] font-bold text-[#050B24] dark:text-white flex items-center justify-between font-sans">
                    <span>talonAAPLc</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#050B24] dark:bg-blue-500 text-white text-[10px]">
                      Price
                    </span>
                  </div>
                  <div className="text-2xl font-black text-[#050B24] dark:text-white">
                    {numAmount > 0 ? calcAmount : "0.00"}
                  </div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-sans">
                    Stock price exposure
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    AAPLc returned
                  </div>
                  <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                    {numAmount > 0 ? calcAmount : "0.00"} AAPLc
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold">
                  Ready
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-5 border-t border-[#E2E8F4] dark:border-[#1E294B] flex items-center justify-between">
            <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Ready on Base?
            </span>
            <Link
              href="/app/vault"
              className="text-xs font-bold text-[#010FEE] dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Open split desk <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. THREE-COLUMN TRUST SIGNALS: CORE FINANCIAL PRIMITIVES
         =================================================================== */}
      <section className="hidden py-16 sm:py-24 bg-[#F8FAFC] dark:bg-[#080D26] border-y border-[#E2E8F4] dark:border-[#1E294B] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-mono font-bold text-[#010FEE] dark:text-blue-400 uppercase tracking-wider mb-2">
              Core Financial Primitives
            </div>
              <h2 className="text-3xl sm:text-5xl font-black text-[#050B24] dark:text-white tracking-tight">
              One stock. Two ways to hold it.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-[#0D152F] p-8 rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] space-y-4 shadow-sm transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 flex items-center justify-center font-bold">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#050B24] dark:text-white">
                Clip tracks the multiplier
              </h3>
              <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Clip follows the B20 multiplier. It is an exposure claim, not a promised dividend or fixed yield.
              </p>
            </div>

            <div className="bg-white dark:bg-[#0D152F] p-8 rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] space-y-4 shadow-sm transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#050B24] dark:text-white">
                No borrowed position
              </h3>
              <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Talon is a vault split, not a loan. There is no debt or liquidation engine in the shipped flow.
              </p>
            </div>

            <div className="bg-white dark:bg-[#0D152F] p-8 rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] space-y-4 shadow-sm transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 flex items-center justify-center font-bold">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#050B24] dark:text-white">
                Recombine 1:1
              </h3>
              <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Equal raw-token amounts can be recombined in the vault for the underlying AAPLc amount, subject to the contract and eligibility rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          3. HOW IT WORKS (4 Step Walkthrough)
         =================================================================== */}
      <section id="how-it-works" className="scroll-mt-24 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-mono font-bold text-[#010FEE] dark:text-blue-400 uppercase tracking-wider mb-2">
            The flow
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#050B24] dark:text-white tracking-tight">
            Split. Choose. Recombine.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] space-y-3 shadow-sm hover:border-[#010FEE]/40 transition-all">
            <div className="w-10 h-10 rounded-full bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 font-mono text-sm font-black flex items-center justify-center">
              01
            </div>
            <h3 className="font-bold text-lg text-[#050B24] dark:text-white">Deposit AAPLc</h3>
            <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              Put AAPLc in the Base vault.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] space-y-3 shadow-sm hover:border-[#010FEE]/40 transition-all">
            <div className="w-10 h-10 rounded-full bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 font-mono text-sm font-black flex items-center justify-center">
              02
            </div>
            <h3 className="font-bold text-lg text-[#050B24] dark:text-white">Receive two tokens</h3>
            <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              The vault issues equal raw-token amounts of Clip and Talon.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] space-y-3 shadow-sm hover:border-[#010FEE]/40 transition-all">
            <div className="w-10 h-10 rounded-full bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 font-mono text-sm font-black flex items-center justify-center">
              03
            </div>
            <h3 className="font-bold text-lg text-[#050B24] dark:text-white">Choose your leg</h3>
            <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              Hold or transfer the leg that matches the exposure you want.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] space-y-3 shadow-sm hover:border-[#010FEE]/40 transition-all">
            <div className="w-10 h-10 rounded-full bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 font-mono text-sm font-black flex items-center justify-center">
              04
            </div>
            <h3 className="font-bold text-lg text-[#050B24] dark:text-white">Recombine later</h3>
            <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              Return equal raw-token pairs to redeem the underlying amount.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================================
          4. SUPPORTED STOCKS DIRECTORY (With Real Official SVG Logos & Live Prices)
         =================================================================== */}
      <section id="markets" className="relative scroll-mt-24 overflow-hidden border-y border-[#000ED6] bg-[#010FEE] py-16 transition-colors sm:py-24 dark:border-[#1E2B62] dark:bg-[#071340]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-24 top-12 h-72 w-[120%] -rotate-6 rounded-[50%] border border-white/15" />
          <div className="absolute -left-20 top-24 h-72 w-[120%] -rotate-6 rounded-[50%] border border-cyan-300/20" />
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-indigo-950/35 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-200 mb-2">
                Market Coverage
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Supported Stocks
              </h2>
            </div>
            <p className="max-w-md text-sm text-blue-100/80">
              Official list · live Base data when verified.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {supportedStocks.map((s) => {
              const price = s.active ? formattedPrice : "—";
              const Logo = s.Logo;

              return (
                <div
                  key={s.symbol}
                  className="bg-white dark:bg-[#0D152F] p-5 rounded-2xl border border-[#E2E8F4] dark:border-[#1E294B] shadow-sm flex items-center justify-between hover:border-[#010FEE]/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] flex items-center justify-center p-2 shrink-0">
                      <Logo className="w-full h-full text-[#050B24] dark:text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#050B24] dark:text-white flex items-center gap-2">
                        <span>{s.symbol}</span>
                        {s.active ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 text-[10px] font-bold">
                            Active Vault
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-[#F1F5F9] dark:bg-[#162044] text-[#94A3B8] dark:text-[#64748B] text-[10px] font-bold">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{s.name}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-sm font-bold text-[#050B24] dark:text-white">
                      {price}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================
          5. INSTITUTIONAL EXPOSURE STRATEGIES
         =================================================================== */}
      <section id="strategies" className="scroll-mt-24 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono font-bold text-[#010FEE] dark:text-blue-400 uppercase tracking-wider mb-2">
            Execution Framework
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#050B24] dark:text-white tracking-tight">
              Choose your exposure
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] dark:text-[#94A3B8] mt-3 leading-relaxed">
            Choose the exposure you want from one official stock token.
          </p>
        </div>

        <div className="mx-auto mb-8 flex max-w-3xl flex-wrap justify-center gap-2 rounded-2xl border border-[#E2E8F4] bg-[#F8FAFC] p-2 dark:border-[#1E294B] dark:bg-[#0D152F]">
          {strategies.map((strategy) => (
            <button
              key={strategy.id}
              type="button"
              onClick={() => setActiveStrategy(strategy.id)}
              className={`flex-1 rounded-xl px-4 py-3 text-left text-xs font-bold transition-all ${activeStrategy === strategy.id ? "bg-[#010FEE] text-white shadow-lg shadow-[#010FEE]/20" : "text-[#64748B] hover:bg-white hover:text-[#010FEE] dark:text-[#94A3B8] dark:hover:bg-[#162044]"}`}
            >
              <span className="block">{strategy.title}</span>
              <span className={`mt-1 block text-[10px] font-medium ${activeStrategy === strategy.id ? "text-white/70" : "text-[#94A3B8]"}`}>{strategy.badge}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {strategies.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                onClick={() => setActiveStrategy(s.id)}
                className={`group relative bg-white dark:bg-[#0D152F] rounded-3xl border p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-all cursor-pointer ${activeStrategy === s.id ? "border-[#010FEE] dark:border-blue-400 ring-4 ring-[#010FEE]/10 dark:ring-blue-400/10" : "border-[#E2E8F4] dark:border-[#1E294B] hover:border-[#010FEE]/40 dark:hover:border-blue-500/40"}`}
              >
                <div className="space-y-5">
                  {/* Top Bar: Icon + Badge + Ticker */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] group-hover:bg-[#EEF2FF] dark:group-hover:bg-blue-950/60 group-hover:border-[#010FEE]/20 flex items-center justify-center text-[#010FEE] dark:text-blue-400 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border ${s.badgeColor}`}
                      >
                        {s.badge}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] bg-[#F8FAFC] dark:bg-[#162044] px-2.5 py-1 rounded-lg border border-[#E2E8F4] dark:border-[#2A3B6B]">
                      {s.leg}
                    </span>
                  </div>

                  {/* Title & Audience */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-[#050B24] dark:text-white tracking-tight group-hover:text-[#010FEE] dark:group-hover:text-blue-400 transition-colors">
                      {s.title}
                    </h3>
                    <div className="text-xs font-semibold text-[#010FEE] dark:text-blue-400">
                      {s.audience}
                    </div>
                  </div>

                  {/* Core Value Statement */}
                  <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                    {s.tagline}
                  </p>

                  {/* Clean Specs Table / Key-Values */}
                  <div className="rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] p-4 space-y-2.5">
                    {s.specs.map((spec, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between gap-3 text-xs ${
                          idx !== s.specs.length - 1
                            ? "pb-2.5 border-b border-[#E2E8F4]/70 dark:border-[#2A3B6B]/70"
                            : ""
                        }`}
                      >
                        <span className="text-[#64748B] dark:text-[#94A3B8] font-medium shrink-0">
                          {spec.label}
                        </span>
                        <span className="font-semibold text-[#050B24] dark:text-white text-right truncate">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Full-Width Action Button */}
                <div className="pt-5 mt-5 border-t border-[#F1F5F9] dark:border-[#1E294B]">
                  <Link
                    href={s.link}
                    className="w-full py-3 px-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] hover:bg-[#010FEE] dark:hover:bg-[#010FEE] border border-[#E2E8F4] dark:border-[#2A3B6B] hover:border-[#010FEE] text-[#050B24] dark:text-white hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 group/btn shadow-xs"
                  >
                    <span>{s.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================================================================
          6. CAPITAL STRUCTURE COMPARISON MATRIX
         =================================================================== */}
      <section className="hidden py-16 sm:py-24 bg-[#F8FAFC] dark:bg-[#080D26] border-y border-[#E2E8F4] dark:border-[#1E294B] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="text-xs font-mono font-bold text-[#010FEE] dark:text-blue-400 uppercase tracking-wider mb-2">
              Capital Efficiency Matrix
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#050B24] dark:text-white tracking-tight">
              Capital Structure Comparison
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] dark:text-[#94A3B8] mt-3 leading-relaxed">
              How Talon&apos;s unbundled claims compare to raw spot tokenized stocks and traditional credit/margin structures.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] bg-white dark:bg-[#0D152F] shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F4] dark:border-[#1E294B] bg-[#F8FAFC] dark:bg-[#162044]">
                  <th className="py-4 px-6 text-xs font-mono font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                    Property
                  </th>
                  <th className="py-4 px-6 text-xs font-mono font-bold text-[#050B24] dark:text-white uppercase tracking-wider">
                    Spot Stock (AAPLc)
                  </th>
                  <th className="py-4 px-6 text-xs font-mono font-bold text-[#010FEE] dark:text-blue-400 uppercase tracking-wider">
                    Multiplier (clipAAPLc)
                  </th>
                  <th className="py-4 px-6 text-xs font-mono font-bold text-[#050B24] dark:text-white uppercase tracking-wider">
                    Principal (talonAAPLc)
                  </th>
                  <th className="py-4 px-6 text-xs font-mono font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                    Margin / Lending
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#1E294B] text-xs sm:text-sm">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFC]/50 dark:hover:bg-[#162044]/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#050B24] dark:text-white">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 font-mono text-[#475569] dark:text-[#94A3B8]">
                      {row.underlying}
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-[#010FEE] dark:text-blue-400">
                      {row.clip}
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-[#050B24] dark:text-white">
                      {row.talon}
                    </td>
                    <td className="py-4 px-6 font-mono text-[#94A3B8] dark:text-[#64748B]">
                      {row.traditional}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===================================================================
          7. INVERTED BLUE CALLOUT SECTION
         =================================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-[32px] bg-[#010FEE] text-white p-8 sm:p-14 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4 text-center lg:text-left z-10">
            <span className="px-3.5 py-1 rounded-full bg-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider">
              Base Mainnet • Non-Custodial
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to split AAPLc?
            </h2>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed">
              Connect a wallet, choose an amount, and receive Clip + Talon on Base.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 z-10 shrink-0">
            <Link
              href="/app"
              prefetch={true}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-[#010FEE] font-black text-sm transition-all hover:bg-[#EEF2FF] active:scale-95 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Split Desk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/docs"
              className="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-white text-white font-bold text-sm transition-all hover:bg-white/10 flex items-center justify-center"
            >
              <span>Explore Protocol Docs</span>
            </Link>
          </div>

          {/* Background decorative circles */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        </div>
      </section>

      {/* ===================================================================
          8. FAQ SECTION
         =================================================================== */}
      <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="text-xs font-mono font-bold text-[#010FEE] dark:text-blue-400 uppercase tracking-wider mb-2">
            Quick answers
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#050B24] dark:text-white tracking-tight">
            Everything you need to know
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#E2E8F4] dark:border-[#1E294B] bg-white dark:bg-[#0D152F] overflow-hidden shadow-sm transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 transition-colors hover:bg-[#F8FAFC] dark:hover:bg-[#162044] cursor-pointer"
              >
                <span className="font-bold text-base text-[#050B24] dark:text-white">{f.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#64748B] dark:text-[#94A3B8] transition-transform duration-200 shrink-0 ${
                    openFaq === i ? "rotate-180 text-[#010FEE] dark:text-blue-400" : ""
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed border-t border-[#F1F5F9] dark:border-[#1E294B] pt-4">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
