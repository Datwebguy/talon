"use client";

import React from "react";
import { useLiveMarket } from "../hooks/useLiveMarket";
import {
  AppleLogo,
  NvidiaLogo,
  GoogleLogo,
  MetaLogo,
} from "./CompanyLogos";
import { TalonLogo } from "./TalonLogo";

export function AppTopBar() {
  const { marketData } = useLiveMarket();

  const tickers = [
    {
      symbol: "AAPLc",
      key: "AAPL",
      Logo: AppleLogo,
    },
    {
      symbol: "NVDAc",
      key: "NVDA",
      Logo: NvidiaLogo,
    },
    {
      symbol: "GOOGLc",
      key: "GOOGL",
      Logo: GoogleLogo,
    },
    {
      symbol: "METAc",
      key: "META",
      Logo: MetaLogo,
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[#E2E8F4] bg-white px-4 sm:px-6">
      {/* Left: Status Badges */}
      <div className="flex items-center gap-3 shrink-0 mr-4">
        <TalonLogo className="w-6 h-6" size={24} rounded="md" />
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold tracking-wider text-[#050B24] uppercase">
            Base market data
          </span>
        </div>

        <span className="rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[10px] font-black text-[#010FEE] border border-[#010FEE]/20 font-mono">
          Base
        </span>
      </div>

      {/* Center: Running Marquee with Real Logos and Live Market Data */}
      <div className="relative flex-1 overflow-hidden mask-fade-edges">
        <div className="flex w-max items-center gap-6 animate-marquee hover:[animation-play-state:paused]">
          {[...tickers, ...tickers].map((item, idx) => {
            const live = marketData?.[item.key];
            const price = live?.formattedPrice || "—";
            const change = live?.formattedChange;
            const isUp = change?.startsWith("+") ?? true;
            const Logo = item.Logo;

            return (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs font-mono shrink-0 py-1"
              >
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  <Logo className="w-4 h-4" />
                </div>
                <span className="font-bold text-[#050B24]">{item.symbol}</span>
                <span className="text-[#475569]">{price}</span>
                {change && <span
                  className={`text-[10px] font-bold ${
                    isUp ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {change}
                </span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Chainlink Feeds Live indicator */}
      <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#64748B] shrink-0 ml-4 font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-[#010FEE]"></span>
        <span className="text-[11px] text-[#64748B]">Chainlink Feeds</span>
        <span className="rounded bg-emerald-50 text-emerald-700 px-1.5 py-0.2 text-[10px] font-bold border border-emerald-200">
          Live
        </span>
      </div>
    </header>
  );
}
