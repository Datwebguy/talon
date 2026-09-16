"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  LayoutGrid,
  List,
  TrendingUp,
  ArrowUpRight,
  PlusCircle,
  Check,
  Sparkles,
  Droplets,
  ExternalLink,
  X,
} from "lucide-react";
import { OFFICIAL_TOKENS } from "../../../config/contracts";
import { OFFICIAL_MARKET_PAIRS, USDC_BASE } from "../../../config/contracts";
import { useVault } from "../../../hooks/useVault";
import { useB20Data } from "../../../hooks/useB20Data";
import { useLiveMarket } from "../../../hooks/useLiveMarket";
import {
  AppleLogo,
  NvidiaLogo,
  GoogleLogo,
  MetaLogo,
  AmazonLogo,
  MicrosoftLogo,
  TeslaLogo,
} from "../../../components/CompanyLogos";
import { TalonLogo } from "../../../components/TalonLogo";

function TickerMark({ symbol, className = "" }: { symbol: string; className?: string }) {
  return (
    <span
      className={`inline-flex h-full w-full items-center justify-center rounded-xl bg-[#E8EDFF] text-[11px] font-black tracking-tight text-[#010FEE] dark:bg-[#202D60] dark:text-blue-200 ${className}`}
      aria-hidden="true"
    >
      {symbol.replace("c", "").slice(0, 4)}
    </span>
  );
}

