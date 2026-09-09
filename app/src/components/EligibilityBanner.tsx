"use client";

import { useEffect, useState } from "react";
import { getEligibilityStatus, type EligibilityStatus } from "../lib/eligibility";

export function EligibilityBanner() {
  const [status, setStatus] = useState<EligibilityStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEligibilityStatus().then(setStatus).catch((reason: Error) => setError(reason.message));
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800">
        <strong>Stock actions unavailable:</strong> {error} You can still browse the app.
      </div>
    );
  }

  if (!status) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
        Checking stock access…
      </div>
    );
  }

  if (status.state === "blocked") {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs leading-relaxed text-rose-800 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-200">
        <strong>Stock actions unavailable here.</strong> Coinbase Tokenized Stocks are for eligible non-US users. You can still browse official assets and read the docs.
      </div>
    );
  }

  if (status.state === "pending") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200">
        <strong>Eligibility pending.</strong> We could not verify this connection yet. Stock actions stay disabled until your non-US eligibility is confirmed.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200">
      <strong>Eligibility confirmed for this connection.</strong> A separate manual Base registry approval may still be required before stock actions unlock. Coinbase issues the tokens; Base is the network.
    </div>
  );
}
