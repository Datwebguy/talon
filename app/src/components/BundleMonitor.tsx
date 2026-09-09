"use client";

import React from "react";
import { useB20Data } from "../hooks/useB20Data";
import { useLiveMarket } from "../hooks/useLiveMarket";
import {
  OFFICIAL_TOKENS,
  AAPLC_VAULT_ADDRESS,
  AAPLC_CLIP_ADDRESS,
  AAPLC_TALON_ADDRESS,
} from "../config/contracts";
import {
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  Lock,
} from "lucide-react";
import { AppleLogo } from "./CompanyLogos";

export function BundleMonitor() {
  const aapl = OFFICIAL_TOKENS[0];
  const { formattedMultiplier, priceVal } = useB20Data(aapl.address);
  const { marketData } = useLiveMarket();
  const quote = marketData?.AAPL;

  const currentPrice = quote?.price ?? priceVal;
  const formattedPrice = currentPrice ? `$${currentPrice.toFixed(2)}` : "—";

  return (
    <div className="rounded-[28px] border border-[#E2E8F4] bg-white p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#050B24] text-white flex items-center justify-center font-black">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#010FEE]">
              Return Decomposition
            </span>
            <h3 className="text-lg font-black text-[#050B24] tracking-tight">
              AAPLc Bundle Monitor
            </h3>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#010FEE]/20 text-xs font-bold text-[#010FEE] font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>1:1 Recombination Guaranteed</span>
        </div>
      </div>

      {/* 3 Columns: Underlying Bundle -> Clip Leg + Talon Leg */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Underlying Bundle */}
        <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F4] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-[#050B24] text-white font-mono text-[10px] font-bold">
                UNDERLYING BUNDLE
              </span>
              <AppleLogo className="w-4 h-4 text-black" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-[#050B24] font-mono">
                {formattedPrice}
              </div>
              <div className="text-xs text-[#64748B] font-medium mt-1">
                Coinbase AAPLc Tokenized Stock
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-[#E2E8F4] text-xs font-mono">
            <div className="flex justify-between text-[#64748B]">
              <span>Type:</span>
              <span className="font-bold text-[#050B24]">Productive B20</span>
            </div>
            <div className="flex justify-between text-[#64748B]">
              <span>DEX Market:</span>
              <span className="font-bold text-emerald-600">Aerodrome Live</span>
            </div>
          </div>
        </div>

        {/* 2. Clip Leg (Multiplier Accretion) */}
        <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#C7D2FE] flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#010FEE]/5 rounded-bl-full pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-[#010FEE] text-white font-mono text-[10px] font-bold">
                ACCRETION LEG
              </span>
              <TrendingUp className="w-4 h-4 text-[#010FEE]" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-[#010FEE] font-mono">
                clipAAPLc
              </div>
              <div className="text-xs text-[#64748B] font-medium mt-1">
                Claims all corporate multiplier growth
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-[#E2E8F4] text-xs font-mono">
            <div className="flex justify-between text-[#64748B]">
              <span>Multiplier:</span>
              <span className="font-bold text-[#010FEE]">{formattedMultiplier}</span>
            </div>
            <div className="flex justify-between text-[#64748B]">
              <span>Secondary Market:</span>
              <span className="font-bold text-amber-600">Pending Pool</span>
            </div>
          </div>
        </div>

        {/* 3. Talon Leg (Price & Principal) */}
        <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F4] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-[#050B24] text-white font-mono text-[10px] font-bold">
                PRINCIPAL LEG
              </span>
              <Lock className="w-4 h-4 text-[#64748B]" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-[#050B24] font-mono">
                talonAAPLc
              </div>
              <div className="text-xs text-[#64748B] font-medium mt-1">
                Pure equity price exposure (no drag)
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-[#E2E8F4] text-xs font-mono">
            <div className="flex justify-between text-[#64748B]">
              <span>Underlying Claim:</span>
              <span className="font-bold text-[#050B24]">1:1 Raw Base</span>
            </div>
            <div className="flex justify-between text-[#64748B]">
              <span>Secondary Market:</span>
              <span className="font-bold text-amber-600">Pending Pool</span>
            </div>
          </div>
        </div>
      </div>

      {/* Honest Disclosure Banner */}
      <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F4] flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#010FEE] shrink-0 mt-0.5" />
        <div className="text-xs text-[#475569] leading-relaxed">
          <strong className="text-[#050B24] font-semibold">Honest Market Disclosure: </strong>
          The Talon vault smart contract is deployed and verified on Base Mainnet. While underlying AAPLc trades on Aerodrome, secondary DEX liquidity for clipAAPLc and talonAAPLc is currently pending community pool creation.
          <strong className="text-[#010FEE]"> 1:1 Join recombination is guaranteed onchain at any time: </strong>
          burn 1 clipAAPLc + 1 talonAAPLc to redeem 1 AAPLc directly from the vault.
        </div>
      </div>
    </div>
  );
}
