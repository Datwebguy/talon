"use client";

import { useState } from "react";
import { useAccount, useReadContract, usePublicClient, useWalletClient } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import {
  VAULT_ABI,
  B20_ABI,
  CLAIM_TOKEN_ABI,
  FACTORY_ADDRESS,
  FACTORY_ABI,
  AAPLC_VAULT_ADDRESS,
  AAPLC_CLIP_ADDRESS,
  AAPLC_TALON_ADDRESS,
  OFFICIAL_TOKENS,
  ELIGIBILITY_ENFORCED_DEPLOYMENT,
  ELIGIBILITY_REGISTRY_ADDRESS,
  ELIGIBILITY_REGISTRY_ABI,
} from "../config/contracts";
import { checkEligibility } from "../lib/eligibility";

export function useVault(underlyingAddress: `0x${string}`, decimals: number = 8) {
  const { address: userAddress, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const { data: onchainEligibility, isLoading: isEligibilityLoading, refetch: refetchEligibility } = useReadContract({
    address: ELIGIBILITY_REGISTRY_ADDRESS,
    abi: ELIGIBILITY_REGISTRY_ABI,
    functionName: "isEligible",
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress && chainId === 8453 },
  });

  const [isTransacting, setIsTransacting] = useState(false);
  const [simulationError, setSimulationError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const isAapl = underlyingAddress.toLowerCase() === OFFICIAL_TOKENS[0].address.toLowerCase();

  // Read vault address from factory
  const { data: vaultAddressData } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: "getVault",
    args: [underlyingAddress],
  });

  const vaultAddress = (vaultAddressData && vaultAddressData !== "0x0000000000000000000000000000000000000000")
    ? (vaultAddressData as `0x${string}`)
    : (isAapl ? AAPLC_VAULT_ADDRESS : undefined);

  const isVaultDeployed = !!vaultAddress && vaultAddress !== "0x0000000000000000000000000000000000000000";

  // Read clip and talon token addresses
  const { data: clipAddressData } = useReadContract({
    address: isVaultDeployed ? vaultAddress : undefined,
    abi: VAULT_ABI,
    functionName: "clipToken",
    query: { enabled: isVaultDeployed },
  });

  const { data: talonAddressData } = useReadContract({
    address: isVaultDeployed ? vaultAddress : undefined,
    abi: VAULT_ABI,
    functionName: "talonToken",
    query: { enabled: isVaultDeployed },
  });

  const clipAddress = (clipAddressData && clipAddressData !== "0x0000000000000000000000000000000000000000")
    ? (clipAddressData as `0x${string}`)
    : (isAapl ? AAPLC_CLIP_ADDRESS : undefined);

  const talonAddress = (talonAddressData && talonAddressData !== "0x0000000000000000000000000000000000000000")
    ? (talonAddressData as `0x${string}`)
    : (isAapl ? AAPLC_TALON_ADDRESS : undefined);

  // Read user Clip balance
  const { data: clipBalanceRaw, refetch: refetchClip } = useReadContract({
    address: clipAddress,
    abi: CLAIM_TOKEN_ABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!clipAddress && !!userAddress },
  });

  // Read user Talon balance
  const { data: talonBalanceRaw, refetch: refetchTalon } = useReadContract({
    address: talonAddress,
    abi: CLAIM_TOKEN_ABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!talonAddress && !!userAddress },
  });

  // Read user entry index on Clip
  const { data: userClipIndexRaw } = useReadContract({
    address: clipAddress,
    abi: CLAIM_TOKEN_ABI,
    functionName: "userIndex",
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!clipAddress && !!userAddress },
  });

  // Allowance check for underlying B20
  const { data: underlyingAllowance, refetch: refetchAllowance } = useReadContract({
    address: underlyingAddress,
    abi: B20_ABI,
    functionName: "allowance",
    args: userAddress && vaultAddress ? [userAddress, vaultAddress] : undefined,
    query: { enabled: !!userAddress && isVaultDeployed },
  });

  const clipBalance = clipBalanceRaw ? Number(formatUnits(clipBalanceRaw, decimals)) : 0;
  const talonBalance = talonBalanceRaw ? Number(formatUnits(talonBalanceRaw, decimals)) : 0;
  const userClipIndex = userClipIndexRaw ? Number(userClipIndexRaw) / 1e18 : null;

  const [stepText, setStepText] = useState<string | null>(null);

  // Execute Tear with pre-simulation and direct write fallback
  const executeTear = async (amountInput: string) => {
    if (!walletClient || !publicClient || !userAddress || !vaultAddress) {
      throw new Error("Wallet not connected or vault contract not available");
    }

    setSimulationError(null);
    setTxHash(null);
    setIsTransacting(true);
    setStepText(null);

    try {
      if (!ELIGIBILITY_ENFORCED_DEPLOYMENT) throw new Error("Protocol upgrade pending: use the eligibility-enforced Base deployment.");
      if (chainId !== 8453) throw new Error("Switch your wallet to Base Mainnet before transacting.");
      await checkEligibility();
      if (isEligibilityLoading) throw new Error("Checking Base eligibility. Please try again in a moment.");
      const eligibility = await refetchEligibility();
      if (eligibility.data !== true) throw new Error("This wallet is not registered for stock actions on Base. Eligibility must be verified before trading.");
      const rawAmount = parseUnits(amountInput, decimals);

      // 1. Check & handle allowance
      const currentAllowance = underlyingAllowance || BigInt(0);
      if (currentAllowance < rawAmount) {
        setStepText("Step 1/2: Please approve AAPLc in your wallet...");
        const approveAmount = rawAmount;
        let approveHash: `0x${string}`;
        try {
          const approveSim = await publicClient.simulateContract({
            account: userAddress,
            address: underlyingAddress,
            abi: B20_ABI,
            functionName: "approve",
            args: [vaultAddress, approveAmount],
          });
          approveHash = await walletClient.writeContract(approveSim.request);
        } catch {
          approveHash = await walletClient.writeContract({
            address: underlyingAddress,
            abi: B20_ABI,
            functionName: "approve",
            args: [vaultAddress, approveAmount],
          });
        }
        setStepText("Step 1/2: Confirming AAPLc approval on Base...");
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
        await refetchAllowance();
      }

      // 2. Dispatch tear transaction
      setStepText("Step 2/2: Please confirm the deposit in your wallet...");
      let hash: `0x${string}`;
      try {
        const { request } = await publicClient.simulateContract({
          account: userAddress,
          address: vaultAddress,
          abi: VAULT_ABI,
          functionName: "tear",
          args: [rawAmount],
        });
        hash = await walletClient.writeContract(request);
      } catch {
        hash = await walletClient.writeContract({
          address: vaultAddress,
          abi: VAULT_ABI,
          functionName: "tear",
          args: [rawAmount],
        });
      }

      setStepText("Confirming deposit on Base...");
      setTxHash(hash);
      await publicClient.waitForTransactionReceipt({ hash });

      refetchClip();
      refetchTalon();
      setStepText(null);
      return hash;
    } catch (err: any) {
      console.error("Vault deposit error:", err);
      let humanMsg = "Transaction failed";
      if (
        err?.message?.includes("User rejected") ||
        err?.name === "UserRejectedRequestError"
      ) {
        humanMsg = "Request was cancelled in your wallet. Click to try again.";
      } else if (
        err?.message?.includes("insufficient funds") ||
        err?.message?.includes("exceeds the balance")
      ) {
        humanMsg = "Insufficient Base ETH for network gas fee. Please add a small amount of ETH on Base.";
      } else if (err?.message?.includes("TransferFailed")) {
        humanMsg = "Transfer failed onchain. Please check your AAPLc balance.";
      } else {
        humanMsg = err?.shortMessage || err?.message || "Transaction failed";
      }
      setSimulationError(humanMsg);
      setStepText(null);
      throw new Error(humanMsg);
    } finally {
      setIsTransacting(false);
    }
  };

  // Execute Join with pre-simulation and direct write fallback
  const executeJoin = async (amountInput: string) => {
    if (!walletClient || !publicClient || !userAddress || !vaultAddress) {
      throw new Error("Wallet not connected or vault contract not available");
    }

    setSimulationError(null);
    setTxHash(null);
    setIsTransacting(true);
    setStepText("Please confirm recombine in your wallet...");

    try {
      if (!ELIGIBILITY_ENFORCED_DEPLOYMENT) throw new Error("Protocol upgrade pending: use the eligibility-enforced Base deployment.");
      if (chainId !== 8453) throw new Error("Switch your wallet to Base Mainnet before transacting.");
      await checkEligibility();
      if (isEligibilityLoading) throw new Error("Checking Base eligibility. Please try again in a moment.");
      const eligibility = await refetchEligibility();
      if (eligibility.data !== true) throw new Error("This wallet is not registered for stock actions on Base. Eligibility must be verified before trading.");
      const rawAmount = parseUnits(amountInput, decimals);

      let hash: `0x${string}`;
      try {
        const { request } = await publicClient.simulateContract({
          account: userAddress,
          address: vaultAddress,
          abi: VAULT_ABI,
          functionName: "join",
          args: [rawAmount],
        });
        hash = await walletClient.writeContract(request);
      } catch {
        hash = await walletClient.writeContract({
          address: vaultAddress,
          abi: VAULT_ABI,
          functionName: "join",
          args: [rawAmount],
        });
      }

      setStepText("Confirming recombine on Base...");
      setTxHash(hash);
      await publicClient.waitForTransactionReceipt({ hash });

      refetchClip();
      refetchTalon();
      setStepText(null);
      return hash;
    } catch (err: any) {
      console.error("Vault recombine error:", err);
      let humanMsg = "Recombine transaction failed";
      if (
        err?.message?.includes("User rejected") ||
        err?.name === "UserRejectedRequestError"
      ) {
        humanMsg = "Request was cancelled in your wallet. Click to try again.";
      } else if (err?.message?.includes("insufficient funds")) {
        humanMsg = "Insufficient Base ETH for network gas fee.";
      } else {
        humanMsg = err?.shortMessage || err?.message || "Recombine transaction failed";
      }
      setSimulationError(humanMsg);
      setStepText(null);
      throw new Error(humanMsg);
    } finally {
      setIsTransacting(false);
    }
  };

  return {
    vaultAddress,
    isVaultDeployed,
    clipAddress,
    talonAddress,
    clipBalance,
    talonBalance,
    clipBalanceRaw,
    talonBalanceRaw,
    userClipIndex,
    isTransacting,
    simulationError,
    tear: executeTear,
    join: executeJoin,
    isTearing: isTransacting,
    isJoining: isTransacting,
    tearSuccess: !!txHash,
    joinSuccess: !!txHash,
    txHash,
    stepText,
    error: simulationError,
    clearError: () => setSimulationError(null),
    executeTear,
    executeJoin,
    onchainEligibility: onchainEligibility === true,
    isEligibilityLoading,
  };
}
