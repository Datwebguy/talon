"use client";

import { useB20Data } from "../hooks/useB20Data";
import { useVault } from "../hooks/useVault";
import { OFFICIAL_TOKENS } from "../config/contracts";
import { Activity, TrendingUp, Layers, CheckCircle2 } from "lucide-react";

export function LiveStats() {
  const aapl = OFFICIAL_TOKENS[0];
  const { formattedMultiplier, formattedPrice, isLoading } = useB20Data(aapl.address);
  const { isVaultDeployed } = useVault(aapl.address, aapl.decimals);

  const stats = [
    {
      label: "Live Multiplier",
      value: isLoading ? "—" : formattedMultiplier,
      sub: "B20 accretion factor",
      icon: TrendingUp,
      accent: "text-[#010FEE]",
    },
    {
      label: "Chainlink Mark",
      value: isLoading ? "—" : formattedPrice,
      sub: "AAPL / USD price feed",
      icon: Activity,
      accent: "text-[#2563EB]",
    },
    {
      label: "Vault Status",
      value: isVaultDeployed ? "Active" : "—",
      sub: isVaultDeployed ? "Mined on Base" : "Pending deployment",
      icon: Layers,
      accent: isVaultDeployed ? "text-[#010FEE]" : "text-[#94A3B8]",
    },
    {
      label: "Reserve Backing",
      value: isVaultDeployed ? "1:1 Raw" : "—",
      sub: "100% Invariant Parity",
      icon: CheckCircle2,
      accent: "text-[#010FEE]",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F4] hover:border-[#010FEE]/40 transition-colors flex flex-col justify-between shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#64748B] font-bold uppercase tracking-wider">
                {item.label}
              </span>
              <Icon className={`w-4 h-4 ${item.accent}`} />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-[#050B24] tracking-tight">
                {item.value}
              </div>
              <div className="text-xs text-[#94A3B8] mt-1 font-medium">
                {item.sub}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
