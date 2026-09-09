"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import { useWalletModal } from "../../../context/WalletModalContext";
import { useVault } from "../../../hooks/useVault";
import { useB20Data } from "../../../hooks/useB20Data";
import { AAPLC_VAULT_ADDRESS, B20_ABI, OFFICIAL_TOKENS } from "../../../config/contracts";
import {
  Lock,
  Gift,
  Percent,
  DollarSign,
  ArrowDown,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  CheckCircle2,
  X,
} from "lucide-react";
import { AppleLogo } from "../../../components/CompanyLogos";
import { TalonLogo } from "../../../components/TalonLogo";
import { EligibilityAttestationModal } from "../../../components/EligibilityAttestationModal";
import { GiftExposureModal } from "../../../components/GiftExposureModal";
import { hasEligibilityAttestation } from "../../../lib/eligibility";

export default function VaultPage() {
  const { address, isConnected, chainId } = useAccount();
  const wrongChain = isConnected && chainId !== 8453;
  const { openSelectModal } = useWalletModal();

  const aapl = OFFICIAL_TOKENS[0];
  const {
    balanceVal,
    formattedBalance,
    formattedPrice,
    priceVal,
    formattedUsd,
    isLoading: isB20Loading,
  } = useB20Data(aapl.address);

  const {
    clipAddress,
    talonAddress,
    vaultAddress,
    clipBalance,
    talonBalance,
    tear,
    join,
    isTearing,
    isJoining,
    tearSuccess,
    joinSuccess,
    txHash,
    stepText,
    error: vaultError,
    clearError,
    onchainEligibility,
    isEligibilityLoading,
  } = useVault(aapl.address, aapl.decimals);

  const { data: rawVaultBalance } = useReadContract({
    address: aapl.address,
    abi: B20_ABI,
    functionName: "balanceOf",
    args: [AAPLC_VAULT_ADDRESS],
  });
  const vaultBalance = rawVaultBalance
    ? Number(rawVaultBalance) / 10 ** aapl.decimals
    : null;
  const vaultValue = vaultBalance !== null && priceVal !== null
    ? `$${(vaultBalance * priceVal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "—";

  const [tab, setTab] = useState<"deposit" | "withdraw">("deposit");
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [txSuccessMessage, setTxSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isAttestationOpen, setIsAttestationOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);

  useEffect(() => {
    if (tearSuccess) {
      setTxSuccessMessage("Successfully split stock into clip + talon tokens!");
      setDepositAmount("");
      setLocalError(null);
      const timer = setTimeout(() => setTxSuccessMessage(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [tearSuccess]);

  useEffect(() => {
    if (joinSuccess) {
      setTxSuccessMessage("Successfully recombined tokens and withdrew original stock!");
      setWithdrawAmount("");
      setLocalError(null);
      const timer = setTimeout(() => setTxSuccessMessage(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [joinSuccess]);

  // Derived calculations
  const parsedDeposit = parseFloat(depositAmount) || 0;
  const parsedWithdraw = parseFloat(withdrawAmount) || 0;

  // Max withdraw is minimum of clip and talon balances
  const clipVal = Number(clipBalance) || 0;
  const talonVal = Number(talonBalance) || 0;
  const maxRecombine = Math.min(clipVal, talonVal);

  const executeDeposit = async () => {
    if (!isConnected) {
      openSelectModal();
      return;
    }
    if (parsedDeposit > 0) {
      setLocalError(null);
      clearError();
      try {
        await tear(depositAmount);
      } catch (err: any) {
        setLocalError(err?.message || "Deposit transaction could not be completed.");
      }
    }
  };

  const handleDeposit = async () => {
    if (!hasEligibilityAttestation()) {
      setIsAttestationOpen(true);
      return;
    }
    await executeDeposit();
  };

  const executeWithdraw = async () => {
    if (!isConnected) {
      openSelectModal();
      return;
    }
    if (parsedWithdraw > 0) {
      setLocalError(null);
      clearError();
      try {
        await join(withdrawAmount);
      } catch (err: any) {
        setLocalError(err?.message || "Withdraw transaction could not be completed.");
      }
    }
  };

  const handleWithdraw = async () => {
    if (!hasEligibilityAttestation()) {
      setIsAttestationOpen(true);
      return;
    }
    await executeWithdraw();
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
          <TalonLogo className="w-8 h-8" size={32} rounded="xl" />
          <h1 className="text-3xl sm:text-4xl font-black text-[#050B24] dark:text-white tracking-tight">
            Split desk
          </h1>
          </div>
          <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] mt-1.5 font-medium">
            Split AAPLc. Keep both legs or recombine them later.
          </p>
          {isConnected && !wrongChain && !isEligibilityLoading && !onchainEligibility && (
            <div className="mt-3 max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium leading-relaxed text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200">
              <div className="font-bold">Eligibility pending · manual approval required</div>
              <div className="mt-1">This Base wallet is not yet registered for stock actions. The app will not request an approval or transaction. Once the dedicated eligibility operator approves the wallet in the registry, reconnect or refresh this page.</div>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsGiftModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C7D2FE] bg-[#EEF2FF] px-4 py-2.5 text-xs font-bold text-[#010FEE] transition hover:border-[#010FEE] hover:bg-white dark:border-[#2A3B6B] dark:bg-[#162044] dark:text-blue-300 dark:hover:bg-[#1E2B5C]"
        >
          <Gift className="h-4 w-4" />
          Gift exposure
        </button>
      </div>

      {/* Top 4 Metric Cards Matching Image 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* 1. Vault Balance */}
        <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
            <span>Vault Balance</span>
            <Lock className="w-4 h-4 text-[#94A3B8] dark:text-[#64748B]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-[#050B24] dark:text-white tracking-tight">
              {vaultValue}
            </div>
            <div className="text-xs text-[#94A3B8] dark:text-[#64748B] font-mono mt-0.5">
              {vaultBalance === null ? "Onchain balance unavailable" : `${vaultBalance.toFixed(4)} AAPLc locked`}
            </div>
          </div>
        </div>

        {/* 2. Claimable Rewards */}
        <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
            <span>Rewards status</span>
            <Gift className="w-4 h-4 text-[#94A3B8] dark:text-[#64748B]" />
          </div>
          <div className="mt-3 flex items-end justify-between gap-2">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#050B24] dark:text-white tracking-tight">
                —
              </div>
                <div className="text-xs text-[#94A3B8] dark:text-[#64748B] font-mono mt-0.5">Not live yet</div>
            </div>
            <button
              disabled
              className="px-3 py-1 text-xs font-bold rounded-lg bg-[#E2E8F4] dark:bg-[#162044] text-[#94A3B8] dark:text-[#64748B] cursor-not-allowed"
            >
              Coming later
            </button>
          </div>
        </div>

        {/* 3. Vault APY */}
        <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
            <span>Yield quote</span>
            <Percent className="w-4 h-4 text-[#94A3B8] dark:text-[#64748B]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-[#010FEE] dark:text-blue-400 tracking-tight">
              —
            </div>
            <div className="text-xs font-bold text-[#94A3B8] dark:text-[#64748B] mt-0.5">No yield promised</div>
          </div>
        </div>

        {/* 4. Reward / Share */}
        <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
            <span>Settlement</span>
            <DollarSign className="w-4 h-4 text-[#94A3B8] dark:text-[#64748B]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-[#050B24] dark:text-white tracking-tight font-mono">
              1:1
            </div>
              <div className="text-xs text-[#94A3B8] dark:text-[#64748B] font-mono mt-0.5">Split and recombine</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Panel (Deposit/Withdraw) + Right Panel (How It Works) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Interactive Panel (width: 7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0D152F] rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] p-5 sm:p-7 space-y-6 shadow-sm transition-colors">
          {/* Tab Switcher */}
          <div className="flex items-center gap-2 border-b border-[#E2E8F4] dark:border-[#1E294B] pb-4">
            <button
              onClick={() => setTab("deposit")}
              className={`px-5 py-2 text-sm font-bold rounded-full transition-all cursor-pointer ${
                tab === "deposit"
                  ? "bg-[#010FEE] text-white shadow-sm"
                  : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#050B24] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#162044]"
              }`}
            >
              Deposit
            </button>
            <button
              onClick={() => setTab("withdraw")}
              className={`px-5 py-2 text-sm font-bold rounded-full transition-all cursor-pointer ${
                tab === "withdraw"
                  ? "bg-[#010FEE] text-white shadow-sm"
                  : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#050B24] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#162044]"
              }`}
            >
              Withdraw
            </button>
          </div>

          {/* Success / Error Feedback */}
          {txSuccessMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-medium flex items-center gap-2.5">
              <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{txSuccessMessage}</span>
            </div>
          )}

          {vaultError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm font-medium flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span className="break-all">{vaultError}</span>
            </div>
          )}

          {tab === "deposit" ? (
            /* DEPOSIT (TEAR) TAB */
            <div className="space-y-5">
              {/* You Deposit Input Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] space-y-3">
                <div className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">You Deposit</div>
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="number"
                    step="any"
                    placeholder="0"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-transparent text-3xl sm:text-4xl font-black text-[#050B24] dark:text-white outline-none placeholder-[#CBD5E1] dark:placeholder-[#475569]"
                  />
                  {/* Stock Selector Pill */}
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#2A3B6B] shadow-sm shrink-0">
                    <AppleLogo className="w-4 h-4 text-black dark:text-white" />
                    <span className="text-xs sm:text-sm font-bold text-[#050B24] dark:text-white">
                      AAPLc
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8] pt-1">
                  <span>
                    Balance:{" "}
                    <strong className="font-mono text-[#050B24] dark:text-white">
                      {isConnected ? balanceVal.toFixed(4) : "0.00"} AAPLc
                    </strong>
                  </span>
                  {isConnected && balanceVal > 0 && (
                    <button
                      onClick={() => setDepositAmount(balanceVal.toString())}
                      className="px-2 py-0.5 rounded text-[11px] font-bold text-[#010FEE] dark:text-blue-400 bg-[#EEF2FF] dark:bg-blue-950/60 hover:bg-[#E0E7FF] dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
                    >
                      MAX
                    </button>
                  )}
                </div>
              </div>

              {/* Arrow Down Divider */}
              <div className="flex justify-center -my-2">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] flex items-center justify-center text-[#64748B] dark:text-[#94A3B8] shadow-sm">
                  <ArrowDown className="w-4 h-4" />
                </div>
              </div>

              {/* You Receive Dual Box */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] px-1">
                  You Receive
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* clipAAPLc */}
                  <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 flex items-center justify-center text-xs font-black">
                        ⚡
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#050B24] dark:text-white">
                          clipAAPLc
                        </div>
                        <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                          Multiplier leg
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-black text-[#010FEE] dark:text-blue-400 font-mono pt-2">
                      {parsedDeposit > 0 ? depositAmount : "0"}
                    </div>
                  </div>

                  {/* talonAAPLc */}
                  <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 flex items-center justify-center text-xs font-black">
                        📈
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#050B24] dark:text-white">
                          talonAAPLc
                        </div>
                        <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                          Price leg
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-black text-[#050B24] dark:text-white font-mono pt-2">
                      {parsedDeposit > 0 ? depositAmount : "0"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Step Progress / Status Banner */}
              {isTearing && (
                <div className="p-3.5 rounded-2xl bg-[#EEF2FF] border border-[#010FEE]/30 flex items-center gap-3 text-xs text-[#010FEE] font-bold animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                  <span>{stepText || "Submitting transaction to your wallet..."}</span>
                </div>
              )}

              {/* Error Notice */}
              {(localError || vaultError) && !isTearing && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start justify-between gap-3 text-xs text-rose-800 animate-fadeIn">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-rose-900">Deposit Notice</div>
                      <div className="mt-0.5 text-rose-700 leading-relaxed">{localError || vaultError}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setLocalError(null); clearError(); }}
                    className="text-rose-500 hover:text-rose-800 p-0.5 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Success Notification */}
              {txSuccessMessage && !isTearing && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-800 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold">{txSuccessMessage}</span>
                  </div>
                  {txHash && (
                    <a
                      href={`https://basescan.org/tx/${txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 hover:underline flex items-center gap-1 font-bold shrink-0"
                    >
                      <span>Basescan</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {/* Deposit Action Button */}
              {!isConnected ? (
                <button
                  onClick={() => openSelectModal()}
                  className="w-full py-4 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-sm font-bold transition-all shadow-[0_4px_20px_rgba(1,15,238,0.25)]"
                >
                  Connect Wallet
                </button>
              ) : (
                <button
                  onClick={handleDeposit}
                  disabled={isTearing || parsedDeposit <= 0}
                  className="w-full py-4 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-sm font-bold transition-all shadow-[0_4px_20px_rgba(1,15,238,0.25)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isTearing && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {wrongChain ? "Switch wallet to Base Mainnet (8453)" : isTearing ? (stepText ? "Confirming in Wallet..." : "Splitting AAPLc...") : "Deposit AAPLc"}
                </button>
              )}
            </div>
          ) : (
            /* WITHDRAW (RECOMBINE) TAB */
            <div className="space-y-5">
              {/* You Burn Input Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] space-y-3">
                <div className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
                  You Return (Equal Pair)
                </div>
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="number"
                    step="any"
                    placeholder="0"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-transparent text-3xl sm:text-4xl font-black text-[#050B24] dark:text-white outline-none placeholder-[#CBD5E1] dark:placeholder-[#475569]"
                  />
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#2A3B6B] text-xs font-bold text-[#050B24] dark:text-white">
                    <span>clip + talon</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8] pt-1">
                  <span>
                    Max Recombine:{" "}
                    <strong className="font-mono text-[#050B24] dark:text-white">
                      {isConnected ? maxRecombine.toFixed(4) : "0.00"} pairs
                    </strong>
                  </span>
                  {isConnected && maxRecombine > 0 && (
                    <button
                      onClick={() => setWithdrawAmount(maxRecombine.toString())}
                      className="px-2 py-0.5 rounded text-[11px] font-bold text-[#010FEE] dark:text-blue-400 bg-[#EEF2FF] dark:bg-blue-950/60 hover:bg-[#E0E7FF] dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
                    >
                      MAX
                    </button>
                  )}
                </div>
              </div>

              {/* Arrow Down Divider */}
              <div className="flex justify-center -my-2">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] flex items-center justify-center text-[#64748B] dark:text-[#94A3B8] shadow-sm">
                  <ArrowDown className="w-4 h-4" />
                </div>
              </div>

              {/* You Receive Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] space-y-2">
                <div className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
                  You Receive AAPLc
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {parsedWithdraw > 0 ? withdrawAmount : "0"}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#2A3B6B]">
                    <AppleLogo className="w-3.5 h-3.5 text-black dark:text-white" />
                    <span className="text-xs font-bold text-[#050B24] dark:text-white">AAPLc</span>
                  </div>
                </div>
              </div>

              {/* Formula Footer */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#64748B] dark:text-[#94A3B8] font-mono py-1">
                <span>Clip + Talon → AAPLc</span>
              </div>

              {/* Live Step Progress / Status Banner */}
              {isJoining && (
                <div className="p-3.5 rounded-2xl bg-[#EEF2FF] dark:bg-blue-950/60 border border-[#010FEE]/30 dark:border-blue-800 flex items-center gap-3 text-xs text-[#010FEE] dark:text-blue-400 font-bold animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                  <span>{stepText || "Confirming recombine in your wallet..."}</span>
                </div>
              )}

              {/* Error Notice */}
              {(localError || vaultError) && !isJoining && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-start justify-between gap-3 text-xs text-rose-800 dark:text-rose-200 animate-fadeIn">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-rose-900 dark:text-rose-200">Withdraw Notice</div>
                      <div className="mt-0.5 text-rose-700 dark:text-rose-300 leading-relaxed">{localError || vaultError}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setLocalError(null); clearError(); }}
                    className="text-rose-500 hover:text-rose-800 dark:hover:text-rose-200 p-0.5 rounded cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Success Notification */}
              {txSuccessMessage && !isJoining && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3 text-xs text-emerald-800 dark:text-emerald-200 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-bold">{txSuccessMessage}</span>
                  </div>
                  {txHash && (
                    <a
                      href={`https://basescan.org/tx/${txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-1 font-bold shrink-0"
                    >
                      <span>Basescan</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {/* Withdraw Action Button */}
              {!isConnected ? (
                <button
                  onClick={() => openSelectModal()}
                  className="w-full py-4 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-sm font-bold transition-all shadow-[0_4px_20px_rgba(1,15,238,0.25)] cursor-pointer"
                >
                  Connect Wallet
                </button>
              ) : (
                <button
                  onClick={handleWithdraw}
                  disabled={isJoining || parsedWithdraw <= 0}
                  className="w-full py-4 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-sm font-bold transition-all shadow-[0_4px_20px_rgba(1,15,238,0.25)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isJoining && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {wrongChain ? "Switch wallet to Base Mainnet (8453)" : isJoining ? (stepText ? "Confirming in Wallet..." : "Recombining Tokens...") : "Recombine & Withdraw AAPLc"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Panel: How It Works Matching Image 2 (width: 5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0D152F] rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] p-6 sm:p-7 space-y-6 shadow-sm transition-colors">
          <h2 className="text-base font-bold text-[#050B24] dark:text-white tracking-tight">
            In three steps
          </h2>

          <div className="space-y-5">
            {/* Step 01 */}
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-[#F1F5F9] dark:bg-[#162044] text-[#010FEE] dark:text-blue-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                01
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-[#050B24] dark:text-white">Deposit Stock</div>
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Deposit AAPLc into the Base vault.
                </div>
              </div>
            </div>

            {/* Step 02 */}
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-[#F1F5F9] dark:bg-[#162044] text-[#010FEE] dark:text-blue-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                02
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-[#050B24] dark:text-white">
                  Receive clip + talon
                </div>
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Receive equal Clip and Talon amounts.
                </div>
              </div>
            </div>

            {/* Step 03 */}
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-[#F1F5F9] dark:bg-[#162044] text-[#010FEE] dark:text-blue-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                03
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-[#050B24] dark:text-white">Hold or transfer</div>
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Clip follows the multiplier. Talon follows price.
                </div>
              </div>
            </div>

            {/* Step 04 */}
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-[#F1F5F9] dark:bg-[#162044] text-[#010FEE] dark:text-blue-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                04
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-[#050B24] dark:text-white">Recombine</div>
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Return equal amounts of clip and talon anytime to redeem your original stock with zero slippage.
                </div>
              </div>
            </div>
          </div>

          {/* Verified Base Contract Details */}
          <div className="pt-4 border-t border-[#E2E8F4] dark:border-[#1E294B] space-y-2">
            <div className="text-[10px] uppercase font-bold text-[#94A3B8] dark:text-[#64748B] tracking-wider">
              Verified Base Mainnet Contracts
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
                <span>Vault (AAPLc)</span>
                {vaultAddress ? (
                  <a
                    href={`https://basescan.org/address/${vaultAddress}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[#010FEE] dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    {vaultAddress.slice(0, 6)}...{vaultAddress.slice(-4)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="font-mono text-xs">Deploying...</span>
                )}
              </div>
              <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
                <span>clipAAPLc</span>
                {clipAddress ? (
                  <a
                    href={`https://basescan.org/address/${clipAddress}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[#010FEE] dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    {clipAddress.slice(0, 6)}...{clipAddress.slice(-4)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="font-mono text-xs">Pending</span>
                )}
              </div>
              <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
                <span>talonAAPLc</span>
                {talonAddress ? (
                  <a
                    href={`https://basescan.org/address/${talonAddress}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[#010FEE] dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    {talonAddress.slice(0, 6)}...{talonAddress.slice(-4)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="font-mono text-xs">Pending</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <EligibilityAttestationModal
        isOpen={isAttestationOpen}
        onClose={() => setIsAttestationOpen(false)}
        onConfirmed={() => {
          setIsAttestationOpen(false);
          void (tab === "deposit" ? executeDeposit() : executeWithdraw());
        }}
      />
      <GiftExposureModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        clipBalance={clipVal}
        talonBalance={talonVal}
      />
    </div>
  );
}
