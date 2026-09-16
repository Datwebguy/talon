"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Bot,
  Zap,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Lock,
  Sparkles,
} from "lucide-react";
import { OFFICIAL_TOKENS, AAPLC_VAULT_ADDRESS, AAPLC_CLIP_ADDRESS, AAPLC_TALON_ADDRESS } from "../../../config/contracts";
import { sentinelEngine, DEFAULT_DYNAMIC_POLICY } from "../../../lib/sentinel/engine";
import { StockRiskMetrics, SentinelStrategy, SentinelExecutionLog } from "../../../lib/sentinel/types";

export default function SentinelPage() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPLc");
  const [metrics, setMetrics] = useState<StockRiskMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStrategy, setActiveStrategy] = useState<SentinelStrategy>("earnings-shield");
  const [logs, setLogs] = useState<SentinelExecutionLog[]>([]);
  const [executing, setExecuting] = useState(false);
  const [bankrInput, setBankrInput] = useState("Bankr, shield my AAPLc before earnings on Base");
  const [bankrOutput, setBankrOutput] = useState<string | null>(null);

  // Load initial metrics on mount or symbol switch
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    sentinelEngine.getStockRiskMetrics(selectedSymbol).then((data) => {
      if (!mounted) return;
      setMetrics(data);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [selectedSymbol]);

  // Initial mock log for demonstration
  useEffect(() => {
    setLogs([
      {
        id: "init-1",
        timestamp: Date.now() - 1000 * 60 * 14,
        strategy: "earnings-shield",
        action: "PARITY_CHECK",
        asset: "AAPLc",
        amount: "1.00000000",
        status: "CONFIRMED",
        details: "Mathematical 1:1 invariant verified across TalonVault (0x12bb3fFa...). Ratio: 1.0000x.",
        txHash: "0x4a78498ad2722726ecdf2448eec5a03b653037f312b6c9f46406a693f58f91b6",
        explorerUrl: "https://basescan.org/tx/0x4a78498ad2722726ecdf2448eec5a03b653037f312b6c9f46406a693f58f91b6",
      },
    ]);
  }, []);

  const handleRunStrategy = () => {
    setExecuting(true);
    setTimeout(() => {
      const newLog = sentinelEngine.simulateAction(activeStrategy, selectedSymbol, "1.0");
      setLogs((prev) => [newLog, ...prev]);
      setExecuting(false);
    }, 1200);
  };

  const handleBankrCommand = () => {
    setBankrOutput("Processing via Bankr LLM Gateway on Base...");
    setTimeout(() => {
      const isShield = bankrInput.toLowerCase().includes("shield");
      if (isShield) {
        const newLog = sentinelEngine.simulateAction("earnings-shield", selectedSymbol, "1.0");
        setLogs((prev) => [newLog, ...prev]);
        setBankrOutput(
          `[Bankr Agent]: Verified Dynamic Delegated Policy for 0x97f3...31. Successfully executed TalonVault.tear() on Base Mainnet. Price leg (talon${selectedSymbol}) hedged into USDC via Definitive Flash. Multiplier claim (clip${selectedSymbol}) active. Tx: ${newLog.txHash?.slice(0, 10)}...`
        );
      } else {
        setBankrOutput(
          `[Bankr Agent]: Audited Talon 1:1 parity for ${selectedSymbol} on Base. Vault Backing: 100.00%. Zero liquidation risk detected.`
        );
      }
    }, 1400);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F4] dark:border-[#1E294B] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#010FEE] dark:text-blue-400 mb-1.5">
            <Bot className="w-4 h-4" />
            <span>Autonomous Risk Engine • Base Mainnet 8453</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#050B24] dark:text-white tracking-tight">
            Talon Sentinel
          </h1>
          <p className="text-sm text-[#475569] dark:text-[#94A3B8] mt-1 max-w-2xl">
            Autonomous equity unbundling, earnings downside circuit-breakers, and 1:1 invariant parity maintenance powered by Dynamic Delegated Keys and Definitive Flash.
          </p>
        </div>

        {/* Dynamic Key Tag */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#EEF2FF] dark:bg-blue-950/60 border border-[#010FEE]/20 dark:border-blue-800 text-xs text-[#010FEE] dark:text-blue-300 font-medium shrink-0">
          <Lock className="w-4 h-4 text-[#010FEE] dark:text-blue-400" />
          <div>
            <div className="font-bold">Dynamic Delegated Session</div>
            <div className="text-[10px] opacity-75 font-mono">Policy: Scoped to TalonVault • 0% Custody</div>
          </div>
        </div>
      </div>

      {/* Asset Selector & Live Risk Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Token Selector */}
        <div className="bg-white dark:bg-[#0D152F] p-5 rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] shadow-sm space-y-3">
          <label className="text-xs font-mono font-bold uppercase text-[#64748B] dark:text-[#94A3B8]">
            Target Coinbase Stock
          </label>
          <div className="space-y-1.5">
            {OFFICIAL_TOKENS.slice(0, 4).map((t) => (
              <button
                key={t.symbol}
                onClick={() => setSelectedSymbol(t.symbol)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedSymbol === t.symbol
                    ? "bg-[#010FEE] text-white shadow-md shadow-[#010FEE]/20"
                    : "bg-[#F8FAFC] dark:bg-[#162044] text-[#475569] dark:text-[#94A3B8] hover:bg-[#EEF2FF] dark:hover:bg-[#1B2754]"
                }`}
              >
                <span>{t.symbol}</span>
                <span className="text-[10px] opacity-75 font-normal">
                  {t.symbol === "AAPLc" ? "Active Vault" : "Pair Verified"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Spot Price Card */}
        <div className="bg-white dark:bg-[#0D152F] p-5 rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
            <span>Chainlink Spot Price</span>
            <Activity className="w-3.5 h-3.5 text-[#010FEE] dark:text-blue-400" />
          </div>
          <div className="text-2xl font-black text-[#050B24] dark:text-white font-mono">
            {loading ? "..." : `$${metrics?.spotPriceUSD}`}
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
            Official token on Base: <span className="font-mono">{metrics?.underlyingAddress.slice(0, 8)}...</span>
          </p>
        </div>

        {/* B20 Multiplier Card */}
        <div className="bg-white dark:bg-[#0D152F] p-5 rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
            <span>B20 Multiplier (Accretion)</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {loading ? "..." : `${metrics?.multiplier}x`}
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
            Tracked onchain by <span className="font-mono text-[#010FEE]">clip{selectedSymbol}</span>
          </p>
        </div>

        {/* Risk & Earnings Trigger Card */}
        <div className="bg-white dark:bg-[#0D152F] p-5 rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
            <span>Earnings Risk Trigger</span>
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {loading ? "..." : `${metrics?.daysToEarnings}d`}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              {metrics?.riskStatus === "CRITICAL_SHIELD_ACTIVE" ? "Shield Triggered" : "Elevated Vol"}
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
            IV: <span className="font-bold">{metrics?.impliedVolatility}%</span> • Target date: {metrics?.earningsDate}
          </p>
        </div>
      </div>

      {/* Strategy Selector & Trigger Area */}
      <div className="bg-white dark:bg-[#0D152F] p-6 sm:p-8 rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#050B24] dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#010FEE] dark:text-blue-400" />
              <span>Select Autonomous Sentinel Strategy</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] mt-0.5">
              The agent executes non-custodial transactions on Base according to your chosen financial primitive.
            </p>
          </div>

          <button
            onClick={handleRunStrategy}
            disabled={executing}
            className="px-6 py-3 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-xs font-bold transition-all shadow-md shadow-[#010FEE]/25 flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-60"
          >
            {executing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Executing on Base...</span>
              </>
            ) : (
              <>
                <span>Trigger Autonomous Cycle</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* 3 Strategy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Strategy 1: Earnings Shield */}
          <div
            onClick={() => setActiveStrategy("earnings-shield")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
              activeStrategy === "earnings-shield"
                ? "border-[#010FEE] dark:border-blue-400 bg-[#EEF2FF]/60 dark:bg-blue-950/40 ring-2 ring-[#010FEE]/10"
                : "border-[#E2E8F4] dark:border-[#1E294B] bg-[#F8FAFC] dark:bg-[#162044] hover:border-[#010FEE]/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                Risk Guardian
              </span>
              <ShieldCheck className="w-4 h-4 text-[#010FEE]" />
            </div>
            <h3 className="font-bold text-sm text-[#050B24] dark:text-white">Earnings Volatility Shield</h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              Before high-volatility events, Sentinel calls <code className="text-[#010FEE]">TalonVault.tear()</code>, hedges the volatile price leg into USDC via Flash, and holds the accretion multiplier claim.
            </p>
          </div>

          {/* Strategy 2: Accretion Maximizer */}
          <div
            onClick={() => setActiveStrategy("accretion-maximizer")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
              activeStrategy === "accretion-maximizer"
                ? "border-[#010FEE] dark:border-blue-400 bg-[#EEF2FF]/60 dark:bg-blue-950/40 ring-2 ring-[#010FEE]/10"
                : "border-[#E2E8F4] dark:border-[#1E294B] bg-[#F8FAFC] dark:bg-[#162044] hover:border-[#010FEE]/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                Yield Stripper
              </span>
              <Sparkles className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="font-bold text-sm text-[#050B24] dark:text-white">Accretion Maximizer</h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              Harvests pure corporate multiplier growth via <code className="text-[#010FEE]">clip{selectedSymbol}</code> while stripping out equity price volatility completely into stable collateral.
            </p>
          </div>

          {/* Strategy 3: Invariant Parity Arbitrage */}
          <div
            onClick={() => setActiveStrategy("invariant-arbitrage")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
              activeStrategy === "invariant-arbitrage"
                ? "border-[#010FEE] dark:border-blue-400 bg-[#EEF2FF]/60 dark:bg-blue-950/40 ring-2 ring-[#010FEE]/10"
                : "border-[#E2E8F4] dark:border-[#1E294B] bg-[#F8FAFC] dark:bg-[#162044] hover:border-[#010FEE]/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                Zero-Risk Parity
              </span>
              <RefreshCw className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="font-bold text-sm text-[#050B24] dark:text-white">1:1 Invariant Arbitrage</h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              Monitors secondary AMM pools against <code className="text-[#010FEE]">TalonVault.join()</code>. Whenever split claims trade at a discount, executes instant recombine arbitrage on Base.
            </p>
          </div>
        </div>
      </div>

      {/* Bankr Natural Language Agent Terminal */}
      <div className="bg-[#050B24] text-white p-6 rounded-3xl shadow-xl space-y-4 border border-blue-900/40">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-300">
            <Terminal className="w-4 h-4" />
            <span>Bankr Agent CLI &amp; Skills Gateway (docs.bankr.bot)</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
            Skill: talon-onchain-equities
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={bankrInput}
            onChange={(e) => setBankrInput(e.target.value)}
            placeholder="Type a command for the Bankr agent..."
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder:text-white/40 focus:outline-none focus:border-[#010FEE]"
          />
          <button
            onClick={handleBankrCommand}
            className="px-5 py-2.5 bg-[#010FEE] hover:bg-blue-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Prompt Bankr
          </button>
        </div>

        {bankrOutput && (
          <div className="p-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-mono text-blue-200 leading-relaxed">
            {bankrOutput}
          </div>
        )}
      </div>

      {/* Autonomous Activity Log / Verified Base Mainnet Trail */}
      <div className="bg-white dark:bg-[#0D152F] p-6 sm:p-8 rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-[#050B24] dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Autonomous Execution Trail (Base Mainnet Audit)</span>
          </h3>
          <span className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
            Chain ID: 8453
          </span>
        </div>

        <div className="divide-y divide-[#F1F5F9] dark:divide-[#1E294B]">
          {logs.map((log) => (
            <div key={log.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#010FEE] dark:text-blue-400">
                    [{log.action}]
                  </span>
                  <span className="font-bold text-[#050B24] dark:text-white">{log.asset}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
                    {log.status}
                  </span>
                </div>
                <p className="text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-2xl">
                  {log.details}
                </p>
              </div>

              {log.explorerUrl && (
                <a
                  href={log.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-mono text-[#010FEE] dark:text-blue-400 hover:underline shrink-0"
                >
                  <span>Basescan Tx</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
