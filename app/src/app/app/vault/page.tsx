"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import { useWalletModal } from "../../../context/WalletModalContext";
import { useVault } from "../../../hooks/useVault";
import { useB20Data } from "../../../hooks/useB20Data";
import {
  B20_ABI,
  OFFICIAL_TOKENS,
  OFFICIAL_MARKET_PAIRS,
  FACTORY_ADDRESS,
} from "../../../config/contracts";
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
  TrendingUp,
  CheckCircle2,
  X,
  Rocket,
  ChevronDown,
} from "lucide-react";
import {
  AppleLogo,
  NvidiaLogo,
  GoogleLogo,
  MetaLogo,
  AmazonLogo,
  MicrosoftLogo,
  TeslaLogo,
  MicroStrategyLogo,
  SanDiskLogo,
  SpaceXLogo,
} from "../../../components/CompanyLogos";
import { TalonLogo } from "../../../components/TalonLogo";
import { EligibilityAttestationModal } from "../../../components/EligibilityAttestationModal";
import { GiftExposureModal } from "../../../components/GiftExposureModal";
import { hasEligibilityAttestation } from "../../../lib/eligibility";

function StockLogo({ symbol, className = "w-5 h-5" }: { symbol: string; className?: string }) {
  if (symbol === "AAPLc") return <AppleLogo className={className} />;
  if (symbol === "NVDAc") return <NvidiaLogo className={className} />;
  if (symbol === "GOOGLc") return <GoogleLogo className={className} />;
  if (symbol === "METAc") return <MetaLogo className={className} />;
  if (symbol === "AMZNc") return <AmazonLogo className={className} />;
  if (symbol === "MSFTc") return <MicrosoftLogo className={className} />;
  if (symbol === "TSLAc") return <TeslaLogo className={className} />;
  if (symbol === "MSTRc") return <MicroStrategyLogo className={className} />;
  if (symbol === "SNDKc") return <SanDiskLogo className={className} />;
  if (symbol === "SPCXc") return <SpaceXLogo className={className} />;
  return (
    <span className="font-mono font-black text-[11px] px-1 py-0.5 rounded bg-[#EEF2FF] text-[#010FEE] dark:bg-[#162044] dark:text-blue-300">
      {symbol.replace("c", "").slice(0, 4)}
    </span>
  );
}

