import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createWalletClient, createPublicClient, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from project root or app/.env if present
const envPaths = [
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, "../.env"),
  path.resolve(process.cwd(), ".env"),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf8");
    if (envContent.charCodeAt(0) === 0xfeff) {
      envContent = envContent.slice(1);
    }
    for (const line of envContent.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [k, ...v] = trimmed.split("=");
        let val = v.join("=").trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1).trim();
        }
        process.env[k.trim()] = val;
      }
    }
  }
}

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  console.error("ERROR: PRIVATE_KEY is not set in environment or .env file.");
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

function appendToMemory(entry) {
  const memoryPath = path.resolve(__dirname, "../../memory.md");
  let content = fs.readFileSync(memoryPath, "utf8");
  content += `\n${entry}\n`;
  fs.writeFileSync(memoryPath, content, "utf8");
}

async function main() {
  console.log(`Deployer address: ${account.address}`);
  const ethBal = await publicClient.getBalance({ address: account.address });
  console.log(`Deployer ETH balance: ${Number(ethBal) / 1e18} ETH`);

  if (ethBal === 0n) {
    console.error("ERROR: Deployer balance is 0 ETH on Base mainnet. Gas required.");
    process.exit(1);
  }

  // 1. Check or Deploy TalonFactory
  console.log("\n--- Step 1: Checking / Deploying TalonFactory ---");
  const factoryArtifactPath = path.resolve(__dirname, "../../contracts/out/TalonFactory.sol/TalonFactory.json");
  const factoryArtifact = JSON.parse(fs.readFileSync(factoryArtifactPath, "utf8"));
  
  const knownFactory = "0xbfd4479a49a1c1132edaa49d7b3fec911ffef9fd";
  const existingCode = await publicClient.getCode({ address: knownFactory });
  let factoryAddress;
  let deployHash;

  if (existingCode && existingCode !== "0x") {
    factoryAddress = knownFactory;
    deployHash = "0x4a78498ad2722726ecdf2448eec5a03b653037f312b6c9f46406a693f58f91b6";
    console.log(`SUCCESS: TalonFactory verified onchain at: ${factoryAddress}`);
  } else {
    const block = await publicClient.getBlock({ blockTag: "latest" });
    const maxFeePerGas = (block.baseFeePerGas ?? 5000000n) + 1500000n;
    const maxPriorityFeePerGas = 1000000n;
    deployHash = await walletClient.deployContract({
      abi: factoryArtifact.abi,
      bytecode: factoryArtifact.bytecode.object,
      maxFeePerGas,
      maxPriorityFeePerGas,
    });
    console.log(`Deploy tx submitted: ${deployHash}`);
    const deployReceipt = await publicClient.waitForTransactionReceipt({ hash: deployHash });
    factoryAddress = deployReceipt.contractAddress;
    console.log(`SUCCESS: TalonFactory deployed at: ${factoryAddress}`);
  }

  // 2. Call createVault(AAPLc) if not already created
  console.log("\n--- Step 2: Creating AAPLc Vault via TalonFactory ---");
  let vaultAddress = await publicClient.readContract({
    address: factoryAddress,
    abi: factoryArtifact.abi,
    functionName: "getVault",
    args: [AAPLC],
  });

  let createVaultHash = null;
  if (vaultAddress === "0x0000000000000000000000000000000000000000") {
    const block = await publicClient.getBlock({ blockTag: "latest" });
    const maxFeePerGas = (block.baseFeePerGas ?? 5000000n) + 1500000n;
    const maxPriorityFeePerGas = 1000000n;
    
    console.log("Submitting createVault(AAPLc)...");
    createVaultHash = await walletClient.writeContract({
      address: factoryAddress,
      abi: factoryArtifact.abi,
      functionName: "createVault",
      args: [AAPLC],
      maxFeePerGas,
      maxPriorityFeePerGas,
    });
    console.log(`createVault tx submitted: ${createVaultHash}`);
    const createVaultReceipt = await publicClient.waitForTransactionReceipt({ hash: createVaultHash });
    console.log(`SUCCESS: createVault confirmed in block: ${createVaultReceipt.blockNumber}`);

    vaultAddress = await publicClient.readContract({
      address: factoryAddress,
      abi: factoryArtifact.abi,
      functionName: "getVault",
      args: [AAPLC],
    });
  } else {
    console.log(`AAPLc vault already exists at: ${vaultAddress}`);
    if (!createVaultHash) {
      createVaultHash = "0x878e3d3262d67f9ff551ebf4f15ecd87715f99279c200144918bddb9c97e9426";
    }
  }

  console.log(`TalonVault (AAPLc) address: ${vaultAddress}`);

  const vaultArtifactPath = path.resolve(__dirname, "../../contracts/out/TalonVault.sol/TalonVault.json");
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

  // 4. Update contracts.ts
  console.log("\n--- Step 3: Updating frontend contracts.ts ---");
  const contractsTsPath = path.resolve(__dirname, "../src/config/contracts.ts");
  let contractsTs = fs.readFileSync(contractsTsPath, "utf8");
  contractsTs = contractsTs.replace(
    /export const FACTORY_ADDRESS = "0x[a-fA-F0-9]{40}"/,
    `export const FACTORY_ADDRESS = "${factoryAddress}"`
  );
  
  if (!contractsTs.includes("AAPLC_VAULT_ADDRESS")) {
    contractsTs = contractsTs.replace(
      `export const FACTORY_ADDRESS = "${factoryAddress}" as \`0x\${string}\`;`,
      `export const FACTORY_ADDRESS = "${factoryAddress}" as \`0x\${string}\`;\nexport const AAPLC_VAULT_ADDRESS = "${vaultAddress}" as \`0x\${string}\`;\nexport const AAPLC_CLIP_ADDRESS = "${clipAddress}" as \`0x\${string}\`;\nexport const AAPLC_TALON_ADDRESS = "${talonAddress}" as \`0x\${string}\`;\nexport const AAPLC_CREATE_VAULT_TX = "${createVaultHash || ""}" as \`0x\${string}\`;`
    );
  } else {
    contractsTs = contractsTs
      .replace(/export const AAPLC_VAULT_ADDRESS = "0x[a-fA-F0-9]*"/, `export const AAPLC_VAULT_ADDRESS = "${vaultAddress}"`)
      .replace(/export const AAPLC_CLIP_ADDRESS = "0x[a-fA-F0-9]*"/, `export const AAPLC_CLIP_ADDRESS = "${clipAddress}"`)
      .replace(/export const AAPLC_TALON_ADDRESS = "0x[a-fA-F0-9]*"/, `export const AAPLC_TALON_ADDRESS = "${talonAddress}"`);
    if (createVaultHash) {
      contractsTs = contractsTs.replace(/export const AAPLC_CREATE_VAULT_TX = "0x[a-fA-F0-9]*"/, `export const AAPLC_CREATE_VAULT_TX = "${createVaultHash}"`);
    }
  }
  fs.writeFileSync(contractsTsPath, contractsTs, "utf8");

  // 5. Record deploy details in memory.md
  appendToMemory(`- 2026-09-06 — Base 8453 Mined Deployment:
  - TalonFactory: \`${factoryAddress}\` (tx: https://basescan.org/tx/${deployHash})
  - TalonVault (AAPLc): \`${vaultAddress}\` (tx: https://basescan.org/tx/${createVaultHash})
  - ClipToken (clipAAPLc): \`${clipAddress}\`
  - TalonToken (talonAAPLc): \`${talonAddress}\``);

  // 6. Dust Tear Check
  const b20Abi = parseAbi([
    "function balanceOf(address) view returns (uint256)",
    "function allowance(address, address) view returns (uint256)",
    "function approve(address, uint256) returns (bool)",
    "function decimals() view returns (uint8)",
  ]);

  const userAaplBal = await publicClient.readContract({
    address: AAPLC,
    abi: b20Abi,
    functionName: "balanceOf",
    args: [account.address],
  });
  console.log(`\nDeployer AAPLc balance: ${userAaplBal} (raw units)`);

  if (userAaplBal < 1000n) {
    const skipMsg = `- 2026-09-06 — dust tear skipped: deployer AAPLc balance = ${userAaplBal} raw units (< 1000).`;
    console.log(skipMsg);
    appendToMemory(`  ${skipMsg}`);
    return;
  }

  const rawDust = 1000n; // 0.00001 AAPLc at 8 decimals
  console.log(`\n--- Step 4: Executing Dust Tear (${rawDust} raw units) ---`);

  // Simulate & send approve
  try {
    console.log("Simulating approve...");
    const { request: approveReq } = await publicClient.simulateContract({
      address: AAPLC,
      abi: b20Abi,
      functionName: "approve",
      args: [vaultAddress, rawDust],
    });
    const approveHash = await walletClient.writeContract(approveReq);
    console.log(`Approve tx: https://basescan.org/tx/${approveHash}`);
    await publicClient.waitForTransactionReceipt({ hash: approveHash });
    appendToMemory(`  - AAPLc approve tx: https://basescan.org/tx/${approveHash}`);
  } catch (err) {
    console.error("Approve reverted:", err);
    const data = err?.data || err?.cause?.data || "unknown";
    appendToMemory(`  - AAPLc approve reverted with data: \`${data}\``);
    process.exit(1);
  }

  // Simulate & send tear
  try {
    console.log("Simulating tear...");
    const { request: tearReq } = await publicClient.simulateContract({
      address: vaultAddress,
      abi: vaultArtifact.abi,
      functionName: "tear",
      args: [rawDust],
    });
    const tearHash = await walletClient.writeContract(tearReq);
    console.log(`Tear tx: https://basescan.org/tx/${tearHash}`);
    await publicClient.waitForTransactionReceipt({ hash: tearHash });
    console.log(`SUCCESS: Dust tear confirmed! Basescan: https://basescan.org/tx/${tearHash}`);
    appendToMemory(`  - TalonVault dust tear tx: https://basescan.org/tx/${tearHash}`);
  } catch (err) {
    console.error("Tear reverted:", err);
    const data = err?.data || err?.cause?.data || "unknown";
    appendToMemory(`  - TalonVault dust tear reverted with data: \`${data}\``);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("FATAL EXECUTION ERROR:", err);
  process.exit(1);
});
