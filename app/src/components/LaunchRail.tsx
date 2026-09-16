"use client";

import { useState } from "react";
import { ArrowRight, Gift, Layers3, RefreshCw, ShieldCheck, TrendingUp } from "lucide-react";

const nodes = [
  { id: "stock", label: "AAPLc", title: "Official stock token", detail: "Coinbase issued · Base 8453", icon: ShieldCheck, tone: "stock" },
  { id: "clip", label: "Clip", title: "Multiplier leg", detail: "Follow the B20 multiplier", icon: TrendingUp, tone: "clip" },
  { id: "talon", label: "Talon", title: "Price leg", detail: "Keep the price exposure", icon: Layers3, tone: "talon" },
  { id: "exit", label: "Use it", title: "Gift or recombine", detail: "Transfer a claim or restore AAPLc", icon: Gift, tone: "exit" },
] as const;

export function LaunchRail() {
  const [activeNode, setActiveNode] = useState("stock");
  const active = nodes.find((node) => node.id === activeNode) ?? nodes[0];
  const ActiveIcon = active.icon;

  return (
    <section aria-label="Talon exposure map" className="flow-board relative mx-auto mt-12 w-full max-w-5xl overflow-hidden rounded-[30px] border border-white/20 px-4 py-5 text-left shadow-[0_26px_90px_rgba(5,11,36,.24)] sm:mt-16 sm:px-7 sm:py-7">
      <div className="flow-board-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="flow-board-glow flow-board-glow-one pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full" aria-hidden="true" />
      <div className="flow-board-glow flow-board-glow-two pointer-events-none absolute -bottom-36 right-0 h-80 w-80 rounded-full" aria-hidden="true" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">
            <span className="flow-live-dot" aria-hidden="true" />
            Exposure map
          </div>
          <h2 className="mt-2 max-w-md text-xl font-black tracking-tight text-white sm:text-2xl">See the move before you make it.</h2>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-blue-100">
          <span className="font-mono text-cyan-200">8453</span>
          Base mainnet
        </div>
      </div>

      <div className="relative mt-6 grid gap-2 sm:grid-cols-[1.1fr_auto_1fr_auto_1fr] sm:items-center sm:gap-3">
        <button type="button" onClick={() => setActiveNode("stock")} className={`flow-node flow-node-stock ${activeNode === "stock" ? "is-active" : ""}`}>
          <span className="flow-node-icon"><ShieldCheck className="h-4 w-4" aria-hidden="true" /></span>
          <span><span className="block text-sm font-black text-white">AAPLc</span><span className="block text-[10px] text-blue-100/65">Official token</span></span>
          <span className="flow-node-badge">01</span>
        </button>

        <span className="flow-connector" aria-hidden="true"><span className="flow-connector-pulse" /></span>

        <div className="grid grid-cols-2 gap-2">
          {nodes.slice(1, 3).map((node) => {
            const Icon = node.icon;
            return (
              <button key={node.id} type="button" onClick={() => setActiveNode(node.id)} className={`flow-node flow-node-${node.tone} ${activeNode === node.id ? "is-active" : ""}`}>
                <span className="flow-node-icon"><Icon className="h-4 w-4" aria-hidden="true" /></span>
                <span><span className="block text-sm font-black text-white">{node.label}</span><span className="block text-[10px] text-blue-100/65">{node.title}</span></span>
                <span className="flow-node-badge">{node.id === "clip" ? "02" : "03"}</span>
              </button>
            );
          })}
        </div>

        <span className="flow-connector" aria-hidden="true"><span className="flow-connector-pulse flow-connector-pulse-delayed" /></span>

        <button type="button" onClick={() => setActiveNode("exit")} className={`flow-node flow-node-exit ${activeNode === "exit" ? "is-active" : ""}`}>
          <span className="flow-node-icon"><Gift className="h-4 w-4" aria-hidden="true" /></span>
          <span><span className="block text-sm font-black text-white">Use it</span><span className="block text-[10px] text-blue-100/65">Gift or restore</span></span>
          <span className="flow-node-badge">04</span>
        </button>
      </div>

      <div className="relative mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-cyan-200"><ActiveIcon className="h-4 w-4" aria-hidden="true" /></div>
        <div className="min-w-0"><p className="text-xs font-bold text-white">{active.title}</p><p className="truncate text-[11px] text-blue-100/65">{active.detail}</p></div>
        <div className="ml-auto hidden items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-200 sm:flex"><RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />One backed flow<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></div>
      </div>
    </section>
  );
}
