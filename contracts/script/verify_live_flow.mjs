import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createPublicClient, createWalletClient, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...value] = trimmed.split("=");
      process.env[key.trim()] ||= value.join("=").trim();
    }
  }
}

const requireValue = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`Set ${key} in contracts/.env before running a live flow.`);
  return value;
};

const factoryAddress = requireValue("FACTORY_ADDRESS");
const recipient = requireValue("GIFT_RECIPIENT_ADDRESS");
const rawAmount = BigInt(requireValue("LIVE_FLOW_RAW_AMOUNT"));
const resumeAfterTear = process.env.LIVE_FLOW_RESUME === "true";
const skipGift = process.env.LIVE_FLOW_SKIP_GIFT === "true";
const testKey = requireValue("TEST_WALLET_PRIVATE_KEY");
const testAccount = privateKeyToAccount(testKey.startsWith("0x") ? testKey : `0x${testKey}`);
const rpcUrl = process.env.BASE_RPC_URL || "https://mainnet.base.org";
const publicClient = createPublicClient({ chain: base, transport: http(rpcUrl) });
const receiptClient = rpcUrl === "https://mainnet.base.org"
  ? publicClient
  : createPublicClient({ chain: base, transport: http("https://mainnet.base.org") });
const wallet = createWalletClient({ account: testAccount, chain: base, transport: http(rpcUrl) });
let nextNonce = await publicClient.getTransactionCount({ address: testAccount.address, blockTag: "pending" });

const factoryAbi = parseAbi([
  "function eligibilityRegistry() view returns (address)",
  "function getVault(address) view returns (address)",
]);
const registryAbi = parseAbi(["function isEligible(address) view returns (bool)"]);
const vaultAbi = parseAbi([
  "function clipToken() view returns (address)",
  "function talonToken() view returns (address)",
  "function tear(uint256 rawAmount)",
  "function join(uint256 rawAmount)",
]);
const erc20Abi = parseAbi([
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address,address) view returns (uint256)",
  "function approve(address,uint256) returns (bool)",
  "function transfer(address,uint256) returns (bool)",
]);
const aaplc = "0xb200000000000000000000C2e324d24d7eEcd1fb";

async function submit(request) {
  const hash = await wallet.writeContract({ ...request, nonce: nextNonce++ });
  const receipt = await receiptClient.waitForTransactionReceipt({ hash });
  if (receipt.status !== "success") throw new Error(`Transaction failed: ${hash}`);
  console.log(`https://basescan.org/tx/${hash}`);
  return receipt;
}

async function main() {
  if (rawAmount <= 0n) throw new Error("LIVE_FLOW_RAW_AMOUNT must be greater than zero.");
  const registry = await publicClient.readContract({ address: factoryAddress, abi: factoryAbi, functionName: "eligibilityRegistry" });
  const [testEligible, recipientEligible] = await Promise.all([
    publicClient.readContract({ address: registry, abi: registryAbi, functionName: "isEligible", args: [testAccount.address] }),
    publicClient.readContract({ address: registry, abi: registryAbi, functionName: "isEligible", args: [recipient] }),
  ]);
  if (!testEligible || !recipientEligible) throw new Error("Both the test wallet and gift recipient must be explicitly approved first.");

  const vault = await publicClient.readContract({ address: factoryAddress, abi: factoryAbi, functionName: "getVault", args: [aaplc] });
  if (vault === "0x0000000000000000000000000000000000000000") throw new Error("AAPLc vault is not deployed.");
  const [clip, talon, underlyingBalance] = await Promise.all([
    publicClient.readContract({ address: vault, abi: vaultAbi, functionName: "clipToken" }),
    publicClient.readContract({ address: vault, abi: vaultAbi, functionName: "talonToken" }),
    publicClient.readContract({ address: aaplc, abi: erc20Abi, functionName: "balanceOf", args: [testAccount.address] }),
  ]);
  const tearAmount = rawAmount * 2n;
  if (!resumeAfterTear) {
    if (underlyingBalance < tearAmount) throw new Error("Test wallet needs at least 2 × LIVE_FLOW_RAW_AMOUNT of AAPLc.");
    const allowance = await publicClient.readContract({ address: aaplc, abi: erc20Abi, functionName: "allowance", args: [testAccount.address, vault] });
    if (allowance < tearAmount) {
      console.log("Approve AAPLc → vault");
      await submit({ address: aaplc, abi: erc20Abi, functionName: "approve", args: [vault, tearAmount] });
    }
    console.log("Tear AAPLc → Clip + Talon");
    await submit({ address: vault, abi: vaultAbi, functionName: "tear", args: [tearAmount] });
  } else {
    const [clipBalance, talonBalance] = await Promise.all([
      publicClient.readContract({ address: clip, abi: erc20Abi, functionName: "balanceOf", args: [testAccount.address] }),
      publicClient.readContract({ address: talon, abi: erc20Abi, functionName: "balanceOf", args: [testAccount.address] }),
    ]);
    if (clipBalance < rawAmount || talonBalance < rawAmount) throw new Error("Cannot resume: the test wallet does not hold a matched Clip + Talon pair.");
    console.log("Resuming after confirmed tear");
  }
  if (!skipGift) {
    console.log("Gift Clip to the separately eligible recipient");
    await submit({ address: clip, abi: erc20Abi, functionName: "transfer", args: [recipient, rawAmount] });
  } else {
    const recipientClip = await publicClient.readContract({ address: clip, abi: erc20Abi, functionName: "balanceOf", args: [recipient] });
    if (recipientClip < rawAmount) throw new Error("Cannot skip gift: recipient does not hold the expected Clip amount.");
    console.log("Gift already confirmed onchain");
  }
  console.log("Recombine the remaining Clip + Talon → AAPLc");
  await submit({ address: vault, abi: vaultAbi, functionName: "join", args: [rawAmount] });

  const [recipientClip, finalUnderlying] = await Promise.all([
    publicClient.readContract({ address: clip, abi: erc20Abi, functionName: "balanceOf", args: [recipient] }),
    publicClient.readContract({ address: aaplc, abi: erc20Abi, functionName: "balanceOf", args: [testAccount.address] }),
  ]);
  if (recipientClip < rawAmount) throw new Error("Gift verification failed: recipient did not receive Clip.");
  console.log(`Verified: recipient holds Clip; test wallet recombined one matched pair. Final AAPLc raw balance: ${finalUnderlying}`);
}

main().catch((error) => {
  console.error(`LIVE FLOW FAILED: ${error.message}`);
  process.exit(1);
});
