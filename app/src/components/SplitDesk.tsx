"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useWalletModal } from "../context/WalletModalContext";
import { useVault } from "../hooks/useVault";
import { useB20Data } from "../hooks/useB20Data";
import { useLiveMarket } from "../hooks/useLiveMarket";
import { OFFICIAL_TOKENS } from "../config/contracts";
import {
  Layers,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  Lock,
  Gift,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { GiftExposureModal } from "./GiftExposureModal";
import { EligibilityAttestationModal } from "./EligibilityAttestationModal";
import { hasEligibilityAttestation } from "../lib/eligibility";

interface SplitDeskProps {
  initialStrategy?: "accretion" | "principal" | "both";
}

export function SplitDesk({ initialStrategy = "both" }: SplitDeskProps) {
  const { isConnected, chainId } = useAccount();
  const { openSelectModal } = useWalletModal();
  const aapl = OFFICIAL_TOKENS[0];

  const {
    balanceVal,
    priceVal,
  } = useB20Data(aapl.address);

  const {
    clipBalance,
    talonBalance,
    tear,
    join,
    isTearing,
    isJoining,
    tearSuccess,
    joinSuccess,
    txHash,
    error: vaultError,
  } = useVault(aapl.address, aapl.decimals);

  const { marketData } = useLiveMarket();
  const quote = marketData?.AAPL;
  const currentPrice = quote?.price ?? priceVal;

  const [activeTab, setActiveTab] = useState<"tear" | "join">("tear");
  const [selectedStrategy, setSelectedStrategy] = useState<"accretion" | "principal" | "both">(
    initialStrategy
  );
  const [amount, setAmount] = useState("");
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isAttestationOpen, setIsAttestationOpen] = useState(false);

  const parsedAmount = parseFloat(amount) || 0;
  const isTransacting = isTearing || isJoining;
  const wrongChain = isConnected && chainId !== 8453;

  // Max calculations
  const maxTear = balanceVal;
  const maxJoin = Math.min(clipBalance, talonBalance);

  const executeAction = async () => {
    if (!isConnected) {
      openSelectModal();
      return;
    }
    if (parsedAmount <= 0) return;

    if (activeTab === "tear") {
      await tear(amount);
    } else {
      await join(amount);
    }
  };

  const handleAction = async () => {
    if (!hasEligibilityAttestation()) {
      setIsAttestationOpen(true);
      return;
    }
    await executeAction();
  };

  const activeTxHash = txHash;
  const isSuccess = activeTab === "tear" ? tearSuccess : joinSuccess;

  return (
    <div className="rounded-[28px] border border-[#E2E8F4] dark:border-[#1E294B] bg-white dark:bg-[#0D152F] p-5 sm:p-8 shadow-xs space-y-7 transition-colors">
      {/* Top Cockpit Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9] dark:border-[#1E294B]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
              Base mainnet
            </span>
            <span className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#050B24] dark:text-white tracking-tight mt-1">
            Split AAPLc
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] mt-0.5">
            One stock in. Two claim tokens out.
          </p>
        </div>

        {/* Tab Switcher: Tear (Split) vs Join (Recombine) vs Gift */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#1E294B] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("tear")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === "tear"
                ? "bg-[#010FEE] text-white shadow-xs"
                : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#050B24] dark:hover:text-white"
            }`}
          >
            Split
          </button>
          <button
            onClick={() => setActiveTab("join")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === "join"
                ? "bg-[#010FEE] text-white shadow-xs"
                : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#050B24] dark:hover:text-white"
            }`}
          >
            Recombine
          </button>
          <button
            onClick={() => setIsGiftModalOpen(true)}
            className="px-3 py-2 rounded-full text-xs font-bold text-[#64748B] dark:text-[#94A3B8] hover:text-[#010FEE] dark:hover:text-blue-400 hover:bg-[#EEF2FF] dark:hover:bg-[#1E2B5C] transition-all flex items-center gap-1 cursor-pointer"
            title="Gift Clip or Talon"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Gift</span>
          </button>
        </div>
      </div>

      {/* Exposure Strategy Selector (Only active in Tear mode) */}
      {activeTab === "tear" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
              Choose what to keep
            </span>
            <span className="text-[11px] font-mono text-[#010FEE] dark:text-blue-400">
                1 AAPLc → 1 Clip + 1 Talon
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Strategy 1: Keep Accretion */}
            <button
              type="button"
              onClick={() => setSelectedStrategy("accretion")}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedStrategy === "accretion"
                  ? "border-[#010FEE] bg-[#EEF2FF] dark:bg-blue-950/60 shadow-xs ring-1 ring-[#010FEE]"
                  : "border-[#E2E8F4] dark:border-[#1E294B] bg-[#F8FAFC] dark:bg-[#162044] hover:bg-white dark:hover:bg-[#1C2854]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-[#010FEE] dark:text-blue-400">
                  KEEP CLIP
                </span>
                <TrendingUp className="w-4 h-4 text-[#010FEE] dark:text-blue-400" />
              </div>
              <div className="text-xs font-bold text-[#050B24] dark:text-white mt-2">
                Multiplier exposure
              </div>
              <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1 leading-snug">
                Keep the multiplier leg.
              </div>
            </button>

            {/* Strategy 2: Trade Principal */}
            <button
              type="button"
              onClick={() => setSelectedStrategy("principal")}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedStrategy === "principal"
                  ? "border-[#010FEE] bg-[#EEF2FF] dark:bg-blue-950/60 shadow-xs ring-1 ring-[#010FEE]"
                  : "border-[#E2E8F4] dark:border-[#1E294B] bg-[#F8FAFC] dark:bg-[#162044] hover:bg-white dark:hover:bg-[#1C2854]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-[#050B24] dark:text-white">
                  KEEP TALON
                </span>
                <Lock className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8]" />
              </div>
              <div className="text-xs font-bold text-[#050B24] dark:text-white mt-2">
                Price exposure
              </div>
              <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1 leading-snug">
                Keep the price leg.
              </div>
            </button>

            {/* Strategy 3: Split Both */}
            <button
              type="button"
              onClick={() => setSelectedStrategy("both")}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedStrategy === "both"
                  ? "border-[#010FEE] bg-[#EEF2FF] dark:bg-blue-950/60 shadow-xs ring-1 ring-[#010FEE]"
                  : "border-[#E2E8F4] dark:border-[#1E294B] bg-[#F8FAFC] dark:bg-[#162044] hover:bg-white dark:hover:bg-[#1C2854]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-[#010FEE] dark:text-blue-400">
                  KEEP BOTH
                </span>
                <Layers className="w-4 h-4 text-[#010FEE] dark:text-blue-400" />
              </div>
              <div className="text-xs font-bold text-[#050B24] dark:text-white mt-2">
                Both exposures
              </div>
              <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1 leading-snug">
                Receive both claims.
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#1E294B] space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono font-bold text-[#64748B] dark:text-[#94A3B8] uppercase">
            {activeTab === "tear" ? "You deposit" : "You return"}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[#64748B] dark:text-[#94A3B8]">Available:</span>
            <span className="font-mono font-bold text-[#050B24] dark:text-white">
              {activeTab === "tear"
                ? `${balanceVal.toFixed(4)} AAPLc`
                : `${maxJoin.toFixed(4)} Pairs`}
            </span>
            <button
              type="button"
              onClick={() =>
                setAmount(activeTab === "tear" ? maxTear.toString() : maxJoin.toString())
              }
              className="text-[11px] font-bold text-[#010FEE] dark:text-blue-400 hover:underline ml-1 cursor-pointer"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Input Field */}
        <div className="relative">
          <input
            type="number"
            step="0.0001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full pl-4 pr-28 py-3.5 rounded-2xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#2A3B6B] text-lg sm:text-xl font-mono font-black text-[#050B24] dark:text-white placeholder-[#94A3B8] outline-none focus:border-[#010FEE] dark:focus:border-blue-500"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8]">
            {activeTab === "tear" ? "AAPLc" : "Clip + Talon"}
          </span>
        </div>

        {/* Output Estimation Summary */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#2A3B6B] text-xs font-mono space-y-2">
          {activeTab === "tear" ? (
            <>
              <div className="flex justify-between text-[#64748B] dark:text-[#94A3B8]">
                <span>You receive:</span>
                <span className="font-bold text-[#010FEE] dark:text-blue-400">
                  +{parsedAmount > 0 ? parsedAmount.toFixed(4) : "0.0000"} clipAAPLc
                </span>
              </div>
              <div className="flex justify-between text-[#64748B] dark:text-[#94A3B8]">
                <span>And:</span>
                <span className="font-bold text-[#050B24] dark:text-white">
                  +{parsedAmount > 0 ? parsedAmount.toFixed(4) : "0.0000"} talonAAPLc
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-between text-[#64748B] dark:text-[#94A3B8]">
              <span>You receive:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                +{parsedAmount > 0 ? parsedAmount.toFixed(4) : "0.0000"} AAPLc (1:1)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Transaction & Feedback State */}
      {vaultError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{vaultError}</span>
        </div>
      )}

      {isSuccess && activeTxHash && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              {activeTab === "tear"
                ? "Tear confirmed! clipAAPLc + talonAAPLc minted to your wallet."
                : "Join confirmed! AAPLc unlocked 1:1."}
            </span>
          </div>
          <a
            href={`https://basescan.org/tx/${activeTxHash}`}
            target="_blank"
            rel="noreferrer"
            className="font-bold underline inline-flex items-center gap-1 text-emerald-900 dark:text-emerald-200 shrink-0"
          >
            <span>BaseScan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Primary Action Button */}
      {!isConnected ? (
        <button
          onClick={() => openSelectModal()}
          className="w-full py-4 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-sm font-bold transition-all shadow-[0_4px_20px_rgba(1,15,238,0.25)] cursor-pointer"
        >
          Connect Wallet to Execute
        </button>
      ) : (
        <button
          onClick={handleAction}
          disabled={isTransacting || parsedAmount <= 0 || wrongChain}
          className="w-full py-4 rounded-full bg-[#010FEE] hover:bg-[#000ED6] disabled:bg-[#F1F5F9] dark:disabled:bg-[#162044] disabled:text-[#94A3B8] dark:disabled:text-[#64748B] text-white text-sm font-bold transition-all shadow-[0_4px_20px_rgba(1,15,238,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isTransacting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Confirming on Base Mainnet…</span>
            </>
          ) : wrongChain ? (
            <span>Switch wallet to Base Mainnet</span>
          ) : activeTab === "tear" ? (
            <>
              <span>Execute Split (Tear AAPLc)</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Recombine 1:1 (Join into AAPLc)</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      )}

      {/* Gifting Modal Trigger Component */}
      <GiftExposureModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        clipBalance={clipBalance}
        talonBalance={talonBalance}
      />
      <EligibilityAttestationModal
        isOpen={isAttestationOpen}
        onClose={() => setIsAttestationOpen(false)}
        onConfirmed={() => {
          setIsAttestationOpen(false);
          void executeAction();
        }}
      />
    </div>
  );
}
