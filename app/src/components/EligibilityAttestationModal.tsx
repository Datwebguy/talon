"use client";

import { useState } from "react";
import { ShieldCheck, X } from "lucide-react";
import { saveEligibilityAttestation } from "../lib/eligibility";

export function EligibilityAttestationModal({
  isOpen,
  onClose,
  onConfirmed,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirmed: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  if (!isOpen) return null;

  const confirm = () => {
    if (!confirmed) return;
    saveEligibilityAttestation();
    onConfirmed();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button aria-label="Close eligibility notice" className="absolute inset-0 bg-[#050B24]/45 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="eligibility-title" className="relative w-full max-w-md rounded-3xl border border-[#E2E8F4] bg-white p-6 shadow-2xl dark:border-[#1E294B] dark:bg-[#0D152F]">
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-full p-2 text-[#94A3B8] hover:bg-[#F8FAFC] dark:hover:bg-[#162044]"><X className="h-4 w-4" /></button>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#010FEE] dark:bg-blue-950/60 dark:text-blue-400"><ShieldCheck className="h-5 w-5" /></div>
        <h2 id="eligibility-title" className="mt-4 text-xl font-black text-[#050B24] dark:text-white">Before you continue</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#64748B] dark:text-[#94A3B8]">Stock actions are available only to eligible non-US persons. Coinbase issues the tokens; Base is the network. This checkbox is only a local notice—the Base eligibility registry remains the final gate.</p>
        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#E2E8F4] bg-[#F8FAFC] p-4 text-sm text-[#475569] dark:border-[#2A3B6B] dark:bg-[#162044] dark:text-[#CBD5E1]">
          <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#010FEE]" />
          <span>I confirm that I am not a US person and I am accessing this feature from an eligible jurisdiction.</span>
        </label>
        <button disabled={!confirmed} onClick={confirm} className="mt-5 w-full rounded-full bg-[#010FEE] py-3.5 text-sm font-bold text-white transition hover:bg-[#000ED6] disabled:cursor-not-allowed disabled:opacity-40">Continue to onchain check</button>
        <p className="mt-3 text-center text-[11px] text-[#94A3B8]">Location is estimated from your connection. This is not identity verification.</p>
      </div>
    </div>
  );
}
