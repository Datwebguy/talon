import React from "react";
import { Loader2 } from "lucide-react";
import { TalonLogo } from "../../../components/TalonLogo";

export default function MarketsLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      <div className="flex items-center gap-3 pb-6 border-b border-[#E2E8F4]">
        <TalonLogo className="w-8 h-8 animate-pulse" size={32} rounded="xl" />
        <div>
          <h1 className="text-2xl font-black text-[#050B24] tracking-tight">Tokenized Stock Markets</h1>
          <div className="text-xs text-[#64748B] flex items-center gap-2 mt-1">
            <Loader2 className="w-3.5 h-3.5 text-[#010FEE] animate-spin" />
            <span>Loading live pricing and liquidity...</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-3xl bg-white border border-[#E2E8F4] space-y-4">
            <div className="h-10 w-36 bg-[#E2E8F4] rounded-lg"></div>
            <div className="h-8 w-24 bg-[#CBD5E1] rounded-lg"></div>
            <div className="h-10 bg-[#F8FAFC] rounded-xl border border-[#E2E8F4]"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