export default function VaultPage() {
  const { address, isConnected, chainId } = useAccount();
  const wrongChain = isConnected && chainId !== 8453;
  const { openSelectModal } = useWalletModal();

  const [selectedSymbol, setSelectedSymbol] = useState<string>("AAPLc");

  // Read asset from URL query parameter on mount if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const asset = params.get("asset");
      if (asset) {
        const found = OFFICIAL_TOKENS.find(
          (t) => t.symbol.toLowerCase() === asset.toLowerCase()
        );
        if (found) setSelectedSymbol(found.symbol);
      }
    }
  }, []);

  const selectedToken =
    OFFICIAL_TOKENS.find((t) => t.symbol === selectedSymbol) || OFFICIAL_TOKENS[0];

  const {
    balanceVal,
    formattedBalance,
    formattedPrice,
    priceVal,
    formattedUsd,
    isLoading: isB20Loading,
  } = useB20Data(selectedToken.address);

  const {
    clipAddress,
    talonAddress,
    vaultAddress,
    isVaultDeployed,
    clipBalance,
    talonBalance,
    tear,
    join,
    deployVault,
    isDeployingVault,
    deployVaultSuccess,
    deployVaultHash,
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
  } = useVault(selectedToken.address, selectedToken.decimals);

  const { data: rawVaultBalance } = useReadContract({
    address: selectedToken.address,
    abi: B20_ABI,
    functionName: "balanceOf",
    args: vaultAddress ? [vaultAddress] : undefined,
    query: { enabled: !!vaultAddress },
  });

  const vaultBalance = rawVaultBalance
    ? Number(rawVaultBalance) / 10 ** selectedToken.decimals
    : null;
  const vaultValue =
    vaultBalance !== null && priceVal !== null
      ? `$${(vaultBalance * priceVal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : isVaultDeployed ? "$0.00" : "Pre-Deploy";

  const [tab, setTab] = useState<"deposit" | "withdraw">("deposit");
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [txSuccessMessage, setTxSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isAttestationOpen, setIsAttestationOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);

  const clipSymbol = `clip${selectedToken.symbol}`;
  const talonSymbol = `talon${selectedToken.symbol}`;
  const marketPair = OFFICIAL_MARKET_PAIRS[selectedToken.symbol as keyof typeof OFFICIAL_MARKET_PAIRS];

  useEffect(() => {
    if (tearSuccess) {
      setTxSuccessMessage(`Successfully split ${selectedToken.symbol} into ${clipSymbol} + ${talonSymbol}!`);
      setDepositAmount("");
      setLocalError(null);
      const timer = setTimeout(() => setTxSuccessMessage(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [tearSuccess, selectedToken.symbol, clipSymbol, talonSymbol]);

  useEffect(() => {
    if (joinSuccess) {
      setTxSuccessMessage(`Successfully recombined tokens and redeemed ${selectedToken.symbol}!`);
      setWithdrawAmount("");
      setLocalError(null);
      const timer = setTimeout(() => setTxSuccessMessage(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [joinSuccess, selectedToken.symbol]);

  useEffect(() => {
    if (deployVaultSuccess) {
      setTxSuccessMessage(`Successfully deployed TalonVault for ${selectedToken.symbol} on Base Mainnet!`);
      const timer = setTimeout(() => setTxSuccessMessage(null), 12000);
      return () => clearTimeout(timer);
    }
  }, [deployVaultSuccess, selectedToken.symbol]);

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

  const handleDeployVault = async () => {
    if (!isConnected) {
      openSelectModal();
      return;
    }
    setLocalError(null);
    clearError();
    try {
      await deployVault();
    } catch (err: any) {
      setLocalError(err?.message || "Failed to deploy vault on Base.");
    }
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
            Split tokenized Coinbase equities on Base. Keep the multiplier, trade the principal, or recombine anytime 1:1.
          </p>
          {isConnected && !wrongChain && !isEligibilityLoading && !onchainEligibility && (
            <div className="mt-3 max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium leading-relaxed text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200">
              <div className="font-bold">Eligibility pending · manual approval required</div>
              <div className="mt-1">
                This Base wallet is not yet registered for stock actions. The app will not request an approval or transaction until registered.
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsGiftModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C7D2FE] bg-[#EEF2FF] px-4 py-2.5 text-xs font-bold text-[#010FEE] transition hover:border-[#010FEE] hover:bg-white dark:border-[#2A3B6B] dark:bg-[#162044] dark:text-blue-300 dark:hover:bg-[#1E2B5C] cursor-pointer"
        >
          <Gift className="h-4 w-4" />
          Gift exposure
        </button>
      </div>

      {/* Asset Selector Horizontal Carousel / Pill List */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] shrink-0 mr-1">
          Stock:
        </span>
        {OFFICIAL_TOKENS.map((token) => {
          const isSelected = selectedSymbol === token.symbol;
          return (
            <button
              key={token.symbol}
              onClick={() => {
                setSelectedSymbol(token.symbol);
                setDepositAmount("");
                setWithdrawAmount("");
                setLocalError(null);
                clearError();
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                isSelected
                  ? "bg-[#010FEE] text-white border-[#010FEE] shadow-sm shadow-[#010FEE]/20"
                  : "bg-white dark:bg-[#0D152F] border-[#E2E8F4] dark:border-[#1E294B] text-[#475569] dark:text-[#94A3B8] hover:border-[#010FEE]/40"
              }`}
            >
              <StockLogo symbol={token.symbol} className="w-4 h-4" />
              <span>{token.symbol}</span>
              {token.hasDeployedVault || (token.symbol === "AAPLc" && isVaultDeployed) ? (
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-emerald-300" : "bg-emerald-500"}`} title="Live Vault Active" />
              ) : token.isFactoryAllowlisted ? (
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-purple-300" : "bg-purple-500"}`} title="Factory Allowlisted" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* 1. Protocol vault balance */}
        <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
            <span>Total {selectedToken.symbol} in vault</span>
            <Lock className="w-4 h-4 text-[#94A3B8] dark:text-[#64748B]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-[#050B24] dark:text-white tracking-tight">
              {vaultValue}
            </div>
            <div className="text-xs text-[#94A3B8] dark:text-[#64748B] font-mono mt-0.5">
              {vaultBalance === null ? (isVaultDeployed ? "0.0000" : "Pre-deploy state") : `Protocol total: ${vaultBalance.toFixed(4)} ${selectedToken.symbol}`}
            </div>
          </div>
        </div>

        {/* 2. Spot Asset Price */}
        <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
            <span>Spot Equity Price</span>
            <TrendingUp className="w-4 h-4 text-[#94A3B8] dark:text-[#64748B]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-[#050B24] dark:text-white tracking-tight font-mono">
              {formattedPrice}
            </div>
            <div className="text-xs text-[#94A3B8] dark:text-[#64748B] font-mono mt-0.5">
              Aerodrome DEX / Chainlink Base
            </div>
          </div>
        </div>

        {/* 3. Accretion Yield Quote */}
        <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
            <span>B20 Multiplier</span>
            <Percent className="w-4 h-4 text-[#010FEE] dark:text-blue-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-[#010FEE] dark:text-blue-400 tracking-tight font-mono">
              1.0000x
            </div>
            <div className="text-xs font-bold text-[#94A3B8] dark:text-[#64748B] mt-0.5">Accretion tracked by {clipSymbol}</div>
          </div>
        </div>

        {/* 4. Invariant Ratio */}
        <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#1E294B] flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
            <span>Mathematical Invariant</span>
            <DollarSign className="w-4 h-4 text-[#94A3B8] dark:text-[#64748B]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-[#050B24] dark:text-white tracking-tight font-mono">
              1:1
            </div>
            <div className="text-xs text-[#94A3B8] dark:text-[#64748B] font-mono mt-0.5">Strict raw backing</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Panel (Interactive Desk / Deployment) + Right Panel (Specifications) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Interactive Panel (width: 7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0D152F] rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] p-5 sm:p-7 space-y-6 shadow-sm transition-colors">
          {isVaultDeployed ? (
            <>
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
                  Deposit (Tear)
                </button>
                <button
                  onClick={() => setTab("withdraw")}
                  className={`px-5 py-2 text-sm font-bold rounded-full transition-all cursor-pointer ${
                    tab === "withdraw"
                      ? "bg-[#010FEE] text-white shadow-sm"
                      : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#050B24] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#162044]"
                  }`}
                >
                  Withdraw (Join)
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
                        <StockLogo symbol={selectedToken.symbol} className="w-4 h-4" />
                        <span className="text-xs sm:text-sm font-bold text-[#050B24] dark:text-white">
                          {selectedToken.symbol}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8] pt-1">
                      <span>
                        Balance:{" "}
                        <strong className="font-mono text-[#050B24] dark:text-white">
                          {isConnected ? balanceVal.toFixed(4) : "0.00"} {selectedToken.symbol}
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
                      You Receive (1:1 Unbundled Split)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* clipToken */}
                      <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 flex items-center justify-center text-xs font-black">
                            ⚡
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#050B24] dark:text-white">
                              {clipSymbol}
                            </div>
                            <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                              Multiplier accretion leg
                            </div>
                          </div>
                        </div>
                        <div className="text-2xl font-black text-[#010FEE] dark:text-blue-400 font-mono pt-2">
                          {parsedDeposit > 0 ? depositAmount : "0"}
                        </div>
                      </div>

                      {/* talonToken */}
                      <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#EEF2FF] dark:bg-blue-950/60 text-[#010FEE] dark:text-blue-400 flex items-center justify-center text-xs font-black">
                            📈
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#050B24] dark:text-white">
                              {talonSymbol}
                            </div>
                            <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                              Spot price principal leg
                            </div>
                          </div>
                        </div>
                        <div className="text-2xl font-black text-[#050B24] dark:text-white font-mono pt-2">
                          {parsedDeposit > 0 ? depositAmount : "0"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Step Progress */}
                  {isTearing && (
                    <div className="p-3.5 rounded-2xl bg-[#EEF2FF] border border-[#010FEE]/30 flex items-center gap-3 text-xs text-[#010FEE] font-bold animate-pulse">
                      <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                      <span>{stepText || "Submitting transaction to Base..."}</span>
                    </div>
                  )}

                  {/* Deposit Action Button */}
                  {!isConnected ? (
                    <button
                      onClick={() => openSelectModal()}
                      className="w-full py-4 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-sm font-bold transition-all shadow-[0_4px_20px_rgba(1,15,238,0.25)] cursor-pointer"
                    >
                      Connect Wallet
                    </button>
                  ) : (
                    <button
                      onClick={handleDeposit}
                      disabled={isTearing || parsedDeposit <= 0 || parsedDeposit > balanceVal}
                      className="w-full py-4 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-sm font-bold transition-all shadow-[0_4px_20px_rgba(1,15,238,0.25)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isTearing && <RefreshCw className="w-4 h-4 animate-spin" />}
                      {wrongChain ? "Switch wallet to Base Mainnet" : isTearing ? (stepText ? "Confirming in Wallet..." : `Splitting ${selectedToken.symbol}...`) : parsedDeposit > balanceVal ? `Insufficient ${selectedToken.symbol} Balance` : `Deposit & Split ${selectedToken.symbol}`}
                    </button>
                  )}
                </div>
              ) : (
                /* WITHDRAW (RECOMBINE) TAB */
                <div className="space-y-5">
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
                        <span>{clipSymbol} + {talonSymbol}</span>
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
                      You Receive Underlying Equity
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {parsedWithdraw > 0 ? withdrawAmount : "0"}
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#0D152F] border border-[#E2E8F4] dark:border-[#2A3B6B]">
                        <StockLogo symbol={selectedToken.symbol} className="w-4 h-4" />
                        <span className="text-xs font-bold text-[#050B24] dark:text-white">{selectedToken.symbol}</span>
                      </div>
                    </div>
                  </div>

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
                      disabled={isJoining || parsedWithdraw <= 0 || parsedWithdraw > maxRecombine}
                      className="w-full py-4 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-sm font-bold transition-all shadow-[0_4px_20px_rgba(1,15,238,0.25)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isJoining && <RefreshCw className="w-4 h-4 animate-spin" />}
                      {wrongChain ? "Switch wallet to Base Mainnet" : isJoining ? (stepText ? "Confirming in Wallet..." : "Recombining Tokens...") : parsedWithdraw > maxRecombine ? "Insufficient Balanced Pairs" : `Recombine & Redeem ${selectedToken.symbol}`}
                    </button>
                  )}
                </div>
              )}
            </>
          ) : selectedToken.isFactoryAllowlisted ? (
            /* FACTORY READY TO DEPLOY STATE */
            <div className="space-y-6 py-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Rocket className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#050B24] dark:text-white">
                    Deploy {selectedToken.symbol} Vault on Base
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    Pre-authorized on TalonFactory ({FACTORY_ADDRESS.slice(0, 6)}...{FACTORY_ADDRESS.slice(-4)})
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] space-y-3">
                <div className="text-xs font-semibold text-[#050B24] dark:text-white">
                  Permissionless Factory Execution
                </div>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Anyone on Base can initialize this vault. Clicking below calls <code className="font-mono bg-white dark:bg-[#0D152F] px-1.5 py-0.5 rounded border border-[#E2E8F4] dark:border-[#2A3B6B]">TalonFactory.createVault({selectedToken.address.slice(0, 6)}...)</code>, which deploys the <code className="font-mono">{clipSymbol}</code> and <code className="font-mono">{talonSymbol}</code> smart contracts on Base mainnet.
                </p>

                <div className="pt-2 border-t border-[#E2E8F4] dark:border-[#2A3B6B] flex items-center justify-between text-xs">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">Coinbase Token Address:</span>
                  <a
                    href={`https://basescan.org/token/${selectedToken.address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[#010FEE] dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    {selectedToken.address.slice(0, 8)}...{selectedToken.address.slice(-6)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Invariant Preview */}
              <div className="p-4 rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 space-y-2">
                <div className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Configured 1:1 Invariant</span>
                </div>
                <div className="text-xs text-purple-800 dark:text-purple-300 font-mono">
                  1.0000 {selectedToken.symbol} ⇌ 1.0000 {clipSymbol} + 1.0000 {talonSymbol}
                </div>
              </div>

              {localError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{localError}</span>
                </div>
              )}

              {/* Deploy Button */}
              {!isConnected ? (
                <button
                  onClick={() => openSelectModal()}
                  className="w-full py-4 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-sm font-bold transition-all shadow-[0_4px_20px_rgba(1,15,238,0.25)] cursor-pointer"
                >
                  Connect Wallet to Deploy
                </button>
              ) : (
                <button
                  onClick={handleDeployVault}
                  disabled={isDeployingVault}
                  className="w-full py-4 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold transition-all shadow-[0_4px_20px_rgba(147,51,234,0.25)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isDeployingVault && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {isDeployingVault ? (stepText || "Deploying on Base Mainnet...") : `Deploy ${selectedToken.symbol} Vault`}
                </button>
              )}
            </div>
          ) : (
            /* VERIFIED AERODROME DEX MARKET STATE */
            <div className="space-y-6 py-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#050B24] dark:text-white">
                    Verified Aerodrome Market: {selectedToken.symbol}
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    Official Coinbase Token on Base Mainnet
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#162044] border border-[#E2E8F4] dark:border-[#2A3B6B] space-y-3">
                <div className="text-xs font-semibold text-[#050B24] dark:text-white">
                  Active DEX Pool on Base
                </div>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  {selectedToken.name} is actively tradeable against USDC on Aerodrome DEX with real-time onchain price indexing. Talon Sentinel continuously monitors this asset for invariant unbundling opportunities.
                </p>

                <div className="pt-2 border-t border-[#E2E8F4] dark:border-[#2A3B6B] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Live Market Price:</span>
                    <span className="font-mono font-bold text-[#050B24] dark:text-white">{formattedPrice}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Your Wallet Balance:</span>
                    <span className="font-mono font-bold text-[#050B24] dark:text-white">
                      {isConnected ? balanceVal.toFixed(4) : "0.00"} {selectedToken.symbol}
                    </span>
                  </div>
                </div>
              </div>

              {marketPair && (
                <a
                  href={marketPair.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-sm font-bold transition-all shadow-[0_4px_20px_rgba(1,15,238,0.25)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Trade {selectedToken.symbol} on Aerodrome DEX</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right Panel: How It Works & Contract Architecture (width: 5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0D152F] rounded-3xl border border-[#E2E8F4] dark:border-[#1E294B] p-6 sm:p-7 space-y-6 shadow-sm transition-colors">
          <h2 className="text-base font-bold text-[#050B24] dark:text-white tracking-tight">
            How Talon Split Works
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
                  Deposit {selectedToken.symbol} into the audited Base vault.
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
                  Receive {clipSymbol} + {talonSymbol}
                </div>
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Mint equal amounts of accretion rights and spot price exposure.
                </div>
              </div>
            </div>

            {/* Step 03 */}
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-[#F1F5F9] dark:bg-[#162044] text-[#010FEE] dark:text-blue-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                03
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-[#050B24] dark:text-white">Autonomous Protection</div>
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Talon Sentinel can protect the price leg before earnings volatility while multiplier yield compounds uninterrupted.
                </div>
              </div>
            </div>

            {/* Step 04 */}
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-[#F1F5F9] dark:bg-[#162044] text-[#010FEE] dark:text-blue-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                04
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-[#050B24] dark:text-white">Recombine Anytime</div>
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Return equal clip and talon pairs to redeem the underlying stock 1:1 on Base with zero slippage.
                </div>
              </div>
            </div>
          </div>

          {/* Verified Base Contract Details */}
          <div className="pt-4 border-t border-[#E2E8F4] dark:border-[#1E294B] space-y-2">
            <div className="text-[10px] uppercase font-bold text-[#94A3B8] dark:text-[#64748B] tracking-wider">
              Base Mainnet Contracts
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
                <span>TalonFactory</span>
                <a
                  href={`https://basescan.org/address/${FACTORY_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[#010FEE] dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  {FACTORY_ADDRESS.slice(0, 6)}...{FACTORY_ADDRESS.slice(-4)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
                <span>{selectedToken.symbol} Vault</span>
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
                  <span className="font-mono text-xs text-purple-600 dark:text-purple-400">Ready to Deploy</span>
                )}
              </div>

              <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
                <span>{clipSymbol}</span>
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
                  <span className="font-mono text-xs">Pending Vault</span>
                )}
              </div>

              <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
                <span>{talonSymbol}</span>
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
                  <span className="font-mono text-xs">Pending Vault</span>
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
        underlyingSymbol={selectedToken.symbol}
        clipAddress={clipAddress}
        talonAddress={talonAddress}
      />
    </div>
  );
}
