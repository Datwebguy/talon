"use client";

import { useState, useEffect } from "react";

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  formattedPrice: string;
  changePercent: number | null;
  formattedChange: string | null;
  history: number[];
  timestamps: number[];
  source: "aerodrome";
}

export function useLiveMarket() {
  const [marketData, setMarketData] = useState<Record<string, StockQuote> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let retryTimer: number | undefined;

    async function fetchMarket() {
      const controller = new AbortController();
      // Public DEX indexers can take several seconds on a cold request while
      // they discover the deepest pool and load its candles.
      const timeout = window.setTimeout(() => controller.abort(), 30000);
      try {
        const res = await fetch(`/api/market-data?ts=${Date.now()}`, {
          signal: controller.signal,
          cache: "no-store",
          headers: { "cache-control": "no-cache" },
        });
        const json = await res.json();
        if (isMounted) {
          if (
            json.success &&
            json.data &&
            Object.keys(json.data).length > 0
          ) {
            setMarketData(json.data);
            setError(null);
            window.clearTimeout(retryTimer);
          } else {
            retryTimer = window.setTimeout(fetchMarket, 2000);
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Live market data is unavailable");
          setIsLoading(false);
          retryTimer = window.setTimeout(fetchMarket, 2000);
        }
      } finally {
        window.clearTimeout(timeout);
      }
    }

    fetchMarket();
    const interval = setInterval(fetchMarket, 30000); // Poll every 30s
    return () => {
      isMounted = false;
      clearInterval(interval);
      window.clearTimeout(retryTimer);
    };
  }, []);

  return { marketData, isLoading, error };
}
