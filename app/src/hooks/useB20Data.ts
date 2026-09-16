"use client";

import { useReadContract, useAccount } from "wagmi";
import { formatUnits } from "viem";
import { B20_ABI, CHAINLINK_FEED_ABI, OFFICIAL_TOKENS } from "../config/contracts";
import { useLiveMarket } from "./useLiveMarket";

export function useB20Data(tokenAddress: `0x${string}`) {
  const { address: userAddress } = useAccount();
  const { marketData } = useLiveMarket();

  const tokenMeta = OFFICIAL_TOKENS.find(
    (t) => t.address.toLowerCase() === tokenAddress.toLowerCase()
  ) || OFFICIAL_TOKENS[0];

  // 1. Read live Multiplier from token
  const {
    data: rawMultiplier,
    isLoading: isMultiplierLoading,
    error: multiplierError,
    refetch: refetchMultiplier,
  } = useReadContract({
    address: tokenAddress,
    abi: B20_ABI,
    functionName: "multiplier",
  });

  // 2. Read live Chainlink total-return feed
  const {
    data: feedData,
    isLoading: isFeedLoading,
    error: feedError,
    refetch: refetchFeed,
  } = useReadContract({
    address: tokenMeta.feed,
    abi: CHAINLINK_FEED_ABI,
    functionName: "latestRoundData",
    query: {
      enabled: !!tokenMeta.feed,
    },
  });

  // 3. Read live wallet balance
  const {
    data: userRawBalance,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
  } = useReadContract({
    address: tokenAddress,
    abi: B20_ABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  // Math formatting
  // Multiplier is in WAD 1e18
  const multiplierVal = rawMultiplier !== undefined ? Number(rawMultiplier) / 1e18 : 1.0;
  const formattedMultiplier = multiplierVal !== null && Number.isFinite(multiplierVal)
    ? `${multiplierVal.toFixed(4)}x`
    : "1.0000x";

  // Chainlink price is 8 decimals, with Aerodrome DEX fallback for tokens without dedicated feeds
  const feedUpdatedAt = feedData ? feedData[3] : null;
  const feedIsFresh =
    feedUpdatedAt !== null &&
    feedUpdatedAt > BigInt(Math.floor(Date.now() / 1000) - 24 * 60 * 60);
  const rawPrice = feedData && feedData[1] > BigInt(0) && feedIsFresh ? feedData[1] : null;
  const feedPriceVal = rawPrice !== null ? Number(rawPrice) / 1e8 : null;

  const ticker = tokenMeta.symbol.replace(/c$/, "");
  const dexPrice = marketData?.[ticker]?.price ?? null;
  const priceVal = feedPriceVal ?? dexPrice;
  const formattedPrice = priceVal ? `$${priceVal.toFixed(2)}` : "—";

  // User formatted balance
  const balanceVal = userRawBalance
    ? Number(formatUnits(userRawBalance, tokenMeta.decimals))
    : 0;

  // shareEquivalent = raw * multiplier / 1e18
  const rawBig = userRawBalance || BigInt(0);
  const shareEquivalent = rawMultiplier === undefined
    ? balanceVal
    : Number(formatUnits((rawBig * rawMultiplier) / BigInt(1e18), tokenMeta.decimals));

  // usd = priceVal * shareEquivalent
  const usdVal = priceVal !== null && shareEquivalent !== null ? priceVal * shareEquivalent : null;
  const formattedUsd = usdVal !== null ? `$${usdVal.toFixed(2)}` : "—";

  return {
    tokenMeta,
    rawMultiplier,
    multiplierVal,
    formattedMultiplier,
    rawPrice,
    priceVal,
    formattedPrice,
    userRawBalance,
    balanceVal,
    formattedBalance: balanceVal > 0 ? balanceVal.toFixed(4) : "0.00",
    shareEquivalent,
    usdVal,
    formattedUsd,
    isLoading: isMultiplierLoading || isFeedLoading || isBalanceLoading,
    hasError: !!multiplierError || !!feedError || (!!feedData && !feedIsFresh),
    refetchAll: () => {
      refetchMultiplier();
      refetchFeed();
      refetchBalance();
    },
  };
}
