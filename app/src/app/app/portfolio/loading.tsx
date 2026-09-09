import React from "react";
import { Loader2 } from "lucide-react";
import { TalonLogo } from "../../../components/TalonLogo";

export default function PortfolioLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      <div className="flex items-center gap-3 pb-6 border-b border-[#E2E8F4]">
        <TalonLogo className="w-8 h-8 animate-pulse" size={32} rounded="xl" />
        <div>
          <h1 className="text-2xl font-black text-[#050B24] tracking-tight">Portfolio</h1>
          <div className="text-xs text-[#64748B] flex items-center gap-2 mt-1">
            <Loader2 className="w-3.5 h-3.5 text-[#010FEE] animate-spin" />
            <span>Reading onchain balances...</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F4] space-y-3">
            <div className="h-4 w-28 bg-[#E2E8F4] rounded-full"></div>
            <div className="h-8 w-32 bg-[#CBD5E1] rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
