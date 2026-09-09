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

const privateKey = process.env.ELIGIBILITY_OPERATOR_PRIVATE_KEY;
const target = process.env.ELIGIBILITY_ACCOUNT;
const factoryAddress = process.env.FACTORY_ADDRESS;
if (!privateKey || !target || !factoryAddress) {
  throw new Error("Set ELIGIBILITY_OPERATOR_PRIVATE_KEY, ELIGIBILITY_ACCOUNT, and FACTORY_ADDRESS in the local operator environment.");
}

const account = privateKeyToAccount(privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`);
const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org") });
const wallet = createWalletClient({ account, chain: base, transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org") });
const abi = parseAbi(["function eligibilityOperator() view returns (address)", "function setEligible(address account, bool eligible)"]);
const operator = await client.readContract({ address: factoryAddress, abi, functionName: "eligibilityOperator" });
if (operator.toLowerCase() !== account.address.toLowerCase()) {
  throw new Error("Operator wallet is not the configured eligibility operator.");
}

const nonce = await client.getTransactionCount({ address: account.address, blockTag: "pending" });
const hash = await wallet.writeContract({ address: factoryAddress, abi, functionName: "setEligible", args: [target, true], nonce });
await client.waitForTransactionReceipt({ hash });
console.log(`Eligibility approved for ${target}: https://basescan.org/tx/${hash}`);
