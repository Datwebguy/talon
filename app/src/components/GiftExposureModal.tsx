"use client";

import React, { useState } from "react";
import { useAccount, useWalletClient, usePublicClient, useReadContract } from "wagmi";
import { parseUnits, formatUnits, isAddress } from "viem";
import {
  X,
  Gift,
  CheckCircle2,
  ExternalLink,
  Loader2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Lock,
} from "lucide-react";
import {
  AAPLC_CLIP_ADDRESS,
  AAPLC_TALON_ADDRESS,
  B20_ABI,
  ELIGIBILITY_ENFORCED_DEPLOYMENT,
  ELIGIBILITY_REGISTRY_ADDRESS,
  ELIGIBILITY_REGISTRY_ABI,
} from "../config/contracts";
import { TalonLogo } from "./TalonLogo";
import { checkEligibility } from "../lib/eligibility";
import { hasEligibilityAttestation } from "../lib/eligibility";
import { EligibilityAttestationModal } from "./EligibilityAttestationModal";

interface GiftExposureModalProps {
  isOpen: boolean;
  onClose: () => void;
  clipBalance: number;
  talonBalance: number;
  onSuccess?: () => void;
}

export function GiftExposureModal({
  isOpen,
  onClose,
  clipBalance,
  talonBalance,
  onSuccess,
}: GiftExposureModalProps) {
  const { address: userAddress, isConnected, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { refetch: refetchEligibility } = useReadContract({
    address: ELIGIBILITY_REGISTRY_ADDRESS,
    abi: ELIGIBILITY_REGISTRY_ABI,
    functionName: "isEligible",
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress && chainId === 8453 },
  });

  const [selectedLeg, setSelectedLeg] = useState<"clip" | "talon">("clip");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAttestationOpen, setIsAttestationOpen] = useState(false);

  if (!isOpen) return null;

  const maxBalance = selectedLeg === "clip" ? clipBalance : talonBalance;
  const tokenAddress = selectedLeg === "clip" ? AAPLC_CLIP_ADDRESS : AAPLC_TALON_ADDRESS;
  const tokenSymbol = selectedLeg === "clip" ? "clipAAPLc" : "talonAAPLc";

  const handleSendGift = async () => {
    if (!walletClient || !publicClient || !userAddress) {
      setError("Please connect your wallet first");
      return;
    }

    const cleanRecipient = recipient.trim();
    if (!isAddress(cleanRecipient)) {
      setError("Please enter a valid Base address (0x...)");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0 || numAmount > maxBalance) {
      setError(`Please enter a valid amount up to ${maxBalance.toFixed(4)}`);
      return;
    }

    if (!hasEligibilityAttestation()) {
      setIsAttestationOpen(true);
      return;
    }

    setError(null);
    setIsSending(true);
    setTxHash(null);

    try {
      if (!ELIGIBILITY_ENFORCED_DEPLOYMENT) {
        throw new Error("Protocol upgrade pending: gifting is disabled until the eligibility-enforced deployment is live.");
      }
      if (chainId !== 8453) {
        throw new Error("Switch your wallet to Base Mainnet before gifting.");
      }
      await checkEligibility();
      const eligibility = await refetchEligibility();
      if (eligibility.data !== true) {
        throw new Error("This wallet is not registered for stock actions on Base. No transfer was requested.");
      }
      const rawAmount = parseUnits(amount, 8);
      const { request } = await publicClient.simulateContract({
        account: userAddress,
        address: tokenAddress,
        abi: B20_ABI,
        functionName: "transfer",
        args: [cleanRecipient, rawAmount],
      });
      const hash = await walletClient.writeContract(request);

      await publicClient.waitForTransactionReceipt({ hash });
      setTxHash(hash);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.shortMessage || err?.message || "Transfer failed");
    } finally {
      setIsSending(false);
    }
  };

  const resetAndClose = () => {
    setTxHash(null);
    setError(null);
    setAmount("");
    setRecipient("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={resetAndClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-[28px] bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] shadow-2xl p-6 sm:p-8 z-10 space-y-6 text-[#050B24] dark:text-[#F8FAFC] animate-scaleUp transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] dark:border-[#1E294B]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#010FEE] dark:text-blue-400">
                Programmable Equities
              </div>
              <h2 className="text-xl font-black tracking-tight text-[#050B24] dark:text-white">
                Gift Stock Exposure
              </h2>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="w-8 h-8 rounded-full bg-[#F8FAFC] dark:bg-[#162044] hover:bg-[#EEF2FF] dark:hover:bg-[#1E2B5C] text-[#64748B] dark:text-[#94A3B8] hover:text-[#010FEE] dark:hover:text-blue-400 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {txHash ? (
          /* Success Receipt Card */
          <div className="space-y-5 text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#050B24] dark:text-white">
                Gift Successfully Sent on Base!
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-1 max-w-sm mx-auto">
                You transferred <strong className="text-[#050B24] dark:text-white">{amount} {tokenSymbol}</strong> to{" "}
                <span className="font-mono text-[#010FEE] dark:text-blue-400">{recipient.slice(0, 6)}...{recipient.slice(-4)}</span>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] text-left text-xs font-mono space-y-2">
              <div className="flex justify-between text-[#64748B] dark:text-[#94A3B8]">
                <span>Gift Type:</span>
                <span className="font-bold text-[#050B24] dark:text-white">
                  {selectedLeg === "clip" ? "Multiplier exposure" : "Price exposure"}
                </span>
              </div>
              <div className="flex justify-between text-[#64748B] dark:text-[#94A3B8]">
                <span>Transaction:</span>
                <a
                  href={`https://basescan.org/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#010FEE] dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>View BaseScan</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <button
              onClick={resetAndClose}
              className="w-full py-3.5 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-sm font-bold transition-all shadow-md cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          /* Gift Input Form */
          <div className="space-y-5">
            {/* Value Proposition Explainer */}
            <div className="p-3.5 rounded-2xl bg-[#EEF2FF] dark:bg-blue-950/40 border border-[#C7D2FE] dark:border-blue-900/60 text-xs text-[#050B24] dark:text-blue-100 leading-relaxed">
              <strong className="text-[#010FEE] dark:text-blue-400 font-bold">Unbundled Value Transfer: </strong>
              On Base, you can split AAPLc and transfer the multiplier leg or price leg independently to another eligible wallet. This version sends an immediate transfer; it does not add a time-lock or reclaim rule.
            </div>

            {/* Select Leg: Clip vs Talon */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wide">
                1. Choose Exposure To Gift
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedLeg("clip")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedLeg === "clip"
                      ? "border-[#010FEE] bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 shadow-sm ring-1 ring-[#010FEE]"
                      : "border-[#E2E8F4] dark:border-[#1E294B] bg-[#F8FAFC] dark:bg-[#162044] text-[#64748B] dark:text-[#94A3B8] hover:bg-white dark:hover:bg-[#1E2B5C]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black">clipAAPLc</span>
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] font-medium mt-1">
                    Gift Multiplier Exposure
                  </div>
                  <div className="text-[10px] font-mono mt-1 text-[#475569] dark:text-[#94A3B8]">
                    Bal: {clipBalance.toFixed(4)}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedLeg("talon")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedLeg === "talon"
                      ? "border-[#010FEE] bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 shadow-sm ring-1 ring-[#010FEE]"
                      : "border-[#E2E8F4] dark:border-[#1E294B] bg-[#F8FAFC] dark:bg-[#162044] text-[#64748B] dark:text-[#94A3B8] hover:bg-white dark:hover:bg-[#1E2B5C]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black">talonAAPLc</span>
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] font-medium mt-1">
                    Gift Principal (Pure price upside)
                  </div>
                  <div className="text-[10px] font-mono mt-1 text-[#475569] dark:text-[#94A3B8]">
                    Bal: {talonBalance.toFixed(4)}
                  </div>
                </button>
              </div>
            </div>

            {/* Recipient Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wide">
                2. Recipient Base Address
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x... or vitalik.eth"
                className="w-full px-4 py-3 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#1E294B] text-xs sm:text-sm font-mono text-[#050B24] dark:text-white placeholder-[#94A3B8] dark:placeholder-[#64748B] outline-none focus:border-[#010FEE]"
              />
            </div>

            {/* Amount Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-mono font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wide">
                  3. Amount to Gift
                </label>
                <button
                  type="button"
                  onClick={() => setAmount(maxBalance.toString())}
                  className="font-mono text-[11px] font-bold text-[#010FEE] dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Max: {maxBalance.toFixed(4)}
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.0001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-4 pr-24 py-3 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#1E294B] text-sm font-mono font-bold text-[#050B24] dark:text-white placeholder-[#94A3B8] dark:placeholder-[#64748B] outline-none focus:border-[#010FEE]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#64748B] dark:text-[#94A3B8]">
                  {tokenSymbol}
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSendGift}
              disabled={isSending || maxBalance <= 0 || (isConnected && chainId !== 8453)}
              className="w-full py-4 rounded-full bg-[#010FEE] hover:bg-[#000ED6] disabled:bg-[#F1F5F9] dark:disabled:bg-[#162044] disabled:text-[#94A3B8] dark:disabled:text-[#64748B] text-white text-sm font-bold transition-all shadow-[0_4px_16px_rgba(1,15,238,0.25)] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Gift on Base…</span>
                </>
              ) : (
                <>
                  <span>Send Gift of {tokenSymbol}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
      <EligibilityAttestationModal
        isOpen={isAttestationOpen}
        onClose={() => setIsAttestationOpen(false)}
        onConfirmed={() => {
          setIsAttestationOpen(false);
          void handleSendGift();
        }}
      />
    </div>
  );
}