export default function MarketsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "stock" | "etf">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [addedToken, setAddedToken] = useState<string | null>(null);
  const [comingSoonToken, setComingSoonToken] = useState<string | null>(null);
  const [activePoint, setActivePoint] = useState<{ symbol: string; index: number } | null>(null);

  const aapl = OFFICIAL_TOKENS[0];
  const aaplAerodromeUrl = `https://aerodrome.finance/swap?from=${USDC_BASE}&to=${aapl.address}`;
  const { formattedPrice } = useB20Data(aapl.address);
  const { clipAddress, talonAddress } = useVault(aapl.address, aapl.decimals);
  const { marketData, isLoading: isMarketLoading, lastUpdatedAt } = useLiveMarket();

  const handleAddToWallet = async (address: string, symbol: string, decimals: number) => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: { address, symbol, decimals },
          },
        });
        setAddedToken(symbol);
        setTimeout(() => setAddedToken(null), 2500);
      } catch (err) {
        console.error("User rejected token watch request", err);
      }
    }
  };

  const stocks = [
    {
      symbol: "AAPLc",
      key: "AAPL",
      name: "Apple Inc.",
      type: "stock",
      Logo: AppleLogo,
      clipSymbol: "clipAAPLc",
      talonSymbol: "talonAAPLc",
      address: aapl.address,
      clipAddress: clipAddress,
      talonAddress: talonAddress,
      isLive: true,
      status: "Active Vault",
      marketPair: OFFICIAL_MARKET_PAIRS.AAPLc,
    },
    {
      symbol: "NVDAc",
      key: "NVDA",
      name: "NVIDIA Corp.",
      type: "stock",
      Logo: NvidiaLogo,
      clipSymbol: "clipNVDAc",
      talonSymbol: "talonNVDAc",
      address: "0xb20000000000000000000078ee7ce2fE4908108C",
      clipAddress: "",
      talonAddress: "",
      isLive: true,
      status: "Factory Ready",
      marketPair: OFFICIAL_MARKET_PAIRS.NVDAc,
    },
    {
      symbol: "GOOGLc",
      key: "GOOGL",
      name: "Alphabet Inc.",
      type: "stock",
      Logo: GoogleLogo,
      clipSymbol: "clipGOOGLc",
      talonSymbol: "talonGOOGLc",
      address: "0xb2000000000000000000002D0BA3164cc74f58B7",
      clipAddress: "",
      talonAddress: "",
      isLive: true,
      status: "Factory Ready",
      marketPair: OFFICIAL_MARKET_PAIRS.GOOGLc,
    },
    {
      symbol: "METAc",
      key: "META",
      name: "Meta Platforms",
      type: "stock",
      Logo: MetaLogo,
      clipSymbol: "clipMETAc",
      talonSymbol: "talonMETAc",
      address: "0xb2000000000000000000008bC8786B856E61707C",
      clipAddress: "",
      talonAddress: "",
      isLive: true,
      status: "Factory Ready",
      marketPair: OFFICIAL_MARKET_PAIRS.METAc,
    },
    {
      symbol: "AMZNc",
      key: "AMZN",
      name: "Amazon.com Inc.",
      type: "stock",
      Logo: AmazonLogo,
      clipSymbol: "clipAMZNc",
      talonSymbol: "talonAMZNc",
      address: "0xb200000000000000000000d9192b6B456483C2E8",
      clipAddress: "",
      talonAddress: "",
      isLive: true,
      status: "Verified DEX",
      marketPair: OFFICIAL_MARKET_PAIRS.AMZNc,
    },
    {
      symbol: "MSFTc",
      key: "MSFT",
      name: "Microsoft Corp.",
      type: "stock",
      Logo: MicrosoftLogo,
      clipSymbol: "clipMSFTc",
      talonSymbol: "talonMSFTc",
      address: "0xB200000000000000000000Ab99cFa739E253872B",
      clipAddress: "",
      talonAddress: "",
      isLive: true,
      status: "Verified DEX",
      marketPair: OFFICIAL_MARKET_PAIRS.MSFTc,
    },
    {
      symbol: "MSTRc",
      key: "MSTR",
      name: "Strategy Inc.",
      type: "stock",
      Logo: ({ className }: { className?: string }) => <TickerMark symbol="MSTRc" className={className} />,
      clipSymbol: "clipMSTRc",
      talonSymbol: "talonMSTRc",
      address: "0xb2000000000000000000004884b426556b92883d",
      clipAddress: "",
      talonAddress: "",
      isLive: true,
      status: "Verified DEX",
      marketPair: OFFICIAL_MARKET_PAIRS.MSTRc,
    },
    {
      symbol: "SNDKc",
      key: "SNDK",
      name: "SanDisk Corp.",
      type: "stock",
      Logo: ({ className }: { className?: string }) => <TickerMark symbol="SNDKc" className={className} />,
      clipSymbol: "clipSNDKc",
      talonSymbol: "talonSNDKc",
      address: "0xb200000000000000000000397293Cb8cda9a10c5",
      clipAddress: "",
      talonAddress: "",
      isLive: true,
      status: "Verified DEX",
      marketPair: OFFICIAL_MARKET_PAIRS.SNDKc,
    },
    {
      symbol: "SPCXc",
      key: "SPCX",
      name: "SpaceX",
      type: "stock",
      Logo: ({ className }: { className?: string }) => <TickerMark symbol="SPCXc" className={className} />,
      clipSymbol: "clipSPCXc",
      talonSymbol: "talonSPCXc",
      address: "0xb2000000000000000000007b9fcbd005511aCBd5",
      clipAddress: "",
      talonAddress: "",
      isLive: true,
      status: "Verified DEX",
      marketPair: OFFICIAL_MARKET_PAIRS.SPCXc,
    },
    {
      symbol: "TSLAc",
      key: "TSLA",
      name: "Tesla Inc.",
      type: "stock",
      Logo: TeslaLogo,
      clipSymbol: "clipTSLAc",
      talonSymbol: "talonTSLAc",
      address: "0xb2000000000000000000001e800a7f5189430cD0",
      clipAddress: "",
      talonAddress: "",
      isLive: true,
      status: "Verified DEX",
      marketPair: OFFICIAL_MARKET_PAIRS.TSLAc,
    },
  ];

  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
      stock.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || stock.type === filter;
    return matchesSearch && matchesFilter;
  });

  const comingSoonStock = stocks.find((stock) => stock.symbol === comingSoonToken);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <TalonLogo className="w-8 h-8" size={32} rounded="xl" />
          <h1 className="text-3xl sm:text-4xl font-black text-[#050B24] dark:text-white tracking-tight">
            Markets
          </h1>
        </div>
        <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] mt-1.5 font-medium">
          Official Coinbase tokens on Base.
        </p>
      </div>

      {/* Explore Stocks Header + live feed badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl sm:text-2xl font-black text-[#050B24] dark:text-white">
            Explore Stocks
          </h2>
          <span className="text-xs font-mono font-bold text-[#64748B] dark:text-[#94A3B8] px-2 py-0.5 rounded-full bg-[#F1F5F9] dark:bg-[#162044]">
            • {filteredStocks.length}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#010FEE] dark:text-blue-300 bg-[#EEF2FF] dark:bg-blue-950/60 border border-[#C7D2FE] dark:border-blue-800 px-3 py-1.5 rounded-full w-fit">
          <span className="w-2 h-2 rounded-full bg-[#010FEE] dark:bg-blue-400"></span>
          <span>{isMarketLoading ? "Syncing Base prices" : "Live Base prices · refreshes every 30s"}</span>
          {lastUpdatedAt && (
            <span className="font-mono font-medium text-[#64748B] dark:text-blue-200/70">
              {new Date(lastUpdatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
      </div>

      {/* Liquidity and verification hub */}
      <section className="relative overflow-hidden rounded-[28px] border border-[#C7D2FE] dark:border-[#1E294B] bg-gradient-to-br from-[#EEF2FF] via-white to-[#E0F2FE] dark:from-[#0D152F] dark:via-[#080D26] dark:to-[#162044] p-6 sm:p-8 transition-colors">
        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[#A5B4FC]/30 dark:bg-blue-900/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#010FEE] dark:text-blue-400">
              <Droplets className="h-4 w-4" />
              Market access
            </div>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-[#050B24] dark:text-white sm:text-3xl">
              Find your stock
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-[#94A3B8]">
              Review the official token, check the market, then open the split desk for AAPLc.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-[#475569] dark:text-[#94A3B8]">
              <span className="rounded-full border border-[#C7D2FE] dark:border-[#2A3B6B] bg-white/70 dark:bg-[#162044]/80 px-3 py-1.5">Base mainnet</span>
              <span className="rounded-full border border-[#C7D2FE] dark:border-[#2A3B6B] bg-white/70 dark:bg-[#162044]/80 px-3 py-1.5">Official list</span>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
            <a
              href={aaplAerodromeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#010FEE] px-5 py-3 text-xs font-bold text-white shadow-[0_8px_20px_rgba(1,15,238,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#000ED6]"
            >
              Open AAPLc market <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href={`https://basescan.org/token/${aapl.address}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C7D2FE] dark:border-[#2A3B6B] bg-white/80 dark:bg-[#162044] px-5 py-3 text-xs font-bold text-[#010FEE] dark:text-blue-400 transition-colors hover:bg-white dark:hover:bg-[#1E2B5C]"
            >
              Verify AAPLc onchain <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Control Bar: Search + Filter Pills + View Mode */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] dark:text-[#64748B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search asset name or ticker"
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] text-xs sm:text-sm font-medium text-[#050B24] dark:text-white placeholder-[#94A3B8] dark:placeholder-[#64748B] outline-none focus:border-[#010FEE] dark:focus:border-blue-400 transition-colors"
          />
        </div>

        {/* Filter Pills + View Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex p-1 rounded-full bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] shrink-0">
            <button
              onClick={() => setFilter("all")}
              className={`whitespace-nowrap px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-[#010FEE] text-white shadow-sm"
                  : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#050B24] dark:hover:text-white"
              }`}
            >
              All assets
            </button>
            <button
              onClick={() => setFilter("stock")}
              className={`whitespace-nowrap px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                filter === "stock"
                  ? "bg-[#010FEE] text-white shadow-sm"
                  : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#050B24] dark:hover:text-white"
              }`}
            >
              Stock
            </button>
            <button
              onClick={() => setFilter("etf")}
              className={`whitespace-nowrap px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                filter === "etf"
                  ? "bg-[#010FEE] text-white shadow-sm"
                  : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#050B24] dark:hover:text-white"
              }`}
            >
              ETF
            </button>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-full bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white dark:bg-[#0D152F] text-[#010FEE] dark:text-blue-400 shadow-sm"
                  : "text-[#94A3B8] dark:text-[#64748B]"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-white dark:bg-[#0D152F] text-[#010FEE] dark:text-blue-400 shadow-sm"
                  : "text-[#94A3B8] dark:text-[#64748B]"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stock Cards Grid with Official SVG Logos & Live Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStocks.map((stock) => {
          const live = marketData?.[stock.key];
          const price = live?.formattedPrice || "—";
          const change = live?.formattedChange;
          const isUp = change?.startsWith("+") ?? true;
          const Logo = stock.Logo;

          // Compute real sparkline path from history if available
          const history = live?.history && live.history.length >= 2 ? live.history : [];
          const min = Math.min(...history);
          const max = Math.max(...history);
          const range = max - min || 1;
          const sparkPoints = history
            .map((val, idx) => {
              const x = (idx / (history.length - 1)) * 200;
              const y = 50 - ((val - min) / range) * 40;
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(" ");

          return (
            <div
              key={stock.symbol}
              className="rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] bg-white dark:bg-[#0D152F] p-6 space-y-5 hover:border-[#010FEE]/40 dark:hover:border-blue-500/40 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Card Header: Official SVG Logo + Name + Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] flex items-center justify-center p-2 shadow-sm shrink-0">
                      <Logo className="w-full h-full text-[#050B24] dark:text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-base text-[#050B24] dark:text-white">
                        {stock.symbol}
                      </div>
                      <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{stock.name}</div>
                    </div>
                  </div>

                  {stock.status === "Active Vault" ? (
                    <span className="px-2.5 py-1 rounded-full bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 text-[11px] font-bold border border-[#010FEE]/20 dark:border-blue-800">
                      Active Vault
                    </span>
                  ) : stock.status === "Factory Ready" ? (
                    <span className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-[11px] font-bold border border-purple-200 dark:border-purple-800">
                      Factory Ready
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                      Verified DEX
                    </span>
                  )}
                </div>

                <a
                  href={`https://basescan.org/token/${stock.address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#E2E8F4] bg-[#F8FAFC] px-3 py-2 text-[10px] font-semibold text-[#64748B] transition-colors hover:border-[#010FEE]/30 hover:text-[#010FEE] dark:border-[#2A3B6B] dark:bg-[#162044] dark:text-[#94A3B8] dark:hover:border-blue-500/40 dark:hover:text-blue-300"
                >
                  <span>Official Coinbase token · Base Mainnet</span>
                  <span className="shrink-0 font-mono text-[#010FEE] dark:text-blue-400">
                    {stock.address.slice(0, 6)}…{stock.address.slice(-4)} <ExternalLink className="inline h-3 w-3" />
                  </span>
                </a>

                {/* Price & Change */}
                <div className="mt-5 flex items-baseline justify-between">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-[#050B24] dark:text-white">
                    {price}
                  </div>
                  {change && (
                    <div
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 font-mono ${
                        isUp
                          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800"
                          : "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800"
                      }`}
                    >
                      <TrendingUp className="w-3 h-3" />
                      {change}
                    </div>
                  )}
                </div>

                {/* Real Live Sparkline Chart */}
                <div
                  className="relative h-20 w-full rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] p-3 flex items-end mt-4 touch-none"
                  onPointerMove={(event) => {
                    if (history.length < 2) return;
                    const rect = event.currentTarget.getBoundingClientRect();
                    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
                    setActivePoint({ symbol: stock.symbol, index: Math.round(ratio * (history.length - 1)) });
                  }}
                  onPointerLeave={() => setActivePoint((point) => point?.symbol === stock.symbol ? null : point)}
                  onPointerCancel={() => setActivePoint((point) => point?.symbol === stock.symbol ? null : point)}
                >
                  <svg
                    className="w-full h-full overflow-visible"
                    viewBox="0 0 200 60"
                    preserveAspectRatio="none"
                  >
                    <polyline
                      fill="none"
                      stroke={isUp ? "#010FEE" : "#E11D48"}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={sparkPoints}
                    />
                    {activePoint?.symbol === stock.symbol && history.length > 1 && (
                      <circle
                        cx={(activePoint.index / (history.length - 1)) * 200}
                        cy={50 - ((history[activePoint.index] - min) / range) * 40}
                        r="4"
                        fill={isUp ? "#010FEE" : "#E11D48"}
                        stroke="white"
                        strokeWidth="2"
                      />
                    )}
                  </svg>
                  {activePoint?.symbol === stock.symbol && history.length > 1 && (
                    <span className="pointer-events-none absolute right-2 top-2 rounded-lg bg-[#050B24] px-2 py-1 font-mono text-[10px] font-bold text-white shadow-lg">
                      ${history[activePoint.index].toFixed(2)}
                    </span>
                  )}
                  {history.length === 0 && (
                    <span className="text-[10px] text-[#94A3B8] dark:text-[#64748B]">
                      {isMarketLoading ? "Loading live market…" : "No verified candles returned"}
                    </span>
                  )}
                </div>

                {/* Split Legs Breakdown */}
                <div className="mt-4 pt-4 border-t border-[#E2E8F4] dark:border-[#1E294B] space-y-2">
                  <div className="text-[10px] uppercase font-bold text-[#94A3B8] dark:text-[#64748B] tracking-wider">
                    Unbundled Split Claims
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[#010FEE] dark:text-blue-400 font-bold">
                      {stock.clipSymbol}
                    </span>
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Accretion exposure</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[#050B24] dark:text-white font-bold">
                      {stock.talonSymbol}
                    </span>
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Principal exposure</span>
                  </div>
                  {stock.marketPair && (
                    <div className="flex items-center justify-between gap-3 pt-2 text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8]">
                      <span>{stock.marketPair.venue} · {stock.marketPair.quote}</span>
                      <a
                        href={stock.marketPair.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#010FEE] hover:underline dark:text-blue-400"
                      >
                        Pair proof <ExternalLink className="inline h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <Link
                  href={`/app/vault?asset=${stock.symbol}`}
                  className="flex-1 py-2.5 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-xs font-bold text-center transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{stock.status === "Active Vault" ? "Open Vault" : stock.status === "Factory Ready" ? "Deploy / Open Desk" : "Open Split Desk"}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>

                {stock.marketPair && (
                  <a
                    href={stock.marketPair.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-full bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] hover:bg-[#EEF2FF] dark:hover:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 transition-colors cursor-pointer"
                    title="Trade on Aerodrome DEX"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {stock.clipAddress && stock.clipSymbol && (
                  <button
                    onClick={() => {
                      if (stock.clipAddress && stock.clipSymbol) {
                        handleAddToWallet(stock.clipAddress, stock.clipSymbol, 8);
                      }
                    }}
                    className="p-2.5 rounded-full bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] hover:bg-[#EEF2FF] dark:hover:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 transition-colors cursor-pointer"
                    title="Add clip token to wallet"
                  >
                    {addedToken === stock.clipSymbol ? (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <PlusCircle className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {comingSoonStock && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#050B24]/55 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="coming-soon-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setComingSoonToken(null);
          }}
        >
          <div className="relative w-full max-w-md rounded-3xl border border-[#E2E8F4] bg-white p-6 text-left shadow-2xl dark:border-[#2A3B6B] dark:bg-[#0D152F]">
            <button
              type="button"
              aria-label="Close coming soon dialog"
              onClick={() => setComingSoonToken(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#050B24] dark:text-[#94A3B8] dark:hover:bg-[#162044] dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="pr-8">
              <span className="inline-flex rounded-full bg-[#EEF2FF] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#010FEE] dark:bg-blue-950/60 dark:text-blue-300">
                Talon vault
              </span>
              <h2 id="coming-soon-title" className="mt-4 text-2xl font-black tracking-tight text-[#050B24] dark:text-white">
                {comingSoonStock.symbol} is coming soon
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#64748B] dark:text-[#94A3B8]">
                The official Coinbase token and its Base market are visible, but Talon has not deployed a split vault for this stock yet.
              </p>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              {comingSoonStock.marketPair && (
                <a
                  href={comingSoonStock.marketPair.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#C7D2FE] px-4 py-2.5 text-xs font-bold text-[#010FEE] transition-colors hover:bg-[#EEF2FF] dark:border-[#2A3B6B] dark:text-blue-300 dark:hover:bg-[#162044]"
                >
                  View verified market <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              <button
                type="button"
                onClick={() => setComingSoonToken(null)}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-[#010FEE] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#000ED6]"
              >
                Back to markets
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
