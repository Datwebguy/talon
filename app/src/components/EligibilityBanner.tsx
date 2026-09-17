"use client";

import { useEffect, useState } from "react";
import { Info, AlertTriangle, XCircle } from "lucide-react";
import { getEligibilityStatus, type EligibilityStatus } from "../lib/eligibility";

export function EligibilityBanner() {
  const [status, setStatus] = useState<EligibilityStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEligibilityStatus().then(setStatus).catch((reason: Error) => setError(reason.message));
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3.5 text-xs text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200 shadow-xs">
        <div className="flex items-start gap-2.5">
          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-rose-900 dark:text-rose-100">Stock actions unavailable</div>
            <p className="text-[11px] text-rose-700/80 dark:text-rose-300/70 font-normal mt-0.5">{error} You can still browse the app.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="font-medium">Checking stock access…</span>
        </div>
      </div>
    );
  }

  if (status.state === "blocked") {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3.5 text-xs text-rose-800 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-200 shadow-xs">
        <div className="flex items-start gap-2.5">
          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-rose-950 dark:text-rose-100">Stock actions unavailable here</div>
            <p className="text-[11px] text-rose-800/80 dark:text-rose-300/70 font-normal mt-0.5 leading-relaxed">
              Coinbase Tokenized Stocks are for eligible non-US users. You can still browse official assets and read the docs.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status.state === "pending") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-xs text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200 shadow-xs">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-amber-950 dark:text-amber-100">Eligibility pending</div>
            <p className="text-[11px] text-amber-800/80 dark:text-amber-300/70 font-normal mt-0.5 leading-relaxed">
              We could not verify this connection yet. Stock actions stay disabled until your non-US eligibility is confirmed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-200/90 bg-amber-50/80 px-5 py-3.5 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200 shadow-xs transition-colors">
      <div className="flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-xs text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
            <span>Eligibility confirmed for this connection</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <p className="text-[11px] text-amber-800/80 dark:text-amber-300/70 font-normal mt-0.5 leading-relaxed">
            A separate manual Base registry approval may still be required before stock actions unlock. Coinbase issues the tokens; Base is the network.
          </p>
        </div>
      </div>
    </div>
  );
}
