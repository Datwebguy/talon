import React from "react";
import { Loader2 } from "lucide-react";
import { TalonLogo } from "../../components/TalonLogo";

export default function AppLoading() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F4]">
        <div className="flex items-center gap-3">
          <TalonLogo className="w-8 h-8 animate-pulse" size={32} rounded="xl" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#050B24] tracking-tight">
                Markets & Vault Terminal
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#010FEE] text-[10px] font-bold border border-[#010FEE]/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#010FEE] animate-ping"></span>
                Base Mainnet
              </span>
            </div>
            <div className="text-xs text-[#64748B] flex items-center gap-2 mt-1">
              <Loader2 className="w-3.5 h-3.5 text-[#010FEE] animate-spin" />
              <span>Connecting to onchain telemetry...</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F4] space-y-3 animate-pulse"
          >
            <div className="h-3 w-28 bg-[#E2E8F4] rounded-full"></div>
            <div className="h-7 w-36 bg-[#CBD5E1] rounded-lg"></div>
            <div className="h-3 w-20 bg-[#E2E8F4] rounded-full"></div>
          </div>
        ))}
      </div>

      {/* Main Terminal Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Chart Skeleton */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-[#E2E8F4] space-y-4 animate-pulse">
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
            <div className="h-5 w-48 bg-[#E2E8F4] rounded-full"></div>
            <div className="h-6 w-24 bg-[#E2E8F4] rounded-full"></div>
          </div>
          <div className="h-[280px] bg-[#F8FAFC] rounded-2xl flex items-center justify-center text-[#94A3B8]">
            <div className="flex items-center gap-2 text-xs font-mono">
              <Loader2 className="w-4 h-4 animate-spin text-[#010FEE]" />
              <span>Loading AAPLc Orderbook & Yield Chart...</span>
            </div>
          </div>
        </div>

        {/* Right Split Desk Skeleton */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-[#E2E8F4] space-y-4 animate-pulse">
          <div className="h-5 w-36 bg-[#E2E8F4] rounded-full"></div>
          <div className="h-12 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F4]"></div>
          <div className="h-24 bg-[#EEF2FF] rounded-2xl border border-[#010FEE]/20"></div>
          <div className="h-12 bg-[#010FEE]/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
