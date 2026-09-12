"use client";

import { ArrowDown, ArrowRight, Gift, RefreshCw, Sparkles } from "lucide-react";

const steps = [
  { label: "AAPLc", detail: "official token", tone: "source" },
  { label: "Clip", detail: "multiplier leg", tone: "clip" },
  { label: "Talon", detail: "price leg", tone: "talon" },
  { label: "Use", detail: "gift or recombine", tone: "use" },
] as const;

export function LaunchRail() {
  return (
    <section
      aria-label="Talon transaction flow"
      className="launch-rail relative mx-auto mt-12 w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/15 bg-[#071340] px-4 py-5 text-left shadow-[0_24px_80px_rgba(5,11,36,.18)] sm:mt-16 sm:px-7 sm:py-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(0,190,255,.22),transparent_28%),radial-gradient(circle_at_85%_80%,rgba(89,70,255,.22),transparent_32%)]" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            One clear move
          </div>
          <h2 className="mt-1 text-lg font-black tracking-tight text-white sm:text-xl">
            One stock. Two ways to use it.
          </h2>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-blue-100">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,.9)]" />
          Base mainnet · 1:1 backing
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:items-center sm:gap-2">
        {steps.map((step, index) => (
          <div key={step.label} className="contents">
            <div className={`launch-step launch-step-${step.tone}`}>
              <div className="flex items-center gap-3">
                <span className="launch-step-mark">
                  {step.tone === "source" ? "01" : step.tone === "clip" ? "02" : step.tone === "talon" ? "03" : "04"}
                </span>
                <span>
                  <span className="block text-sm font-black text-white">{step.label}</span>
                  <span className="block text-[10px] font-medium text-blue-100/65">{step.detail}</span>
                </span>
              </div>
              {step.tone === "use" && (
                <div className="ml-auto flex items-center gap-1 text-cyan-200" aria-hidden="true">
                  <Gift className="h-3.5 w-3.5" />
                  <RefreshCw className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className="launch-rail-arrow" aria-hidden="true">
                <span className="launch-rail-packet" />
                <ArrowRight className="hidden h-4 w-4 sm:block" />
                <ArrowDown className="h-4 w-4 sm:hidden" />
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="relative mt-4 border-t border-white/10 pt-4 text-[11px] leading-5 text-blue-100/65">
        The visual explains the product in seconds: deposit official AAPLc, receive Clip and Talon, then keep, gift, or recombine the claims.
      </p>
    </section>
  );
}
