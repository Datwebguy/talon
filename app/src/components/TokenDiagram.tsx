"use client";

import { ArrowDown, ArrowRight, RefreshCw, ShieldCheck } from "lucide-react";

export function TokenDiagram() {
  return (
    <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#E2E8F4] shadow-sm">
      <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-6 flex items-center justify-between">
        <span>Protocol Architecture: Unbundling & Recombination</span>
        <span className="text-[#010FEE] flex items-center gap-1 font-bold">
          <ShieldCheck className="w-4 h-4" /> 100% Backed Invariant
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
        {/* Step 1: Underlying B20 */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F4] flex flex-col justify-center">
          <div className="text-xs text-[#64748B] mb-1 font-bold uppercase tracking-wider">Underlying Equity</div>
          <div className="text-xl font-black text-[#050B24] flex items-center gap-2">
            <span>1 AAPLc</span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#010FEE] border border-[#010FEE]/20 font-bold">
              8 Decimals
            </span>
          </div>
          <div className="text-xs text-[#475569] mt-2 leading-relaxed font-medium">
            Coinbase tokenized stock on Base. Its B20 multiplier can change; no fixed yield is promised.
          </div>
        </div>

        {/* Arrow / Vault Step */}
        <div className="md:col-span-1 flex flex-col items-center justify-center text-[#64748B]">
          <div className="px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#010FEE]/20 text-xs text-[#010FEE] font-bold mb-1">
            Deposit
          </div>
          <ArrowRight className="hidden md:block w-5 h-5 text-[#010FEE]" />
          <ArrowDown className="md:hidden w-5 h-5 text-[#010FEE] my-1" />
        </div>

        {/* Step 2: Two Claims */}
        <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Claim 1: Clip */}
          <div className="p-5 rounded-2xl bg-[#EEF2FF] border border-[#010FEE]/20 flex flex-col justify-between">
            <div>
              <div className="text-xs text-[#010FEE] uppercase font-black tracking-wider mb-1 flex items-center justify-between">
                <span>Accretion Leg</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white text-[#010FEE] border border-[#010FEE]/20 font-bold">clip</span>
              </div>
              <div className="text-lg font-black text-[#050B24]">
                1 clipAAPLc
              </div>
              <div className="text-xs text-[#475569] mt-2 leading-relaxed font-medium">
                Tracks multiplier exposure from the split. It is not a guaranteed dividend or yield token.
              </div>
            </div>
            <div className="mt-3 text-xs text-[#010FEE] font-mono font-bold">
              Accretion claim
            </div>
          </div>

          {/* Claim 2: Talon */}
          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F4] flex flex-col justify-between">
            <div>
              <div className="text-xs text-[#2563EB] uppercase font-black tracking-wider mb-1 flex items-center justify-between">
                <span>Principal Leg</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white text-[#2563EB] border border-[#E2E8F4] font-bold">talon</span>
              </div>
              <div className="text-lg font-black text-[#050B24]">
                1 talonAAPLc
              </div>
              <div className="text-xs text-[#475569] mt-2 leading-relaxed font-medium">
                1:1 raw-token claim for the price leg. It follows the underlying exposure and can change in value.
              </div>
            </div>
            <div className="mt-3 text-xs text-[#2563EB] font-mono font-bold">
              1:1 Principal claim
            </div>
          </div>
        </div>
      </div>

      {/* Recombination footer */}
      <div className="mt-6 pt-5 border-t border-[#E2E8F4] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-2">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-[#010FEE]" />
          <span>
            Recombination: <strong className="text-[#050B24]">1 clip + 1 talon</strong> = <strong className="text-[#010FEE]">1 raw stock</strong>
          </span>
        </div>
        <div className="text-xs text-[#94A3B8] font-medium">
          Strict 100% reserve backing invariant enforced onchain.
        </div>
      </div>
    </div>
  );
}
