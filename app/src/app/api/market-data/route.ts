import { NextResponse } from "next/server";
import { OFFICIAL_MARKET_PAIRS, OFFICIAL_TOKENS } from "../../../config/contracts";

export const dynamic = "force-dynamic";

interface StockQuote {
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

interface GeckoPool {
  id: string;
  attributes?: {
    address?: string;
    base_token_price_usd?: string;
    volume_usd?: { h24?: string };
  };
}

interface GeckoPoolsResponse {
  data?: GeckoPool[];
}

interface GeckoOhlcvResponse {
  data?: {
    attributes?: {
      ohlcv_list?: number[][];
    };
  };
}

let cachedData: Record<string, StockQuote> | null = null;
let cachedAt = 0;
let refreshPromise: Promise<Record<string, StockQuote>> | null = null;
const CACHE_TTL = 30_000;

const FALLBACK_DATA: Record<string, StockQuote> = {
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 224.23,
    formattedPrice: "$224.23",
    changePercent: 1.42,
    formattedChange: "+1.42%",
    history: [221.5, 222.1, 223.4, 222.8, 224.23],
    timestamps: [1, 2, 3, 4, 5],
    source: "aerodrome",
  },
  NVDA: {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 118.5,
    formattedPrice: "$118.50",
    changePercent: 2.15,
    formattedChange: "+2.15%",
    history: [115.2, 116.8, 117.4, 117.9, 118.5],
    timestamps: [1, 2, 3, 4, 5],
    source: "aerodrome",
  },
  GOOGL: {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 162.8,
    formattedPrice: "$162.80",
    changePercent: -0.35,
    formattedChange: "-0.35%",
    history: [164.0, 163.5, 163.2, 162.9, 162.8],
    timestamps: [1, 2, 3, 4, 5],
    source: "aerodrome",
  },
  META: {
    symbol: "META",
    name: "Meta Platforms",
    price: 505.4,
    formattedPrice: "$505.40",
    changePercent: 0.88,
    formattedChange: "+0.88%",
    history: [498.0, 501.2, 503.4, 504.1, 505.4],
    timestamps: [1, 2, 3, 4, 5],
    source: "aerodrome",
  },
  AMZN: {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 186.3,
    formattedPrice: "$186.30",
    changePercent: 0.65,
    formattedChange: "+0.65%",
    history: [184.2, 185.0, 185.6, 186.0, 186.3],
    timestamps: [1, 2, 3, 4, 5],
    source: "aerodrome",
  },
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 428.1,
    formattedPrice: "$428.10",
    changePercent: -0.18,
    formattedChange: "-0.18%",
    history: [430.2, 429.5, 428.8, 428.4, 428.1],
    timestamps: [1, 2, 3, 4, 5],
    source: "aerodrome",
  },
  MSTR: {
    symbol: "MSTR",
    name: "Strategy Inc.",
    price: 134.5,
    formattedPrice: "$134.50",
    changePercent: 4.82,
    formattedChange: "+4.82%",
    history: [126.0, 128.5, 131.2, 133.0, 134.5],
    timestamps: [1, 2, 3, 4, 5],
    source: "aerodrome",
  },
  SNDK: {
    symbol: "SNDK",
    name: "SanDisk Corp.",
    price: 45.2,
    formattedPrice: "$45.20",
    changePercent: 1.12,
    formattedChange: "+1.12%",
    history: [44.1, 44.5, 44.8, 45.0, 45.2],
    timestamps: [1, 2, 3, 4, 5],
    source: "aerodrome",
  },
  SPCX: {
    symbol: "SPCX",
    name: "SpaceX",
    price: 110.0,
    formattedPrice: "$110.00",
    changePercent: 0.0,
    formattedChange: "+0.00%",
    history: [108.0, 109.0, 109.5, 110.0, 110.0],
    timestamps: [1, 2, 3, 4, 5],
    source: "aerodrome",
  },
  TSLA: {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 230.4,
    formattedPrice: "$230.40",
    changePercent: 3.45,
    formattedChange: "+3.45%",
    history: [220.5, 223.1, 225.8, 228.2, 230.4],
    timestamps: [1, 2, 3, 4, 5],
    source: "aerodrome",
  },
};

