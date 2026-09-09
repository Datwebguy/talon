import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env if present
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [k, ...v] = trimmed.split("=");
      process.env[k.trim()] = v.join("=").trim();
    }
  }
}

const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
if (!privateKey) {
  console.error("ERROR: DEPLOYER_PRIVATE_KEY is not set in contracts/.env.");
  process.exit(1);
}

const account = privateKeyToAccount(privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`);
const rpcUrl = process.env.BASE_RPC_URL || "https://mainnet.base.org";

const publicClient = createPublicClient({
  chain: base,
  transport: http(rpcUrl),
});

const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(rpcUrl),
});

const AAPLC = "0xb200000000000000000000C2e324d24d7eEcd1fb";

async function main() {
  console.log(`Deployer address: ${account.address}`);
  const ethBal = await publicClient.getBalance({ address: account.address });
  console.log(`Deployer ETH balance: ${Number(ethBal) / 1e18} ETH`);

  // 1. Deploy TalonFactory
  console.log("\n--- Step 1: Deploying TalonFactory ---");
  const factoryArtifactPath = path.resolve(__dirname, "../out/TalonFactory.sol/TalonFactory.json");
  const factoryArtifact = JSON.parse(fs.readFileSync(factoryArtifactPath, "utf8"));
  
  let factoryAddress = process.env.FACTORY_ADDRESS_OVERRIDE;
  if (!factoryAddress) {
    const deployHash = await walletClient.deployContract({
      abi: factoryArtifact.abi,
      bytecode: factoryArtifact.bytecode.object,
    });
    console.log(`Deploy tx submitted: ${deployHash}`);
    const deployReceipt = await publicClient.waitForTransactionReceipt({ hash: deployHash });
    factoryAddress = deployReceipt.contractAddress;
    console.log(`SUCCESS: TalonFactory deployed at: ${factoryAddress}`);
  } else {
    console.log(`Resuming existing TalonFactory at: ${factoryAddress}`);
  }

  // Base public RPCs can briefly serve a stale account nonce immediately after
  // a deployment. Pin sequential nonces for the remaining setup transactions.
  let nextNonce = await publicClient.getTransactionCount({
    address: account.address,
    blockTag: "pending",
  });

  const registryAddress = await publicClient.readContract({
    address: factoryAddress,
    abi: factoryArtifact.abi,
    functionName: "eligibilityRegistry",
  });
  console.log(`EligibilityRegistry address: ${registryAddress}`);

  const eligibilityOperator = process.env.ELIGIBILITY_OPERATOR_ADDRESS;
  if (!eligibilityOperator) {
    throw new Error("Set ELIGIBILITY_OPERATOR_ADDRESS to a dedicated non-deployer wallet before a live deployment.");
  }
  if (eligibilityOperator.toLowerCase() === account.address.toLowerCase()) {
    throw new Error("ELIGIBILITY_OPERATOR_ADDRESS must be separate from the deployer wallet.");
  }
  const currentOperator = await publicClient.readContract({
    address: factoryAddress,
    abi: factoryArtifact.abi,
    functionName: "eligibilityOperator",
  });
  if (currentOperator.toLowerCase() !== eligibilityOperator.toLowerCase()) {
    const setOperatorHash = await walletClient.writeContract({
      address: factoryAddress,
      abi: factoryArtifact.abi,
      functionName: "setEligibilityOperator",
      args: [eligibilityOperator],
      nonce: nextNonce++,
    });
    await publicClient.waitForTransactionReceipt({ hash: setOperatorHash });
    console.log(`Eligibility operator configured: ${eligibilityOperator}`);
  } else {
    console.log(`Eligibility operator already configured: ${eligibilityOperator}`);
  }

  // 2. Call createVault(AAPLc)
  console.log("\n--- Step 2: Creating AAPLc Vault via TalonFactory ---");
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  const readVault = async () => publicClient.readContract({
    address: factoryAddress,
    abi: factoryArtifact.abi,
    functionName: "getVault",
    args: [AAPLC],
  });
  let vaultAddress = await readVault();
  if (vaultAddress === zeroAddress) {
    const createVaultHash = await walletClient.writeContract({
      address: factoryAddress,
      abi: factoryArtifact.abi,
      functionName: "createVault",
      args: [AAPLC],
      nonce: nextNonce++,
    });
    console.log(`createVault tx submitted: ${createVaultHash}`);
    const createVaultReceipt = await publicClient.waitForTransactionReceipt({ hash: createVaultHash });
    console.log(`SUCCESS: createVault confirmed in block: ${createVaultReceipt.blockNumber}`);
    for (let attempt = 0; attempt < 10 && vaultAddress === zeroAddress; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      vaultAddress = await readVault();
    }
  } else {
    console.log(`AAPLc vault already exists: ${vaultAddress}`);
  }
  if (vaultAddress === zeroAddress) throw new Error("AAPLc vault transaction was mined, but its address is not yet available from the RPC.");

  // 3. Read deployed addresses
  console.log(`TalonVault (AAPLc) address: ${vaultAddress}`);

  const vaultArtifactPath = path.resolve(__dirname, "../out/TalonVault.sol/TalonVault.json");
  const vaultArtifact = JSON.parse(fs.readFileSync(vaultArtifactPath, "utf8"));

  const clipAddress = await publicClient.readContract({
    address: vaultAddress,
    abi: vaultArtifact.abi,
    functionName: "clipToken",
  });
  const talonAddress = await publicClient.readContract({
    address: vaultAddress,
    abi: vaultArtifact.abi,
    functionName: "talonToken",
  });

  console.log(`ClipToken address: ${clipAddress}`);
  console.log(`TalonToken address: ${talonAddress}`);

  // 4. Update contracts.ts and memory.md
  console.log("\n--- Step 3: Updating frontend contracts.ts & memory.md ---");
  const contractsTsPath = path.resolve(__dirname, "../../app/src/config/contracts.ts");
  let contractsTs = fs.readFileSync(contractsTsPath, "utf8");
  contractsTs = contractsTs.replace(
    /export const FACTORY_ADDRESS = "0x[a-fA-F0-9]{40}"/,
    `export const FACTORY_ADDRESS = "${factoryAddress}"`
  );
  contractsTs = contractsTs.replace(
    /export const ELIGIBILITY_REGISTRY_ADDRESS = "0x[a-fA-F0-9]{40}"/,
    `export const ELIGIBILITY_REGISTRY_ADDRESS = "${registryAddress}"`
  );
  contractsTs = contractsTs.replace(
    /export const AAPLC_VAULT_ADDRESS = "0x[a-fA-F0-9]{40}"/,
    `export const AAPLC_VAULT_ADDRESS = "${vaultAddress}"`
  );
  contractsTs = contractsTs.replace(
    /export const AAPLC_CLIP_ADDRESS = "0x[a-fA-F0-9]{40}"/,
    `export const AAPLC_CLIP_ADDRESS = "${clipAddress}"`
  );
  contractsTs = contractsTs.replace(
    /export const AAPLC_TALON_ADDRESS = "0x[a-fA-F0-9]{40}"/,
    `export const AAPLC_TALON_ADDRESS = "${talonAddress}"`
  );
  contractsTs = contractsTs.replace(
    /export const ELIGIBILITY_ENFORCED_DEPLOYMENT = (true|false)/,
    "export const ELIGIBILITY_ENFORCED_DEPLOYMENT = true"
  );
  fs.writeFileSync(contractsTsPath, contractsTs, "utf8");

  console.log("Factory deployment complete. Use the separate operator script to approve test wallets, then run the explicit live-flow verifier.");
}

main().catch((err) => {
  console.error("FATAL EXECUTION ERROR:", err);
  process.exit(1);
});
