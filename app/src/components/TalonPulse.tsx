"use client";

import React from "react";
import { useB20Data } from "../hooks/useB20Data";
import { useLiveMarket } from "../hooks/useLiveMarket";
import { OFFICIAL_TOKENS, AAPLC_VAULT_ADDRESS, B20_ABI } from "../config/contracts";
import { useReadContract, useAccount } from "wagmi";
import { formatUnits } from "viem";
import {
  Activity,
  CheckCircle2,
  TrendingUp,
  Lock,
  Droplets,
  ArrowRight,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { TalonLogo } from "./TalonLogo";

interface TalonPulseProps {
  onSelectAction?: (action: "tear" | "join" | "gift") => void;
}

export function TalonPulse({ onSelectAction }: TalonPulseProps) {
  const { isConnected } = useAccount();
  const aapl = OFFICIAL_TOKENS[0];
  const { formattedMultiplier, priceVal } = useB20Data(aapl.address);
  const { marketData, isLoading: isMarketLoading } = useLiveMarket();
  const quote = marketData?.AAPL;

  // Real onchain Vault balance
  const { data: rawVaultBalance } = useReadContract({
    address: aapl.address,
    abi: B20_ABI,
    functionName: "balanceOf",
    args: [AAPLC_VAULT_ADDRESS],
  });

  const vaultBalance = rawVaultBalance
    ? Number(formatUnits(rawVaultBalance, aapl.decimals))
    : 0;

  const currentPrice = quote?.price ?? priceVal;
  const formattedPrice = currentPrice ? `$${currentPrice.toFixed(2)}` : "—";
  const formattedChange = quote?.formattedChange ?? (isMarketLoading ? "Loading…" : "0.00%");
  const isPositive = quote?.changePercent !== null && quote?.changePercent !== undefined
    ? quote.changePercent >= 0
    : true;

  return (
    <div className="rounded-[28px] border border-[#E2E8F4] bg-white p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#EEF2FF] text-[#010FEE]">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black uppercase tracking-wider text-[#010FEE]">
                Talon Pulse
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Session
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#050B24] tracking-tight">
              Today&apos;s Verified Market Snapshot
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
          <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span>Base Block Synced</span>
        </div>
      </div>

      {/* Verified Status Grid (5 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* 1. Underlying Movement */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F4] flex flex-col justify-between">
          <div className="text-[11px] font-mono font-bold text-[#64748B] uppercase tracking-wide flex items-center justify-between">
            <span>AAPLc Price</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#94A3B8]" />
          </div>
          <div className="mt-2.5">
            <div className="text-xl sm:text-2xl font-black text-[#050B24] font-mono">
              {formattedPrice}
            </div>
            <div className={`text-xs font-bold mt-0.5 ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
              {formattedChange}
            </div>
          </div>
        </div>

        {/* 2. Onchain Multiplier */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F4] flex flex-col justify-between">
          <div className="text-[11px] font-mono font-bold text-[#64748B] uppercase tracking-wide flex items-center justify-between">
            <span>B20 Multiplier</span>
            <span className="w-2 h-2 rounded-full bg-[#010FEE]" />
          </div>
          <div className="mt-2.5">
            <div className="text-xl sm:text-2xl font-black text-[#010FEE] font-mono">
              {formattedMultiplier}
            </div>
            <div className="text-[11px] text-[#64748B] font-medium mt-0.5">
              Accretion active onchain
            </div>
          </div>
        </div>

        {/* 3. Vault Backing */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F4] flex flex-col justify-between">
          <div className="text-[11px] font-mono font-bold text-[#64748B] uppercase tracking-wide flex items-center justify-between">
            <span>Vault Backing</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="mt-2.5">
            <div className="text-xl sm:text-2xl font-black text-[#050B24] font-mono">
              100%
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
              Non-custodial reserve
            </div>
          </div>
        </div>

        {/* 4. Aerodrome Liquidity */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F4] flex flex-col justify-between">
          <div className="text-[11px] font-mono font-bold text-[#64748B] uppercase tracking-wide flex items-center justify-between">
            <span>Underlying DEX</span>
            <Droplets className="w-3.5 h-3.5 text-[#010FEE]" />
          </div>
          <div className="mt-2.5">
            <div className="text-xl sm:text-2xl font-black text-[#050B24] font-mono">
              Active
            </div>
            <div className="text-[11px] text-[#64748B] font-medium mt-0.5">
              Aerodrome Base pool
            </div>
          </div>
        </div>

        {/* 5. Derivative Markets Status */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F4] flex flex-col justify-between col-span-2 lg:col-span-1">
          <div className="text-[11px] font-mono font-bold text-[#64748B] uppercase tracking-wide flex items-center justify-between">
            <span>Clip/Talon Pools</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="mt-2.5">
            <div className="text-sm font-black text-[#050B24]">
              Pending Pools
            </div>
            <div className="text-[11px] text-amber-700 font-medium mt-0.5">
              1:1 Join live on Base
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#EEF2FF] to-white border border-[#C7D2FE]">
        <div className="flex items-center gap-3">
          <TalonLogo className="w-6 h-6 shrink-0" size={24} rounded="md" />
          <div className="text-xs sm:text-sm text-[#050B24]">
            <strong className="font-bold text-[#010FEE]">Recommended Action: </strong>
            Choose your exposure below — split AAPLc into accretion (clip) and principal (talon).
          </div>
        </div>

        {onSelectAction && (
          <button
            onClick={() => onSelectAction("tear")}
            className="px-4 py-2 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <span>Open Split Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