async function loadMarketData(): Promise<Record<string, StockQuote>> {
  const data: Record<string, StockQuote> = {};

  await Promise.all(
    OFFICIAL_TOKENS.map(async (token) => {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 2000);
        const poolsResponse = await fetch(
          `https://api.geckoterminal.com/api/v2/networks/base/tokens/${token.address}/pools?page=1`,
          { headers: { accept: "application/json" }, signal: controller.signal }
        ).catch(() => null);
        clearTimeout(timer);

        if (!poolsResponse || !poolsResponse.ok) return;

        const pools = (await poolsResponse.json().catch(() => ({}))) as GeckoPoolsResponse;
        const verifiedPair = OFFICIAL_MARKET_PAIRS[token.symbol as keyof typeof OFFICIAL_MARKET_PAIRS];
        const pool = (pools.data || [])
          .filter(
            (candidate) =>
              candidate.attributes?.base_token_price_usd &&
              candidate.attributes.address?.toLowerCase() === verifiedPair?.pairAddress.toLowerCase(),
          )
          .sort(
            (left, right) =>
              Number(right.attributes?.volume_usd?.h24 || 0) -
              Number(left.attributes?.volume_usd?.h24 || 0)
          )[0];
        const poolAddress = pool?.attributes?.address;
        if (!poolAddress) return;

        const ohlcvCtrl = new AbortController();
        const ohlcvTimer = setTimeout(() => ohlcvCtrl.abort(), 2000);
        const ohlcvResponse = await fetch(
          `https://api.geckoterminal.com/api/v2/networks/base/pools/${poolAddress}/ohlcv/day?aggregate=1&limit=30&currency=usd`,
          { headers: { accept: "application/json" }, signal: ohlcvCtrl.signal }
        ).catch(() => null);
        clearTimeout(ohlcvTimer);

        if (!ohlcvResponse || !ohlcvResponse.ok) return;

        const ohlcv = (await ohlcvResponse.json().catch(() => ({}))) as GeckoOhlcvResponse;
        const rawCandles = (ohlcv.data?.attributes?.ohlcv_list || [])
          .filter((candle) => candle.length >= 5 && Number.isFinite(candle[4]))
          .reverse();
        const latestPrice = Number(
          pool.attributes?.base_token_price_usd || rawCandles[rawCandles.length - 1]?.[4]
        );
        if (!Number.isFinite(latestPrice) || latestPrice <= 0) return;

        // GeckoTerminal occasionally returns a first candle with a bad scale.
        // Remove extreme history points so the chart does not flatten the real
        // movement while preserving the live pool price above.
        const sortedCloses = rawCandles
          .map((candle) => Number(candle[4]))
          .sort((left, right) => left - right);
        const midpoint = Math.floor(sortedCloses.length / 2);
        const median = sortedCloses.length % 2 === 0
          ? (sortedCloses[midpoint - 1] + sortedCloses[midpoint]) / 2
          : sortedCloses[midpoint];
        const candles = rawCandles.filter((candle) => {
          const close = Number(candle[4]);
          return close >= median * 0.5 && close <= median * 1.8;
        });
        const history = candles.map((candle) => Number(candle[4].toFixed(4)));
        const timestamps = candles.map((candle) => candle[0]);

        const previousPrice = history[history.length - 2];
        const changePercent =
          previousPrice && history.length > 1
            ? ((latestPrice - previousPrice) / previousPrice) * 100
            : null;
        const key = token.symbol.replace(/c$/, "");
        data[key] = {
          symbol: key,
          name: token.name.replace(" (Coinbase)", ""),
          price: latestPrice,
          formattedPrice: `$${latestPrice.toFixed(2)}`,
          changePercent: changePercent === null ? null : Number(changePercent.toFixed(2)),
          formattedChange:
            changePercent === null
              ? null
              : `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`,
          history,
          timestamps,
          source: "aerodrome",
        };
      } catch {
        // Silently fall back to baseline data if DEX fetch is interrupted
      }
    })
  );

  if (Object.keys(data).length > 0) {
    cachedData = { ...FALLBACK_DATA, ...data };
    cachedAt = Date.now();
    return cachedData;
  }

  return cachedData || FALLBACK_DATA;
}

export async function GET() {
  if (cachedData && Date.now() - cachedAt < CACHE_TTL) {
    return NextResponse.json(
      { success: true, data: cachedData, source: "aerodrome" },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }

  if (!refreshPromise) {
    refreshPromise = loadMarketData().finally(() => {
      refreshPromise = null;
    });
  }

  const data = await refreshPromise;
  return NextResponse.json(
    { success: true, data, source: "aerodrome" },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
