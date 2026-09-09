"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useWalletModal } from "../context/WalletModalContext";
import { useVault } from "../hooks/useVault";
import { useB20Data } from "../hooks/useB20Data";
import { ArrowDown, AlertCircle, CheckCircle2, ExternalLink, Loader2, Sparkles } from "lucide-react";

interface JoinPanelProps {
  tokenAddress: `0x${string}`;
  decimals: number;
}

export function JoinPanel({ tokenAddress, decimals }: JoinPanelProps) {
  const { isConnected } = useAccount();
  const { openSelectModal } = useWalletModal();
  const [amount, setAmount] = useState("");
  const { tokenMeta, priceVal } = useB20Data(tokenAddress);
  const {
    isVaultDeployed,
    clipBalance,
    talonBalance,
    executeJoin,
    isTransacting,
    simulationError,
    txHash,
  } = useVault(tokenAddress, decimals);

  const numAmount = parseFloat(amount) || 0;
  const maxJoinable = Math.min(clipBalance, talonBalance);
  const estValueUsd = priceVal && numAmount > 0 ? (numAmount * priceVal).toFixed(2) : "0.00";

  const handleJoin = async () => {
    if (!amount || numAmount <= 0) return;
    try {
      await executeJoin(amount);
      setAmount("");
    } catch {
      // Handled in hook
    }
  };

  return (
    <div className="space-y-6 pt-1">
      {/* Balances Status */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-[#EEF2FF] border border-[#010FEE]/20">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1 font-semibold">
            <span>clip{tokenMeta.symbol}</span>
            <span className="text-[10px] text-[#010FEE] font-bold px-2 py-0.5 rounded-full bg-white">Multiplier</span>
          </div>
          <div className="text-xl font-mono font-black text-[#050B24]">
            {clipBalance.toFixed(4)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F4]">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1 font-semibold">
            <span>talon{tokenMeta.symbol}</span>
            <span className="text-[10px] text-[#2563EB] font-bold px-2 py-0.5 rounded-full bg-white">Principal</span>
          </div>
          <div className="text-xl font-mono font-black text-[#050B24]">
            {talonBalance.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Input section */}
      <div>
        <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-medium">
          <span className="font-bold text-[#050B24]">Amount to Recombine</span>
          <div className="flex items-center gap-1.5">
            <span>Max Recombinable:</span>
            <span className="text-[#050B24] font-mono font-bold">{maxJoinable.toFixed(4)}</span>
            <span className="font-semibold">{tokenMeta.symbol}</span>
          </div>
        </div>

        <div className="relative rounded-2xl bg-[#F8FAFC] border border-[#E2E8F4] p-4 transition-all focus-within:border-[#010FEE] focus-within:ring-2 focus-within:ring-[#010FEE]/10">
          <div className="flex items-center justify-between gap-4">
            <input
              type="number"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!isVaultDeployed || isTransacting}
              className="w-full bg-transparent font-mono text-2xl sm:text-3xl text-[#050B24] placeholder-[#94A3B8] font-bold focus:outline-none"
            />
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setAmount(maxJoinable.toString())}
                disabled={!isVaultDeployed || isTransacting || maxJoinable <= 0}
                className="px-3 py-1 bg-[#EEF2FF] hover:bg-[#E0E7FF] disabled:opacity-40 rounded-full text-xs font-bold text-[#010FEE] transition-colors"
              >
                MAX
              </button>
              <div className="px-3.5 py-1.5 rounded-full bg-white border border-[#E2E8F4] flex items-center gap-2 shadow-sm">
                <span className="text-xs font-bold text-[#050B24] tracking-wider">Pairs</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-[#64748B] mt-2 font-mono">
            Burn 1 clip + 1 talon = 1 raw stock (≈ ${estValueUsd} USD)
          </div>
        </div>
      </div>

      {/* Center divider icon */}
      <div className="flex justify-center -my-3 relative z-10">
        <div className="w-9 h-9 rounded-full bg-white border border-[#E2E8F4] flex items-center justify-center text-[#010FEE] shadow-md">
          <ArrowDown className="w-4 h-4" />
        </div>
      </div>

      {/* Output preview */}
      <div>
        <div className="text-xs font-bold text-[#64748B] mb-2.5 flex items-center justify-between uppercase tracking-wider">
          <span>You Receive (Raw Stock)</span>
          <span className="text-[11px] text-[#010FEE] flex items-center gap-1 font-bold normal-case lowercase">
            <Sparkles className="w-3.5 h-3.5" /> 0% slippage invariant
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#EEF2FF] border border-[#010FEE]/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-black text-[#010FEE] uppercase tracking-wider">
              Underlying Asset
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white text-[#010FEE] font-bold border border-[#010FEE]/20">
              {tokenMeta.symbol}
            </span>
          </div>
          <div className="text-2xl font-mono font-black text-[#050B24] mt-1">
            {numAmount > 0 ? numAmount.toFixed(4) : "0.0000"} {tokenMeta.symbol}
          </div>
          <p className="text-xs text-[#475569] mt-1 leading-normal font-medium">
            Directly transferred from vault reserve into your connected wallet with zero fee drag
          </p>
        </div>
      </div>

      {/* Warnings / Error notice */}
      {simulationError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-red-800">Recombination Notice</div>
            <div className="break-all mt-0.5 text-red-600 leading-relaxed">{simulationError}</div>
          </div>
        </div>
      )}

      {/* Success Receipt */}
      {txHash && (
        <div className="p-4 rounded-2xl bg-[#EEF2FF] border border-[#010FEE]/30 flex items-center justify-between text-xs text-[#050B24]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#010FEE] shrink-0" />
            <span className="font-bold text-[#050B24]">Recombined successfully on Base</span>
          </div>
          <a
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[#010FEE] hover:underline font-bold"
          >
            <span>Basescan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Action Button */}
      {!isConnected ? (
        <button
          onClick={openSelectModal}
          className="w-full py-4 rounded-full bg-[#010FEE] hover:bg-[#000ED6] text-white text-base font-bold transition-all shadow-[0_4px_20px_rgba(1,15,238,0.25)] flex items-center justify-center gap-2"
        >
          <span>Connect Wallet to Recombine</span>
        </button>
      ) : !isVaultDeployed ? (
        <button
          disabled
          className="w-full py-4 rounded-full bg-[#F1F5F9] text-[#94A3B8] text-sm font-bold cursor-not-allowed"
        >
          Vault Unopened on Base
        </button>
      ) : (
        <button
          onClick={handleJoin}
          disabled={isTransacting || numAmount <= 0 || numAmount > maxJoinable}
          className="w-full py-4 rounded-full bg-[#010FEE] hover:bg-[#000ED6] active:bg-[#000B99] disabled:bg-[#F1F5F9] disabled:text-[#94A3B8] text-white text-base font-bold transition-all shadow-[0_4px_20px_rgba(1,15,238,0.25)] flex items-center justify-center gap-2"
        >
          {isTransacting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Simulating & Executing on Base...</span>
            </>
          ) : numAmount > maxJoinable ? (
            <span>Insufficient Balanced Claims</span>
          ) : (
            <span>Recombine into {tokenMeta.symbol}</span>
          )}
        </button>
      )}
    </div>
  );
}
