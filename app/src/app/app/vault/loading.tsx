import React from "react";
import { Loader2 } from "lucide-react";
import { TalonLogo } from "../../../components/TalonLogo";

export default function VaultLoading() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      <div className="flex items-center gap-3 pb-6 border-b border-[#E2E8F4]">
        <TalonLogo className="w-8 h-8 animate-pulse" size={32} rounded="xl" />
        <div>
          <h1 className="text-2xl font-black text-[#050B24] tracking-tight">Talon Vault</h1>
          <div className="text-xs text-[#64748B] flex items-center gap-2 mt-1">
            <Loader2 className="w-3.5 h-3.5 text-[#010FEE] animate-spin" />
            <span>Loading smart contract escrow...</span>
          </div>
        </div>
      </div>
      <div className="p-8 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F4] space-y-4 animate-pulse">
        <div className="h-10 w-48 bg-[#E2E8F4] rounded-full mx-auto"></div>
        <div className="h-32 bg-white rounded-2xl border border-[#E2E8F4]"></div>
        <div className="h-14 bg-[#010FEE]/20 rounded-full"></div>
      </div>
    </div>
  );
}
